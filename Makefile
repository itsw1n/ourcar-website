# =============================================================================
# Makefile — Wing's Buy n Sell (Next.js + Supabase)
# =============================================================================

.DEFAULT_GOAL := help

.PHONY: help dev build lint test db-start db-stop db-reset db-types init

help: ## Show all commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start Next.js dev server + local Supabase stack
	npx supabase start && npm run dev

build: ## Build Next.js for production
	npm run build

lint: ## Run ESLint
	npm run lint

test: ## Run Vitest
	npm run test

db-start: ## Start local Supabase stack
	npx supabase start

db-stop: ## Stop local Supabase stack
	npx supabase stop

db-reset: ## Reset local DB (apply migrations + seed)
	npx supabase db reset

db-types: ## Regenerate TypeScript types from Supabase schema
	npx supabase gen types typescript --local > src/types/database.types.ts

init: ## Scaffold project folder structure
	@mkdir -p src/{app,features,components/{ui,shared},lib/supabase,stores,types,schemas}
	@mkdir -p docs
	@echo "✅ Done. Run: make dev"
