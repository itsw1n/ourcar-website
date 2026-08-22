# =============================================================================
# Makefile — Wing's Buy n Sell (Next.js + Supabase)
# =============================================================================

.DEFAULT_GOAL := help

.PHONY: help dev dev-mock build lint test format format-check db-start db-stop db-reset db-types init deploy deploy-preview

help: ## Show all commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start Next.js dev server + local Supabase stack
	npx supabase start && npm run dev

dev-mock: ## Dev server in mock mode (no local Supabase required)
	NEXT_PUBLIC_DATA_SOURCE=mock npm run dev

build: ## Build Next.js for production
	npm run build

lint: ## Run ESLint
	npm run lint

test: ## Run Vitest
	npm run test

format: ## Format code with Prettier
	npm run format

format-check: ## Check formatting without writing
	npm run format:check

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

deploy: ## Deploy to Vercel production
	npx vercel --prod

deploy-preview: ## Deploy to Vercel preview
	npx vercel
