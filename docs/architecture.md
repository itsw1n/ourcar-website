# Wing's Buy n Sell — Architecture

This document applies the owner's Next.js rules to this specific project. `rules/nextjs.md` remains authoritative.

## 1. High-Level Shape

```text
Server-rendered public UI
        ↓
Queries / Services
        ↓
Supabase

Interactive browse/admin UI
        ↓
TanStack Query / Server Actions
        ↓
Services
        ↓
Supabase
```

## 2. Feature-Oriented Structure

Target structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── cars/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── admin/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── home/
│   ├── vehicles/
│   ├── categories/
│   ├── testimonials/
│   └── admin/
├── lib/
│   └── supabase/
├── config/
└── types/
```

## 3. Vehicles Feature

Likely target:

```text
features/vehicles/
├── components/
├── hooks/
├── queries/
├── actions/
├── services/
├── schemas/
├── types/
└── mock-data.ts
```

Start Medium.

For mutations:

```text
Admin form
→ Server Action
→ Vehicle Service
→ Supabase
```

Only add a repository if vehicle persistence becomes complex/reused enough to justify it.

Reads:

- Home featured vehicles: server read
- Vehicle detail: server read
- Browse page initial result: server read where useful
- Browser-driven search/filter/refetch: TanStack Query where justified

## 4. Browse Page State

Search/status/category state belongs in URL using `nuqs`.

Example:

```text
/cars?search=suzuki&status=available&category=mini-van
```

This makes the browse state:

- refresh-safe
- shareable
- back-button friendly

Do not put this state in Zustand.

## 5. TanStack Query

Use for server state in Client Components.

Expected use cases:

- interactive `/cars` result refresh
- admin vehicle list
- admin categories
- admin testimonials
- mutation invalidation

Do not use TanStack Query merely to fetch server-rendered initial page data.

## 6. React Aria

Use React Aria Components for controls where accessible interaction behavior matters:

- category select/listbox
- status tabs if implemented as tabs
- dialog/modal
- admin menus
- gallery controls where appropriate
- confirmation dialogs

Do not force React Aria into static layout components.

## 7. Forms

Use:

- Zod schema first
- React Hook Form
- zodResolver
- server-side validation again
- next-safe-action for UI-triggered mutations when appropriate

## 8. Supabase

Target infrastructure:

```text
src/lib/supabase/
├── client.ts
├── server.ts
└── admin.ts
```

Rules:

- browser client: anon
- server client: anon + cookies
- service role: server only
- RLS on all tables
- Supabase Auth for admin auth
- Storage for vehicle images

## 9. Admin Authorization

Admin status should be modeled in the application DB/profile layer and enforced:

- in server actions
- in protected server routes/layouts
- in RLS policies

Hiding a button is not authorization.

## 10. Server vs Client Boundaries

Keep public pages server-first.

Client components are expected for:

- GSAP/Lenis animation wrapper
- search/filter controls
- advanced gallery
- admin forms
- upload/reordering UI

Do not mark whole route trees `use client` merely because one subsection animates.

## 11. No Unnecessary API Layer

Do not add `/api/vehicles` just so a Server Component can read Supabase.

An HTTP route is justified only when a browser-driven query or real external consumer needs HTTP.

## 12. Error/Loading States

Each data feature should define:

- loading
- empty
- validation
- permission
- general failure behavior

Do not expose raw Supabase errors directly to public users.
