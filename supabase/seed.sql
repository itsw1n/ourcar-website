-- Wing's Buy n Sell — DEV seed (fake/test data only).
-- This file is applied by `supabase db reset` (local) and `make db:seed`.
-- It is NEVER run against production. Safe to re-run (truncates first).

truncate table public.vehicle_images, public.vehicles, public.testimonials, public.categories
  restart identity cascade;

insert into public.categories (name, slug) values
  ('Mini Van', 'mini-van'),
  ('Multi-Cab', 'multi-cab'),
  ('Van', 'van'),
  ('Truck', 'truck');

insert into public.vehicles
  (slug, brand, model, year, transmission, mileage_km, category_id, status, description, featured)
values
  ('suzuki-every-2022', 'Suzuki', 'Every', 2022, 'Automatic', 21000,
    (select id from public.categories where slug = 'mini-van'), 'available',
    'A tidy 2022 Suzuki Every with low mileage and a smooth automatic gearbox. Ideal for city errands and family runs around Davao.', true),
  ('nissan-nv100-2021', 'Nissan', 'NV100', 2021, 'Automatic', 18500,
    (select id from public.categories where slug = 'mini-van'), 'available',
    '2021 Nissan NV100 in great shape with an automatic transmission. A practical Japanese surplus mini van for daily use.', true),
  ('daihatsu-hijet-2021', 'Daihatsu', 'Hijet', 2021, 'Automatic', 19200,
    (select id from public.categories where slug = 'mini-van'), 'sold',
    'A 2021 Daihatsu Hijet that has already found its new owner. Shown here as an example of the units we source and prepare.', false),
  ('suzuki-carry-2020', 'Suzuki', 'Carry', 2020, 'Manual', 34000,
    (select id from public.categories where slug = 'multi-cab'), 'available',
    'A 2020 Suzuki Carry multi-cab with a manual transmission. Built for light hauling and tight city streets.', false),
  ('toyota-hiace-2019', 'Toyota', 'HiAce', 2019, 'Manual', 78000,
    (select id from public.categories where slug = 'van'), 'available',
    'A 2019 Toyota HiAce with a manual gearbox and higher mileage. A dependable workhorse van for passenger or cargo use.', true),
  ('mitsubishi-canter-2018', 'Mitsubishi', 'Fuso Canter', 2018, 'Manual', 96000,
    (select id from public.categories where slug = 'truck'), 'sold',
    'A 2018 Mitsubishi Fuso Canter that has been sold. A solid example of the larger trucks we occasionally handle.', false),
  ('mazda-bongo-2017', 'Mazda', 'Bongo', 2017, 'Manual', 88000,
    (select id from public.categories where slug = 'van'), 'sold',
    'A 2017 Mazda Bongo that has already been sold. Shown as an example of the vans we prepare for new owners.', false);

-- Each vehicle's gallery is MONOCHROME: three copies of the same seed image
-- (uploaded by scripts/seed-storage.mjs) so a car's photos aren't mixed colors.
-- Primary images (position 1) still differ across vehicles for card variety.
insert into public.vehicle_images (vehicle_id, storage_path, alt_text, position)
select
  v.id,
  paths.path,
  v.brand || ' ' || v.model,
  paths.pos
from public.vehicles v
join (
  values
    ('suzuki-every-2022',      array['seed/mock-car-1.png','seed/mock-car-1.png','seed/mock-car-1.png']),
    ('nissan-nv100-2021',      array['seed/mock-car-2.png','seed/mock-car-2.png','seed/mock-car-2.png']),
    ('daihatsu-hijet-2021',    array['seed/mock-car-3.png','seed/mock-car-3.png','seed/mock-car-3.png']),
    ('suzuki-carry-2020',      array['seed/mock-car-4.png','seed/mock-car-4.png','seed/mock-car-4.png']),
    ('toyota-hiace-2019',      array['seed/mock-car-3.png','seed/mock-car-3.png','seed/mock-car-3.png']),
    ('mitsubishi-canter-2018', array['seed/mock-car-1.png','seed/mock-car-1.png','seed/mock-car-1.png']),
    ('mazda-bongo-2017',       array['seed/mock-car-4.png','seed/mock-car-4.png','seed/mock-car-4.png'])
) as m (slug, paths)
  on v.slug = m.slug
cross join lateral unnest(m.paths) with ordinality as paths(path, pos);

insert into public.testimonials (display_name, quote, rating) values
  ('Mock Customer', 'Maayos kaayo ang unit. Salamat sir sa paspas ug honest na transaction!', 5),
  ('Mock Customer', 'Highly recommended. Quality unit and very approachable seller.', 5),
  ('Mock Customer', 'From conversion to delivery, solid kaayo. Smooth transaction.', 5);

-- Local dev admin login is created by scripts/seed-admin.mjs (Auth Admin API),
-- not here, because manual auth.users inserts are fragile. Credentials:
--   email: admin@local.dev   password: admin1234   (DEV ONLY — never prod)
