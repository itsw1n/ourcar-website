# Wing's Buy n Sell — Agent Instructions

This repository is intentionally prepared for agentic coding.

## 1. Read Before Editing

Before making changes, read these files in order:

1. `docs/specification.md`
2. `docs/design-system.md`
3. `docs/architecture.md`
4. `docs/database.md`
5. `docs/implementation-plan.md`
6. `rules/nextjs.md`
7. `rules/supabase.md`
8. `rules/tailwind-extensions.md`

The three files in `rules/` are authoritative technical rules supplied by the project owner. Do not silently replace them with another architecture.

## 2. Project Goal

Build a production-quality marketing and inventory website for **Wing's Buy n Sell**, a Davao City Japanese surplus mini van business.

There is no checkout, online payment, reservation, or customer account system. The public site's primary goals are:

- Browse all vehicles.
- Clearly distinguish Available vs Sold.
- Build trust through sold units, testimonials, and the founder story.
- Convert interested visitors into Messenger or phone inquiries.
- Allow the business owner/admin to manage vehicles, categories, images, statuses, and testimonials.

## 3. Approved Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- `@supabase/ssr`
- TanStack Query
- React Aria Components
- React Hook Form
- Zod
- nuqs
- next-safe-action
- Lucide React
- GSAP + ScrollTrigger
- Lenis
- `cn()` via clsx + tailwind-merge

Do not add a major alternative framework/library unless required by the specification.

## 4. Architecture

Follow `rules/nextjs.md`.

Key project-specific decisions:

- Server Components are the default.
- Keep animated/interacting boundaries client-side only when necessary.
- Public detail pages should favor server-rendered data for SEO.
- Browser-driven browse/search/filter state belongs in URL state via `nuqs`.
- TanStack Query is for client-side server state where interactive refetch/cache behavior is useful.
- Own UI mutations use Server Actions.
- Medium architecture is the default: Action → Service → Database.
- Escalate a feature to a Repository only when its DB access becomes meaningfully complex/shared.
- Do not create API routes just to let a Server Component fetch its own Supabase data.
- Keep feature code under `src/features/<feature>/`.

## 5. Styling Rules

Follow `rules/tailwind-extensions.md`.

Project-specific additions:

- Every reusable component must have a semantic `data-component` attribute.
- Every reusable component that accepts class customization must use `className={cn(...)}`.
- Use semantic design tokens rather than raw/hardcoded Tailwind brand colors.
- Design is white-first, editorial, clean, automotive, restrained.
- Avoid purple/blue AI gradients, excessive glassmorphism, excessive rounded cards, random glow effects, and unnecessary shadows.
- Use thin borders, large photography, strong typography, and deliberate whitespace.
- Red is an accent, not a background for entire sections.
- Animation must support hierarchy/storytelling, not decorate every element.

## 6. Accessibility

- Use React Aria Components where they improve accessibility for dialogs, selects, tabs, menus, buttons, listboxes, and other complex interactions.
- All interactive elements must be keyboard reachable.
- Preserve visible focus states.
- All meaningful images need alt text.
- Do not make status or meaning depend on color alone.
- Respect `prefers-reduced-motion`; GSAP/Lenis behavior must degrade appropriately.
- Do not implement custom interaction patterns if a standard accessible control is sufficient.

## 7. Public Routes

Required:

- `/` — Home
- `/cars` — all vehicles, with search + status + category filtering
- `/cars/[slug]` — vehicle detail
- `/about` — story/about
- `/contact` — contact information
- `/admin` — protected admin area
- `/admin/vehicles`
- `/admin/categories`
- `/admin/testimonials`

Do **not** create a separate `/sold` route. Sold vehicles are part of `/cars`.

## 8. Data Rules

- A vehicle has one status: `available` or `sold`.
- Sold vehicles remain visible.
- Categories are dynamic and managed by admin.
- A vehicle binds to one category.
- Vehicles can have multiple images with display order.
- No public price field is required.
- Use mileage/distance traveled, not fuel, in the default vehicle card.
- Messenger URL may be empty during development.
- Phone number must come from configuration, not be hardcoded in multiple components.

## 9. Admin Rules

Admin can:

- sign in
- add/edit/archive vehicles
- mark vehicle Available/Sold
- upload/reorder/delete vehicle photos
- manage categories
- manage testimonials

No customer roles or public accounts are needed.

All admin authorization must be enforced server-side and through Supabase RLS.

## 10. Supabase Rules

Follow `rules/supabase.md`.

- RLS on every table.
- `@supabase/ssr` for Next.js.
- anon key is public.
- service role is server-only.
- Supabase Auth, not custom JWT.
- Generate typed DB definitions after migrations.
- Storage policies must be explicit.
- Public vehicle images may use a public read bucket, but admin write operations require authentication.

## 11. Current Implementation Status

Implemented now:

- approved visual direction
- homepage reference implementation
- mock vehicle data
- semantic color tokens
- GSAP/Lenis hero/reveal animation
- reusable button example
- placeholder `/cars` route

Not implemented yet:

- Supabase
- Auth
- RLS
- database migrations
- real data
- TanStack Query provider/hooks
- React Aria browse controls
- URL filters
- vehicle detail page
- admin
- image upload
- rotating vehicle gallery
- testimonials management
- production SEO/deployment

Do not pretend unfinished features are complete.

## 12. Development Rule

Implement one phase at a time according to `docs/implementation-plan.md`.

Before each phase:

1. inspect existing code
2. identify existing reusable components/services
3. state which files will be changed
4. implement the smallest complete vertical slice
5. validate TypeScript/build/lint
6. summarize what changed and what remains

Never rewrite the entire project unnecessarily.
