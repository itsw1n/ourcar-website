-- Grants for RLS-protected tables.
-- RLS policies (in 0001_init.sql) control WHO can access rows; these GRANTs
-- give the roles the underlying table privileges so the policies can apply.
-- anon: public read only. authenticated: public read + admin DML.
-- service_role: full access (used by server-side admin/storage operations).

grant usage on schema public to anon, authenticated, service_role;

-- profiles
grant select on public.profiles to authenticated, service_role;
grant all privileges on public.profiles to service_role;

-- categories (public read + admin manage)
grant select on public.categories to anon, authenticated, service_role;
grant insert, update, delete on public.categories to authenticated, service_role;

-- vehicles (public read + admin manage)
grant select on public.vehicles to anon, authenticated, service_role;
grant insert, update, delete on public.vehicles to authenticated, service_role;

-- vehicle_images (public read + admin manage)
grant select on public.vehicle_images to anon, authenticated, service_role;
grant insert, update, delete on public.vehicle_images to authenticated, service_role;

-- testimonials (public read + admin manage)
grant select on public.testimonials to anon, authenticated, service_role;
grant insert, update, delete on public.testimonials to authenticated, service_role;

-- sequences (future-proof)
grant all privileges on all sequences in schema public to service_role;
