# The Guild Hall

Single-purpose GPK request board for `www.curatorsguild.com`.

The current build runs a collector request form on GitHub Pages and sends submissions through a Supabase Edge Function before writing into Supabase.

## Stack

- React + TypeScript + Vite
- Plain CSS
- Supabase Edge Functions
- Supabase Postgres
- Cloudflare Turnstile

## Local setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase project URL, anon key, and Cloudflare Turnstile site key.
4. Run the SQL in `supabase/card_requests.sql` inside the Supabase SQL editor.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Local note:
Vite reads `VITE_*` values at build time. If you change `.env.local`, restart the dev server.

## Browser env setup

These values are compiled into the frontend bundle:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TURNSTILE_SITE_KEY`

## Edge Function secrets

Set these in Supabase for the `submit-card-request` function:

- `CLOUDFLARE_TURNSTILE_SECRET_KEY`
- `ALLOWED_ORIGINS`

Suggested `ALLOWED_ORIGINS` value:

```text
https://curatorsguild.com,https://www.curatorsguild.com
```

If you want local browser testing against the hosted function, temporarily add your local origin as well:

```text
https://curatorsguild.com,https://www.curatorsguild.com,http://localhost:5173,http://127.0.0.1:5173
```

The function uses the built-in `SUPABASE_SERVICE_ROLE_KEY` secret to insert into `public.card_requests`, so the table no longer needs a public insert policy.

## GitHub Pages env setup

This site deploys through GitHub Actions, so the browser-side values above must also be added as GitHub Actions secrets for the build.

1. In GitHub, open the repository settings.
2. Go to `Secrets and variables` → `Actions`.
3. Add these secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TURNSTILE_SITE_KEY`
4. Redeploy the Pages workflow after saving them.

Deployment note:
Vite bakes these values into the production bundle during `npm run build`, so updating the secrets requires a fresh deploy to change the live site.

## Production build

```bash
npm run build
```

The site is configured for GitHub Pages and includes a `public/CNAME` for `www.curatorsguild.com`.
