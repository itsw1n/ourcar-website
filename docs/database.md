# Wing's Buy n Sell — Supabase Database Plan

Target schema for this project. Generic RLS/policy syntax and client setup live in
`playbooks/database/supabase.md` (authoritative) — do not duplicate here.

## 1. Tables

### `profiles`

Purpose: application profile/role for authenticated admin users.

Columns:

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `role text not null default 'ADMIN'`
- `created_at timestamptz`
- `updated_at timestamptz`

This project currently needs only admin users. Do not create customer profiles.

### `categories`

Columns:

- `id uuid primary key`
- `name text not null`
- `slug text unique not null`
- `is_active boolean not null default true`
- `created_at timestamptz`
- `updated_at timestamptz`

Rules:

- public can read active categories
- admin can manage categories
- archiving is preferred over destructive deletion when referenced by vehicles

### `vehicles`

Columns:

- `id uuid primary key`
- `slug text unique not null`
- `brand text not null`
- `model text not null`
- `year integer`
- `transmission text`
- `mileage_km integer`
- `category_id uuid references categories(id)`
- `status text not null check (status in ('AVAILABLE','SOLD'))`
- `description text`
- `featured boolean not null default false`
- `is_archived boolean not null default false`
- `created_at timestamptz`
- `updated_at timestamptz`

No price column required in v1.
No fuel column required in v1.

### `vehicle_images`

Columns:

- `id uuid primary key`
- `vehicle_id uuid not null references vehicles(id) on delete cascade`
- `storage_path text not null`
- `alt_text text`
- `sort_order integer not null default 0`
- `is_cover boolean not null default false`
- `created_at timestamptz`

Rules:

- many images per vehicle
- exactly one logical cover image should be preferred by application validation
- display order controlled by `sort_order`

### `testimonials`

Columns:

- `id uuid primary key`
- `display_name text not null`
- `quote text not null`
- `rating integer`
- `featured boolean not null default false`
- `is_active boolean not null default true`
- `created_at timestamptz`
- `updated_at timestamptz`

Mock testimonials exist only in development.

## 2. RLS Direction (policy intent only — syntax in playbook)

Enable RLS on **every** table (see `playbooks/database/supabase.md §Row Level Security`).

**Public read** (anon):

- active categories
- non-archived vehicles
- vehicle images belonging to visible vehicles
- active testimonials

**Authenticated admin** (service role / RLS check on `profiles.role = 'ADMIN'`):

- insert/update/archive vehicles
- manage categories
- manage images
- manage testimonials

Write the exact `CREATE POLICY` SQL in `supabase/migrations/` and review carefully.

## 3. Storage

Suggested bucket: `vehicle-images` (public read for marketing assets, admin write/delete
only). Policy syntax → `playbooks/database/supabase.md §Storage`. Never expose
service-role credentials to the browser.

## 4. Slugs

Use stable, unique slugs.

Example:

`2022-suzuki-every-abc123`

Do not assume `brand-model-year` is always unique.

## 5. Indexes

Consider indexes for:

- `vehicles.status`
- `vehicles.category_id`
- `vehicles.slug`
- `vehicles.featured`
- `vehicles.is_archived`
- `categories.slug`
- `vehicle_images.vehicle_id`
- `vehicle_images.sort_order`

Add search strategy only when implementing search. Do not prematurely add full-text infrastructure if simple `ilike` is sufficient for the expected inventory size.

## 6. Status

Database values:

- `AVAILABLE`
- `SOLD`

UI labels:

- Available
- Sold

Do not create a separate sold table.

## 7. Migrations

All schema changes live in `supabase/migrations/` as timestamped SQL. Workflow
(`npx supabase migration new` → `db reset` → `db push` → `gen types`) is in
`playbooks/migration/supabase-cli.md`.

After each schema change, regenerate `src/types/database.types.ts` via
`npx supabase gen types typescript --local > src/types/database.types.ts`.
Do not manually maintain generated DB types.
