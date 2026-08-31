# =============================================================================
# Makefile — Wing's Buy n Sell (Next.js + Supabase)
# =============================================================================

.DEFAULT_GOAL := help

SHELL := /usr/bin/env bash
.SHELLFLAGS := -eu -o pipefail -c
LOCAL_ENV = set -a; . ./scripts/local-env.sh; set +a;

.PHONY: help check lint format format-check typecheck build
.PHONY: dev dev-mock dev-down prod prod-down init
.PHONY: supabase-start supabase-stop supabase-status db-start db-stop
.PHONY: db-reset db-reset-clean db-seed db-clear db-types db-diff migration
.PHONY: deploy deploy-preview

help: ## Show all commands
	@awk 'BEGIN {FS = ":.*## "} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)} \
		/^[a-zA-Z_-]+:.*## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

##@ Development

dev: supabase-start ## Start Next.js with local Supabase
	@. scripts/local-supabase-env.sh && NEXT_PUBLIC_DATA_SOURCE=supabase npm run dev

dev-mock: ## Dev server in mock mode (no local Supabase required)
	NEXT_PUBLIC_DATA_SOURCE=mock npm run dev

dev-down: ## Stop dev Docker stack (keeps Supabase running)
	docker compose down

prod: ## Build + run production stack with .env.prod (TLS-ready)
	docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build

prod-down: ## Stop production Docker stack
	docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml down

init: ## Scaffold project folder structure
	@mkdir -p src/{app,features,components/{ui,shared},lib/supabase,stores,types,schemas}
	@mkdir -p docs
	@echo "✅ Done. Run: make dev"

##@ Quality

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
test: ## Run Vitest
	npm run test

##@ Supabase

supabase-start: ## Start the local Supabase stack
	npx supabase start

supabase-stop: ## Stop the local Supabase stack
	npx supabase stop

supabase-status: ## Show local Supabase status
	npx supabase status

db-start: supabase-start ## Alias for supabase-start
db-stop: supabase-stop ## Alias for supabase-stop

##@ Database

db-reset: supabase-start ## Reset local DB, apply migrations, and seed
	npx supabase db reset --local

db-reset-clean: supabase-start ## Reset local DB without seed data
	npx supabase db reset --local --no-seed

db-seed: supabase-start ## Re-seed data/images/admin onto current schema (no migration change)
	$(LOCAL_ENV) psql "$$DATABASE_URL" -f supabase/seed.sql && node scripts/seed-storage.mjs && node scripts/seed-admin.mjs && psql "$$DATABASE_URL" -c "update public.profiles set role='admin' where id=(select id from auth.users where email='admin@local.dev');"

db-clear: supabase-start ## Truncate content only — keeps schema, migrations, admin
	$(LOCAL_ENV) psql "$$DATABASE_URL" -c "truncate table public.vehicle_images, public.vehicles, public.categories, public.testimonials restart identity cascade;"

db-types: ## Regenerate TypeScript types from Supabase schema
	@mkdir -p src/types
	@temp_file=$$(mktemp src/types/.database.types.ts.XXXXXX); \
		trap 'rm -f "$$temp_file"' EXIT; \
		npx supabase gen types typescript --local > "$$temp_file"; \
		mv "$$temp_file" src/types/database.types.ts; \
		trap - EXIT

##@ Migrations

db-diff migration: export MIGRATION_NAME := $(value name)

db-diff: ## Create a local schema diff (name required)
	@migration_name="$${MIGRATION_NAME-}"; \
		if [[ ! "$$migration_name" =~ ^[A-Za-z0-9][A-Za-z0-9_-]*$$ ]]; then \
			printf 'Usage: make db-diff name=<migration-name>\n' >&2; \
			exit 2; \
		fi; \
		npx supabase db diff --local --file "$$migration_name"

migration: ## Create a migration (name required)
	@migration_name="$${MIGRATION_NAME-}"; \
		if [[ ! "$$migration_name" =~ ^[A-Za-z0-9][A-Za-z0-9_-]*$$ ]]; then \
			printf 'Usage: make migration name=<migration-name>\n' >&2; \
			exit 2; \
		fi; \
		npx supabase migration new "$$migration_name"

##@ Deployment

deploy: ## Deploy to Vercel production
	npx vercel --prod

deploy-preview: ## Deploy to Vercel preview
	npx vercel
