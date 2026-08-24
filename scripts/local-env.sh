#!/usr/bin/env bash
# Exports local Supabase env vars for Makefile recipes (dev / db:seed).
# Only `set -a` so assignments are exported; do NOT enable `set -e` here —
# this script is sourced into Makefile shells and a leaked -e would abort them.
set -a

# `supabase status` can exit non-zero when some optional services are down
# (e.g. imgproxy/pooler); don't let that abort the shell.
ENV_OUT="$(supabase status -o env || true)"

export NEXT_PUBLIC_SUPABASE_URL="$(echo "$ENV_OUT" | grep '^API_URL=' | cut -d= -f2- | tr -d '"')"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="$(echo "$ENV_OUT" | grep '^ANON_KEY=' | cut -d= -f2- | tr -d '"')"
export SUPABASE_SERVICE_ROLE_KEY="$(echo "$ENV_OUT" | grep '^SERVICE_ROLE_KEY=' | cut -d= -f2- | tr -d '"')"
export DATABASE_URL="$(echo "$ENV_OUT" | grep '^DB_URL=' | cut -d= -f2- | tr -d '"')"
export NEXT_PUBLIC_DATA_SOURCE=supabase
