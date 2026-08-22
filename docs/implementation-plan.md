# Wing's Buy n Sell — Implementation Plan

Build in phases. Do not implement every phase in one uncontrolled pass.

## Phase 0 — Repository Foundation

Status: partly implemented.

Goals:

- project rules/docs present
- Next.js starter
- semantic Tailwind tokens
- `cn()` utility
- homepage visual reference
- mock vehicle data

Exit criteria:

- project installs
- homepage runs
- TypeScript/build succeeds

## Phase 1 — Public UI Foundation

Implement:

- shared header/footer
- final W logo component placeholder
- homepage sections
- `/about`
- `/contact`
- responsive behavior
- reduced-motion handling
- refine GSAP/Lenis boundaries

Keep mock data.

Do not add Supabase yet if the visual foundation is still unstable.

## Phase 2 — Browse Cars

Implement `/cars`.

Requirements:

- search input
- All / Available / Sold
- dynamic category UI using mock category data initially
- URL state via nuqs
- responsive card grid
- result count
- empty state
- accessible controls with React Aria where appropriate

No separate `/sold`.

## Phase 3 — Vehicle Detail

Implement `/cars/[slug]`.

Requirements:

- server-rendered vehicle data source abstraction
- metadata
- status
- vehicle facts
- premium horizontal/card-rotation gallery
- keyboard/touch support
- reduced-motion fallback
- Messenger + phone CTAs

Still acceptable to use mock data until the full public flow is visually validated.

## Phase 4 — Supabase Foundation

Implement:

- Supabase project configuration
- browser/server/admin clients
- migrations
- RLS
- generated DB types
- storage bucket/policies
- seed/dev data strategy

Tables:

- profiles
- categories
- vehicles
- vehicle_images
- testimonials

## Phase 5 — Real Public Data

Replace mock data with Supabase.

Rules:

- homepage server reads for featured/recent data
- vehicle details server reads
- browse page uses a justified server/client split
- TanStack Query only where interactive client caching/refetching is useful
- category/status/search behavior preserved

## Phase 6 — Admin Authentication

Implement:

- admin login
- protected admin layout
- server authorization
- RLS authorization
- basic dashboard metrics

No customer auth.

## Phase 7 — Vehicle Admin

Implement:

- add vehicle
- edit vehicle
- Available/Sold status
- archive
- category binding
- multiple image upload
- cover image
- image reordering
- validation
- mutation cache invalidation/revalidation

## Phase 8 — Category + Testimonial Admin

Implement:

- category create/edit/archive
- testimonial create/edit/archive
- featured/active state
- validation

## Phase 9 — Production Hardening

Implement/review:

- loading/error/not-found UI
- SEO metadata
- Open Graph
- sitemap/robots
- image optimization
- accessibility review
- reduced-motion review
- mobile performance
- Supabase policy review
- env validation
- production deployment configuration

## Phase 10 — Real Content

Replace development placeholders:

- real Messenger URL
- real phone number
- real inventory
- real vehicle images
- real testimonials
- final W logo asset if available
- approved business copy

Never leave mock testimonials presented as genuine customer reviews.
