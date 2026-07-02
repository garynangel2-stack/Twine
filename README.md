# Twine

Quotes, bookings & reminders on autopilot — software for local businesses that still run on
spreadsheets and phone calls (contractors, clinics & salons, event venues).

This repo contains **both halves** of the product:

- **Website portal** — the public marketing site + waitlist (`/`, `/privacy`, `/login`).
- **The app** — the customer-facing product (`/app`): dashboard, quote builder, bookings with
  automatic reminders, invoices with payment links, customers, and reminder settings.
- **Admin back office** — internal tools (`/admin`): waitlist management, business accounts, and
  platform metrics.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- A lightweight, dependency-free JSON data store (`src/lib/store.ts`) — no database to install.
  It auto-seeds demo data on first run and persists to `data/twine.json`.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

The app seeds a demo business and sample data automatically on first request.

### Demo logins

| Role                | Email             | Password  | Lands on |
| ------------------- | ----------------- | --------- | -------- |
| Business owner      | `owner@twine.app` | `twine123`| `/app`   |
| Admin (back office) | `admin@twine.app` | `admin123`| `/admin` |

### Reset demo data

```bash
npm run seed   # clears data/twine.json; the app reseeds on next start
```

## Project structure

```
src/
  app/
    page.tsx              # marketing site (website portal)
    login/                # login
    privacy/              # privacy policy
    app/                  # the product (owner-facing)
      page.tsx            #   dashboard
      quotes/             #   quote list, builder, detail
      bookings/           #   bookings + reminders
      invoices/           #   invoices + payment links
      customers/          #   customer directory
      settings/           #   reminder automation settings
    admin/                # admin back office
    api/                  # route handlers (auth, quotes, bookings, invoices, waitlist, admin…)
  components/             # UI components (client + server)
  lib/
    store.ts             # pure-JS data store + seed
    auth.ts              # signed-cookie sessions
    queries.ts           # owner-scoped reads
    admin.ts             # admin aggregates
    format.ts            # money/date/status helpers
```

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, "Add New… → Project" and import the repo. Framework preset: **Next.js** (auto-detected).
3. Set an environment variable `TWINE_SECRET` to a long random string (used to sign session cookies).
4. Deploy.

> **Note on data in production:** the built-in JSON store writes to the local filesystem, which is
> ephemeral on Vercel's serverless runtime — great for the demo/waitlist, but writes won't persist
> between deployments or across serverless instances. For real production data, swap `src/lib/store.ts`
> for a hosted database (e.g. Vercel Postgres, Neon, or Turso). The rest of the app talks to the store
> through the functions in `queries.ts`/`admin.ts`, so it's a contained change.

## Notes

- This is a working prototype. Reminders/emails/payment links are represented in the UI and activity
  log but are not wired to a real SMS/email/payment provider yet — that's the natural next step.
