begin;

create extension if not exists pgcrypto;

create table if not exists public.card_request_rate_limits (
  client_key text primary key,
  attempt_count integer not null default 1 check (attempt_count > 0),
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz
);

create table if not exists public.card_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  collector_name text not null,
  email text not null,
  whatnot_handle text,
  request_type text not null,
  set_name text,
  card_number text,
  card_name text,
  variation text,
  condition_preference text,
  budget_notes text,
  request_details text not null,
  source_page text not null default 'https://www.curatorsguild.com',
  status text not null default 'new'
);

create index if not exists card_requests_created_at_idx
  on public.card_requests (created_at desc);

create index if not exists card_request_rate_limits_blocked_until_idx
  on public.card_request_rate_limits (blocked_until);

alter table public.card_request_rate_limits
  drop constraint if exists card_request_rate_limits_client_key_check,
  add constraint card_request_rate_limits_client_key_check
    check (char_length(client_key) between 1 and 128);

alter table public.card_requests enable row level security;
alter table public.card_request_rate_limits enable row level security;

alter table public.card_requests
  drop constraint if exists card_requests_collector_name_check,
  drop constraint if exists card_requests_email_check,
  drop constraint if exists card_requests_request_type_check,
  drop constraint if exists card_requests_request_details_check,
  drop constraint if exists card_requests_status_check,
  drop constraint if exists card_requests_collector_name_length_check,
  drop constraint if exists card_requests_email_format_check,
  drop constraint if exists card_requests_whatnot_handle_length_check,
  drop constraint if exists card_requests_request_type_allowed_check,
  drop constraint if exists card_requests_set_name_length_check,
  drop constraint if exists card_requests_card_number_length_check,
  drop constraint if exists card_requests_card_name_length_check,
  drop constraint if exists card_requests_variation_length_check,
  drop constraint if exists card_requests_condition_preference_allowed_check,
  drop constraint if exists card_requests_budget_notes_length_check,
  drop constraint if exists card_requests_request_details_length_check,
  drop constraint if exists card_requests_source_page_allowed_check,
  drop constraint if exists card_requests_status_allowed_check,
  add constraint card_requests_collector_name_length_check
    check (char_length(collector_name) between 2 and 120),
  add constraint card_requests_email_format_check
    check (position('@' in email) > 1 and char_length(email) <= 320),
  add constraint card_requests_whatnot_handle_length_check
    check (whatnot_handle is null or char_length(whatnot_handle) <= 120),
  add constraint card_requests_request_type_allowed_check
    check (request_type in ('single-card', 'sketch-card', 'oddball-collectible', 'want-list', 'set-help')),
  add constraint card_requests_set_name_length_check
    check (set_name is null or char_length(set_name) <= 160),
  add constraint card_requests_card_number_length_check
    check (card_number is null or char_length(card_number) <= 40),
  add constraint card_requests_card_name_length_check
    check (card_name is null or char_length(card_name) <= 160),
  add constraint card_requests_variation_length_check
    check (variation is null or char_length(variation) <= 240),
  add constraint card_requests_condition_preference_allowed_check
    check (
      condition_preference is null
      or condition_preference in ('any-displayable', 'clean-raw', 'high-end', 'sealed-preferred')
    ),
  add constraint card_requests_budget_notes_length_check
    check (budget_notes is null or char_length(budget_notes) <= 240),
  add constraint card_requests_request_details_length_check
    check (char_length(request_details) between 12 and 3000),
  add constraint card_requests_source_page_allowed_check
    check (
      source_page ~ '^https://(www\.)?curatorsguild\.com(/.*)?$'
      or source_page ~ '^http://localhost(:[0-9]+)?(/.*)?$'
      or source_page ~ '^http://127\.0\.0\.1(:[0-9]+)?(/.*)?$'
    ),
  add constraint card_requests_status_allowed_check
    check (status in ('new', 'reviewing', 'matched', 'closed'));

drop policy if exists "Allow public request inserts" on public.card_requests;

revoke all on table public.card_requests from anon, authenticated;
revoke all on table public.card_request_rate_limits from anon, authenticated;

create or replace function public.enforce_card_request_rate_limit(req_client_key text)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
as $$
declare
  normalized_client_key text := left(coalesce(nullif(btrim(req_client_key), ''), 'unknown'), 128);
  rate_limit_window interval := interval '10 minutes';
  block_window interval := interval '30 minutes';
  max_attempts integer := 5;
  active_row public.card_request_rate_limits%rowtype;
  now_at timestamptz := now();
begin
  loop
    select *
      into active_row
      from public.card_request_rate_limits
      where client_key = normalized_client_key
      for update;

    if not found then
      begin
        insert into public.card_request_rate_limits (client_key, attempt_count, window_started_at)
        values (normalized_client_key, 1, now_at);

        return query select true, 0;
        return;
      exception
        when unique_violation then
          -- Retry after another request wins the insert race.
      end;
    elsif active_row.blocked_until is not null and active_row.blocked_until > now_at then
      return query
      select false, greatest(1, ceil(extract(epoch from active_row.blocked_until - now_at))::integer);
      return;
    elsif active_row.window_started_at <= now_at - rate_limit_window then
      update public.card_request_rate_limits
        set attempt_count = 1,
            window_started_at = now_at,
            blocked_until = null
        where client_key = normalized_client_key;

      return query select true, 0;
      return;
    elsif active_row.attempt_count + 1 > max_attempts then
      update public.card_request_rate_limits
        set attempt_count = active_row.attempt_count + 1,
            blocked_until = now_at + block_window
        where client_key = normalized_client_key;

      return query select false, floor(extract(epoch from block_window))::integer;
      return;
    else
      update public.card_request_rate_limits
        set attempt_count = active_row.attempt_count + 1,
            blocked_until = null
        where client_key = normalized_client_key;

      return query select true, 0;
      return;
    end if;
  end loop;
end;
$$;

revoke all on function public.enforce_card_request_rate_limit(text) from public, anon, authenticated;
grant execute on function public.enforce_card_request_rate_limit(text) to service_role;

commit;
