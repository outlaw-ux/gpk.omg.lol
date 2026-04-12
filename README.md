# Curator's Guild

Single-purpose GPK card request app for `gpk.omg.lol`.

The current build replaces the old link hub with a local request form that writes submissions into Supabase, including a Whatnot handle field for collector follow-up.

## Stack

- React + TypeScript + Vite
- Plain CSS
- Supabase browser client

## Local setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase project URL and anon key.
4. Run the SQL in `supabase/card_requests.sql` inside the Supabase SQL editor.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Local note:
Vite reads `VITE_*` values at build time. If you change `.env.local`, restart the dev server.

## GitHub Pages env setup

This site deploys through GitHub Actions, so Supabase values must be provided as GitHub Actions secrets for the build.

1. In GitHub, open the repository settings.
2. Go to `Secrets and variables` → `Actions`.
3. Add these secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy the Pages workflow after saving them.

Deployment note:
Vite bakes these values into the production bundle during `npm run build`, so updating the secrets requires a fresh deploy to change the live site.

## Production build

```bash
npm run build
```

The site is configured for GitHub Pages and includes a `public/CNAME` for `gpk.omg.lol`.
