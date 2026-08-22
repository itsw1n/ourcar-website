# Wing's Buy n Sell — Project Architecture (Project-Specific)

This file documents **only the decisions specific to this project**. General Next.js
architecture, folder map, Server/Client boundaries, Services/Repositories, TanStack Query,
React Aria, Forms, and Supabase client setup live in the canonical playbooks:

- `playbooks/stack/nextjs.md` — architecture, data flow, forms, nuqs, Server Actions
- `playbooks/database/supabase.md` — clients, RLS, auth, storage
- `playbooks/universal.md` — folder structure, naming, errors, git

Read those for the "why"; this file is the "what we decided".

---

## 1. Stack & Architecture Shape

- **Medium architecture default:** `Action → Service → Database`. Escalate to a
  `Repository` only when vehicle/category persistence becomes complex or shared.
- Public pages are **Server Components** first; only these are Client: GSAP/Lenis
  wrapper, search/filter controls, vehicle gallery, admin forms, upload/reorder UI.
- No `/api/vehicles` route just to let a Server Component read Supabase — use
  `Server Component → Query → Supabase` instead (see `playbooks/stack/nextjs.md §8-11`).

## 2. Feature-Oriented Structure (this repo)

```text
src/
├── app/
│   ├── page.tsx                # Home
│   ├── cars/page.tsx           # Browse (search + status + category)
│   ├── cars/[slug]/page.tsx    # Vehicle detail
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── admin/                  # protected: vehicles, categories, testimonials
├── components/ui/              # Button + future primitives
├── features/
│   ├── home/
│   ├── vehicles/               # types, mock-data (later: queries/actions/services/schemas)
│   ├── categories/
│   ├── testimonials/
│   └── admin/
├── lib/supabase/               # client.ts, server.ts, admin.ts (Phase 4)
└── types/                      # database.types.ts after migration
```

## 3. Vehicles Feature (current → target)

Today: `features/vehicles/{types/vehicle.ts, mock-data.ts}` + homepage uses mock data.
When Supabase lands (Phase 4-5), grow to:

```text
features/vehicles/
├── components/   # VehicleCard, gallery
├── hooks/        # TanStack Query (browser-driven browse refresh)
├── queries/      # server reads (featured, detail, browse initial)
├── actions/      # next-safe-action mutations
├── services/     # business ops (create/update/archive/mark status)
├── schemas/      # Zod (vehicle form, filters)
└── types.ts
```

Mutations flow: `Admin form → Server Action → Vehicle Service → Supabase`.

## 4. Browse Page State (URL, not memory)

- Search + status (`all`/`available`/`sold`) + category live in the URL via `nuqs`.
- Example: `/cars?search=suzuki&status=available&category=mini-van`
- Refresh-safe, shareable, back-button friendly. Do **not** use Zustand for this.

## 5. Admin Authorization

Enforce server-side in all three places (hiding a button is not authZ):

1. Server Actions (`if (!isAdmin) throw`)
2. Protected `admin/` layout / route guards
3. Supabase RLS policies (`playbooks/database/supabase.md §RLS`)

## 6. Error / Loading States (per data feature)

Define: loading · empty · validation · permission · general failure.
Never expose raw Supabase errors to public users — normalize via `AppError` (`playbooks/universal.md §Error Handling`).

## 7. Status Note

Implementation phases tracked in `docs/implementation-plan.md`. Do not present
unfinished features (Supabase, auth, admin) as complete.
