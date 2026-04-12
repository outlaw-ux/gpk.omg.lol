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
npm run dev
```

## Production build

```bash
npm run build
```

The site is configured for GitHub Pages and includes a `public/CNAME` for `gpk.omg.lol`.
