# ─────────────────────────────────────────────────────────────────────────────
# Wing's Buy n Sell — centralized task runner. Run `make help`.
# Environments: dev (dockerized local), prod (dockerized), dev-mock (host, no DB).
# Supabase is CLI-managed on the host in every mode.
# ─────────────────────────────────────────────────────────────────────────────
SHELL := /usr/bin/env bash
LOCAL_ENV = set -a; . ./scripts/local-env.sh; set +a;

.PHONY: help check lint format format-check typecheck build
.PHONY: dev dev-down dev-mock prod prod-down
.PHONY: supabase-start supabase-stop
.PHONY: db-reset db-seed db-clear db-types db-push

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

# ── Quality gate (mirrors CI) ─────────────────────────────────────────────────
check: lint format-check typecheck build ## Lint + format + types + build
lint: ## Lint (next lint)
	npm run lint
format: ## Format (prettier write)
	npm run format
format-check: ## Verify formatting (no write)
	npm run format:check
typecheck: ## Type-check (tsc --noEmit)
	npx tsc --noEmit
build: ## Production build
	npm run build

# ── Supabase lifecycle (primitives) ───────────────────────────────────────────
supabase-start: ## Start local Supabase
	supabase start
supabase-stop: ## Stop local Supabase
	supabase stop

# ── Dev (dockerized local) ────────────────────────────────────────────────────
dev: supabase-start ## Local dev: Supabase + app+nginx in Docker (hot reload)
	$(LOCAL_ENV) docker compose up --build
dev-down: ## Stop dev Docker stack (keeps Supabase running)
	docker compose down
dev-mock: ## Host dev, no database (mock data source)
	npm run dev

# ── Prod (dockerized) ─────────────────────────────────────────────────────────
prod: ## Build + run production stack with .env.prod (TLS-ready)
	docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build
prod-down: ## Stop production Docker stack
	docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml down

# ── Database ───────────────────────────────────────────────────────────────────
db-reset: supabase-start ## Full reset: schema+migrations+seed+images+admin
	supabase db reset
	$(LOCAL_ENV) node scripts/seed-storage.mjs && node scripts/seed-admin.mjs && psql "$$DATABASE_URL" -c "update public.profiles set role='admin' where id=(select id from auth.users where email='admin@local.dev');"
db-seed: supabase-start ## Re-seed data/images/admin onto current schema (no migration change)
	$(LOCAL_ENV) psql "$$DATABASE_URL" -f supabase/seed.sql && node scripts/seed-storage.mjs && node scripts/seed-admin.mjs && psql "$$DATABASE_URL" -c "update public.profiles set role='admin' where id=(select id from auth.users where email='admin@local.dev');"
db-clear: supabase-start ## Truncate content only — keeps schema, migrations, admin
	$(LOCAL_ENV) psql "$$DATABASE_URL" -c "truncate table public.vehicle_images, public.vehicles, public.categories, public.testimonials restart identity cascade;"
db-types: ## Regenerate src/types/database.types.ts
	supabase gen types typescript --local > src/types/database.types.ts
db-push: ## Push migrations to PROD (never seeds)
	supabase db push
