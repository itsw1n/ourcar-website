# Wing's Buy n Sell — Agent Instructions

> **This file is always loaded.** Keep it lean. Rules detail lives in `playbooks/` (lazy `Read`).
> Project business truth lives in `docs/`. See `RULES.md` for the `concern → playbook §` map.
> **Load order per task:** `AGENTS.md` (now) → only the one `docs/` file + one `playbooks/` § you need. Never read all playbooks eagerly.

## Stack Snapshot
Next.js 15 (App Router) + TypeScript + Tailwind + Supabase (PostgreSQL/Auth/Storage) + @supabase/ssr.
Frontend libs: TanStack Query, React Aria, React Hook Form, Zod, nuqs, next-safe-action, Lucide, GSAP/ScrollTrigger, Lenis, `cn()`.
Full snapshot → `CONTEXT.md`.

## Folder Map
`src/app/` routes · `src/features/<name>/{components,hooks,queries,actions,services,schemas,types}` · `src/components/ui|shared` · `src/lib/supabase` · `playbooks/` rules · `docs/` business. Full map → `playbooks/universal.md §Folder Structure`.

## Business Rules (brief)
- Vehicle status: `available` | `sold`. Sold stays visible, clearly labeled, searchable.
- Categories dynamic, admin-managed; one category per vehicle; no hardcoded category list.
- Vehicles: multiple ordered images, no public price, mileage not fuel on cards.
- Public routes: `/` `/cars` `/cars/[slug]` `/about` `/contact` `/admin/*`. No separate `/sold`.
- Contact: Messenger + phone from env (`NEXT_PUBLIC_MESSENGER_URL`, `NEXT_PUBLIC_BUSINESS_PHONE`), never hardcoded.
- Admin: sign in, CRUD vehicles/categories/testimonials, mark status, image upload/reorder. AuthZ server-side + RLS only.
- Detail → `docs/specification.md`. Visual → `docs/design-system.md`. Phases → `docs/implementation-plan.md`.

## Architecture Invariants (→ `playbooks/stack/nextjs.md`)
- Server Components default; `"use client"` only where browser behavior is required.
- Medium default: `Action → Service → Database`. Add `Repository` only when DB access is complex/shared.
- Browse/search/filter state → URL via `nuqs` (not Zustand).
- TanStack Query only for client-side server state (interactive refetch/cache), not initial SSR data.
- No `/api/*` just so a Server Component can read its own Supabase data.
- Forms: Zod first → React Hook Form → server re-validation → next-safe-action.

## Supabase Invariants (→ `playbooks/database/supabase.md`)
- RLS on **every** table. Anon key public; service role server-only (never `NEXT_PUBLIC_`).
- Clients: `lib/supabase/client.ts` (browser), `server.ts` (server+cookies), `admin.ts` (service role, server only).
- Auth = Supabase Auth, not custom JWT. Regenerate `src/types/database.types.ts` after migrations.
- Storage bucket `vehicle-images`: public read, admin write/delete.

## Styling Invariants (→ `playbooks/styling/tailwind-extensions.md`)
- `cn()` for all conditional classes; semantic tokens (`bg-primary`, not `#hex`).
- Every reusable component: `data-component="name"` + `className={cn(...)}`.
- White-first editorial; red accent only (CTA, labels, active states). No AI gradients/glassmorphism.
- Respect `prefers-reduced-motion` (disable Lenis/scrub). React Aria for accessible controls.

## Universal Invariants (→ `playbooks/universal.md`)
- `@/` absolute imports; `strict` TS, no `any` (use `unknown`); Zod at boundaries.
- Naming: `camelCase` fns/vars, `PascalCase` components, `is/has/can` booleans. One responsibility per file/function.
- Errors: `AppError` + route on `error.code`, never message; never leak internals.
- Git: branch off `dev`; `type(scope): description`; never push/PR unless asked.
- No `console.log` / `debugger` / TODO / hardcoded secrets in commits.

## Dev Workflow
- Implement one phase at a time per `docs/implementation-plan.md`.
- Reuse existing components/services before creating. Smallest complete vertical slice. Validate `tsc`/build/lint. Summarize changes + remaining.
- DB tasks: `make db-reset` / `make db-types` (see `Makefile`). Do not mark unfinished features complete.

## Where to read detail
`RULES.md` → table mapping every concern to its `playbooks/` file + section.
