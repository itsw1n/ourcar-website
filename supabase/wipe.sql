-- Wing's Buy n Sell — DEV wipe. Removes all local content data (keeps schema + admin profile).
-- Run via `make db:wipe` (or `supabase db reset --no-seed`).

truncate table public.vehicle_images, public.vehicles, public.testimonials, public.categories
  restart identity cascade;
