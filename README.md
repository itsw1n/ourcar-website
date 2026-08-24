<p align="center">
  <img src="public/logo.png" alt="Wing's Buy n Sell" width="150" />
</p>

<h1 align="center">Wing's Buy n Sell</h1>

<p align="center">
  A white-first, editorial digital showroom for Japanese surplus vehicles in Davao City.
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" /></a>
  <img src="https://img.shields.io/badge/License-MIT-#D4111B?style=for-the-badge" alt="License" />
</p>

---

Wing's Buy n Sell is a Davao City business focused on Japanese surplus mini vans. The
website is a **digital showroom and trust-building site** — it does not process
transactions. Buyers browse available and sold vehicles, inspect them in detail, and
then reach out through Messenger or phone.

## Features

**Public site**

- Editorial homepage with featured inventory and the owner's work story.
- Browse and filter vehicles by search, status (available / sold), and category.
- Vehicle detail pages with image gallery, specifications, and related units.
- About and contact pages, with contact actions wired to business Messenger/phone.

**Admin**

- Authenticated admin area (Supabase Auth) for maintaining inventory without code edits.
- Vehicle CRUD with multi-image upload to Supabase Storage.
- Category management and testimonial management.

**Data sources**

- **Mock mode** (`NEXT_PUBLIC_DATA_SOURCE=mock`) — runs with zero database, ideal for local UI work.
- **Supabase mode** — real Postgres, Auth, and Storage in production or full local dev.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- [TanStack Query](https://tanstack.com/query) for client server-state
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/) for accessible controls
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms/validation
- [nuqs](https://nuqs.dev) for URL-driven filter state
- [Lucide React](https://lucide.dev) icons
- [GSAP](https://gsap.com) + ScrollTrigger and [Lenis](https://lenis.darkroom.engineering) for motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (only needed for the full local stack)

### Install

```bash
npm install
```

### Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Key variables:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_MESSENGER_URL`
- `NEXT_PUBLIC_DATA_SOURCE` — `mock` (no database) or `supabase`

### Develop (mock mode, no database)

```bash
npm run dev
# open http://localhost:3000
```

### Develop (full local Supabase stack)

```bash
make dev          # supabase start + inject local env + npm run dev
```

Reset and seed the database, then regenerate types:

```bash
make db-reset    # migrations + seed data + seed images + admin
make db-seed     # re-seed data/images/admin without a full reset
make db-types    # regenerate src/types/database.types.ts
```

## Self-hosting (Docker)

The frontend is containerized (Next.js behind an nginx reverse proxy). Supabase is
managed via the CLI locally and hosted in production.

```bash
# Local dev (fully containerized)
make docker-dev        # supabase start + app + nginx in Docker; open http://localhost
make docker-dev-down

# Production
cp .env.prod.example .env.prod   # fill with HOSTED Supabase values
make docker-prod
make docker-prod-down
```

**Required runtime/env vars**
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_DATA_SOURCE=supabase`
  are inlined into the client bundle at **build** time (passed as build args).
- `SUPABASE_SERVICE_ROLE_KEY` is read at **runtime** by the server for server-side data
  access. It is server-only (never sent to the browser) and must be present in the
  container environment (it lives in `.env.prod` / the dev `local-env.sh` export).
  Without it, public pages fail with `supabaseKey is required`.
- TLS: `docker-compose.prod.yml` serves HTTP by default; swap the nginx volume to
  `nginx/prod.tls.conf` and mount `nginx/certs/` to enable TLS.

## Project Structure

```
src/
  app/                 # routes: /, /about, /cars, /cars/[slug], /contact, /login, /admin
  features/            # domain modules: vehicles, categories, testimonials, auth, admin, about, home
  components/          # ui/ (Button) and shared/ (header, footer, providers)
  lib/supabase/        # browser, server, admin clients + requireUser
  types/               # generated Supabase database types
supabase/              # migrations, seed, config
docs/                  # specification, design-system, architecture, playbooks
```

## Admin & Auth

- Sign in at `/login`; the `/admin` layout redirects unauthenticated users.
- Create the first admin via `make db-seed` (sets a local profile role to `admin`).
- Mock testimonials must not be presented as real customer testimonials in production.

## Design

White-first, editorial, automotive — strong typography, large vehicle photography,
restrained red accent, thin borders, deliberate whitespace. See
[`docs/design-system.md`](docs/design-system.md) for the full direction (and what to
avoid: gradients, neon glows, glassmorphism).

## For AI Coding Agents

This repo is configured for agent-assisted development. Before editing code, read:

- `AGENTS.md` (always loaded — the source of truth for stack, branching, and conventions)
- `docs/` and `playbooks/`

Treat those files as authoritative over this README.

## Screenshots

<!-- Add screenshots here manually (e.g. ![Home](docs/screenshots/home.png)) -->

## License

MIT
