begin;

create extension if not exists pgcrypto;

create table if not exists public.card_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  collector_name text not null check (char_length(collector_name) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  whatnot_handle text,
  request_type text not null check (
    request_type in ('single-card', 'sketch-card', 'oddball-collectible', 'want-list', 'set-help')
  ),
  set_name text,
  card_number text,
  card_name text,
  variation text,
  condition_preference text,
  budget_notes text,
  request_details text not null check (char_length(request_details) between 12 and 3000),
  source_page text not null default 'gpk.omg.lol',
  status text not null default 'new' check (status in ('new', 'reviewing', 'matched', 'closed'))
);

create index if not exists card_requests_created_at_idx
  on public.card_requests (created_at desc);

alter table public.card_requests enable row level security;

drop policy if exists "Allow public request inserts" on public.card_requests;

create policy "Allow public request inserts"
  on public.card_requests
  for insert
  to anon, authenticated
  with check (true);

commit;
