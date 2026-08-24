# ── Local full stack (Supabase + Next.js against LOCAL db) ──
dev:
	supabase start
	set -a; . ./scripts/local-env.sh; set +a; npm run dev

stop:
	supabase stop
	-pkill -f "next dev" || true

# Mock-only (zero database) dev
dev-mock:
	npm run dev

# Supabase lifecycle
supabase-start:
	supabase start
supabase-stop:
	supabase stop

# Wipe + migrations + seed data + seed images + admin (fresh local fake data)
db-reset:
	supabase db reset
	set -a; . ./scripts/local-env.sh; set +a; node scripts/seed-storage.mjs && node scripts/seed-admin.mjs && psql "$$DATABASE_URL" -c "update public.profiles set role='admin' where id=(select id from auth.users where email='admin@local.dev');"

# Re-seed data + images + admin onto current schema (no full reset)
db-seed:
	set -a; . ./scripts/local-env.sh; set +a; psql "$$DATABASE_URL" -f supabase/seed.sql && node scripts/seed-storage.mjs && node scripts/seed-admin.mjs && psql "$$DATABASE_URL" -c "update public.profiles set role='admin' where id=(select id from auth.users where email='admin@local.dev');"

# Fully wipe local content data (keeps schema + admin profile)
db-wipe:
	supabase db reset --no-seed

# Regenerate src/types/database.types.ts from local schema
db-types:
	supabase gen types typescript --local > src/types/database.types.ts

# Push migrations to linked PROD project (never seeds)
db-push:
	supabase db push

# Quality gates
lint:
	npm run lint
format:
	npm run format
format-check:
	npm run format:check
typecheck:
	npx tsc --noEmit
build:
	npm run build
