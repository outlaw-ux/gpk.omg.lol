# AGENTS.md

## Project

The Guild Hall is a small static resource website for Garbage Pail Kids collectors, buyers, sellers, and traders.

Important brand clarification:
- "The Guild Hall" is metaphorical. It is not a physical venue.
- Treat it as a digital resource index/library.
- Copy should describe a website, resource hub, index, library, or archive, not a real place people visit.

Primary production domain:
- `gpk.omg.lol`

## Product Intent

Current goals:
- give collectors fast access to useful links
- make the most important actions obvious
- feel curated, credible, and collector-first
- stay lightweight and easy to expand

Future growth areas:
- searchable resources
- tags
- categories
- featured entries
- submission workflows

Important:
- future plans are internal context, not homepage copy
- user-facing content should focus on what is actually usable now

## Brand And Tone

Visual direction:
- premium hobby-web feel
- dark or softly tinted backgrounds
- purple / blue palette
- polished, readable, lightweight
- subtle borders, layered surfaces, restrained glow

Avoid:
- childish fantasy copy
- tacky gamer visuals
- clutter
- noisy gradients
- anything that makes the site feel like a marketplace

Copy direction:
- clear
- concise
- useful
- slightly branded, but not theatrical

Do:
- make the above-the-fold area immediately actionable
- treat the homepage like a useful link hub, not a marketing page
- write with taste and specificity instead of generic "resource site" language
- use `GeePeeKay.com` with that exact casing

Do not:
- explain the obvious, such as that links work or that the site contains resources
- fill the hero with a list of the same sites already shown in the cards below
- invent conceptual labels like "workbenches" unless they correspond to something the user can actually do
- use forward-looking "version 1", "coming next", "future library", or similar framing in visible copy

## Stack

- React
- TypeScript
- Vite
- plain CSS
- Radix UI primitives for simple accessible structure

Core files:
- [`src/App.tsx`](src/App.tsx)
- [`src/data/siteContent.ts`](src/data/siteContent.ts)
- [`src/components/`](src/components/)
- [`src/styles/tokens.css`](src/styles/tokens.css)
- [`src/styles/global.css`](src/styles/global.css)
- [`src/styles/app.css`](src/styles/app.css)

## Content Source Of Truth

Homepage content is data-driven.

Do not hard-code resource text into presentation components if it belongs in data.

Use [`src/data/siteContent.ts`](src/data/siteContent.ts) for:
- site metadata
- nav links
- featured resources
- hero actions
- footer links

If the same outbound URL is reused in multiple places, extract it to a shared constant instead of repeating the raw string.

Current key resources include:
- item request Google Form
- Whatnot seller invite
- Whatnot buyer invite
- GeePeeKay.com
- GPKNews
- PriceCharting
- 130Point
- Pirate Ship

## Branding Assets

Brand assets live in:
- [`public/brand/the-guild-hall-emblem.png`](public/brand/the-guild-hall-emblem.png)
- [`public/brand/the-guild-hall-logo.png`](public/brand/the-guild-hall-logo.png)

Use the emblem for favicon/browser chrome and compact branding.
Use the full logo where a larger brand lockup is appropriate.

Do not let the full logo dominate the hero just because the asset exists.
If the logo feels oversized or decorative instead of useful, prefer compact branding.

## Deployment

This site is intended for GitHub Pages.

Important:
- deploy the built `dist/` output, not the raw repo root
- Pages must use GitHub Actions, not legacy branch publishing

Workflow:
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Pages/domain notes:
- authoritative CNAME file is [`public/CNAME`](public/CNAME)
- domain should be `gpk.omg.lol`

Known failure mode:
- if Pages is configured as "Deploy from branch" using repo root, GitHub will serve raw [`index.html`](index.html) with `/src/main.tsx`
- that causes module MIME errors and literal `%BASE_URL%` asset failures

## Local Development

Install:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

The build script intentionally type-checks both app code and `vite.config.ts` before building.

## Link Behavior

For links:
- internal section links such as `#resources` should stay in the same tab
- external `http` or `https` links should open in a new tab
- external links should include `rel="noreferrer"` unless there is a specific reason not to

## Submission Flows

For collector submissions and request flows:
- prefer a Google Form when a hosted form is acceptable
- if a custom on-site form needs to write into Google Sheets, post to a server-side endpoint or Google Apps Script web app
- do not call the Google Sheets API directly from browser code with embedded credentials

## Editing Guidance

When making changes:
- preserve the collector-first tone
- keep the site semantically simple
- prefer updating structured data over duplicating markup
- keep components reusable and boring in the good way
- avoid introducing a router or unnecessary app complexity unless the product actually needs it
- keep repository documentation portable; use repo-relative paths in markdown, not absolute local filesystem paths

When changing copy:
- do not describe The Guild Hall like a physical clubhouse
- do not over-fantasize the writing
- do not make the site sound like a sales funnel
- do not narrate the site's purpose when the UI itself can show it
- do not repeat the same resource list in both prose and cards
- do not stuff page titles, meta descriptions, or intro copy with a roll call of linked sites
- prefer direct task language over abstract concepts

## Pull Requests

PR titles and bodies must describe the actual diff on the current branch.

Do not:
- reuse old scaffold/setup phrasing
- mention Vite, shared components, deployment, setup, or branding assets unless that branch is actually changing them
- carry forward stale "build the site" language after the site already exists

Before updating a PR title or body:
- compare the branch against `main`
- summarize only the work that is actually part of that branch

When changing deployment:
- keep asset paths Vite-compatible
- keep GitHub Pages compatibility intact
- verify `npm run build` before finishing
