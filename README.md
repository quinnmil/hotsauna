# hotsauna

A tiny status page for a wood-fired sauna. One button: tap it when you light the stove. Anyone visiting the page can see whether the sauna is currently going, and who lit it.

## How it works

- Tap **Light the fire**, optionally with your name. The sauna is considered lit for the next 2 hours.
- While lit, the page reads "Lit by {name}" and the button changes to **Stoke the fire**. Subsequent taps in the same window show "Stoked by {name}".
- After 2 hours of no activity, the sauna goes cold and the page reflects that, along with when it was last lit.
- The page polls every 10 seconds, so anyone with it open sees state changes without refreshing.

## Stack

- Next.js (App Router) on Vercel
- Postgres via the Vercel Marketplace (Neon), accessed through Drizzle ORM
- Tailwind for styling
- Favicon served from Vercel Blob (URL injected via the `ICON_URL` env var)

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (auto-provisioned by the Neon integration) |
| `ICON_URL` | URL of the favicon asset in Vercel Blob |
| `LOCATION_NAME` | Optional label shown in the header. Defaults to `hotsauna`. |

Pull these locally with `vercel env pull .env.local`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deployed via Vercel. Pushes to the default branch ship to production.
