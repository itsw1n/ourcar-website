-- Wing's Buy n Sell — initial schema (v1)
-- Application domain uses lowercase status: 'available' | 'sold'.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid (),
  name text not null unique,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  brand text not null,
  model text not null,
  year int not null,
  transmission text not null default 'Automatic',
  mileage_km int not null default 0,
  category_id uuid references public.categories (id) on delete set null,
  status text not null default 'available' check (status in ('available', 'sold')),
  description text,
  featured boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

create index if not exists vehicles_status_idx on public.vehicles (status);
create index if not exists vehicles_category_id_idx on public.vehicles (category_id);
create index if not exists vehicles_featured_idx on public.vehicles (featured);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid (),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position int not null default 0,
  created_at timestamptz not null default now ()
);

create index if not exists vehicle_images_vehicle_id_idx on public.vehicle_images (vehicle_id);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid (),
  display_name text not null,
  quote text not null,
  rating int not null check (rating between 1 and 5),
  is_visible boolean not null default true,
  created_at timestamptz not null default now (),
  updated_at timestamptz not null default now ()
);

-- ─────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now ();
  return new;
end;
$$;

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at ();

create trigger vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at ();

create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at ();

-- Auto-create an admin profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user ();

-- Admin check used by RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid ()
      and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.testimonials enable row level security;

-- Public (anon) read access for published content.
create policy "Public read active categories"
  on public.categories for select
  using (is_active = true);

create policy "Public read visible vehicles"
  on public.vehicles for select
  using (is_archived = false);

create policy "Public read vehicle images"
  on public.vehicle_images for select
  using (true);

create policy "Public read visible testimonials"
  on public.testimonials for select
  using (is_visible = true);

-- Admin (full) access gated by role.
create policy "Admins read profiles"
  on public.profiles for select
  using (public.is_admin ());

create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin ()) with check (public.is_admin ());

create policy "Admins manage vehicles"
  on public.vehicles for all
  using (public.is_admin ()) with check (public.is_admin ());

create policy "Admins manage vehicle images"
  on public.vehicle_images for all
  using (public.is_admin ()) with check (public.is_admin ());

create policy "Admins manage testimonials"
  on public.testimonials for all
  using (public.is_admin ()) with check (public.is_admin ());

-- ─────────────────────────────────────────────────────────────
-- Storage: vehicle-images bucket (public read, admin write)
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = true;

create policy "Public read vehicle images bucket"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "Admins upload vehicle images"
  on storage.objects for insert
  with check (bucket_id = 'vehicle-images' and public.is_admin ());

create policy "Admins update vehicle images"
  on storage.objects for update
  using (bucket_id = 'vehicle-images' and public.is_admin ());

create policy "Admins delete vehicle images"
  on storage.objects for delete
  using (bucket_id = 'vehicle-images' and public.is_admin ());
