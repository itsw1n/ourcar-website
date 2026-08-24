#!/usr/bin/env bash
# Exports local Supabase env vars for Makefile recipes (dev / db:seed).
set -euo pipefail

ENV_OUT="$(supabase status -o env)"

export NEXT_PUBLIC_SUPABASE_URL="$(echo "$ENV_OUT" | grep '^API_URL=' | cut -d= -f2- | tr -d '"')"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="$(echo "$ENV_OUT" | grep '^ANON_KEY=' | cut -d= -f2- | tr -d '"')"
export SUPABASE_SERVICE_ROLE_KEY="$(echo "$ENV_OUT" | grep '^SERVICE_ROLE_KEY=' | cut -d= -f2- | tr -d '"')"
export DATABASE_URL="$(echo "$ENV_OUT" | grep '^DB_URL=' | cut -d= -f2- | tr -d '"')"
export NEXT_PUBLIC_DATA_SOURCE=supabase
