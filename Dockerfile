# syntax=docker/dockerfile:1

# ── Base: install dependencies ──────────────────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
# Install ALL deps (incl. dev) so the production build has tailwind/typescript.
RUN npm ci

# ── Builder: production standalone output ───────────────────────────────────
FROM base AS builder
# Build-time env (NEXT_PUBLIC_* are inlined into the client bundle at build).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_DATA_SOURCE
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_DATA_SOURCE=$NEXT_PUBLIC_DATA_SOURCE
COPY . .
# Next.js inlines NEXT_PUBLIC_* from a .env file at build time (not from the
# shell ENV), so materialize them here from the build args for the build step.
RUN printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nNEXT_PUBLIC_DATA_SOURCE=%s\n' \
  "$NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_DATA_SOURCE" > .env && \
  echo "materialized .env for next build (url=$NEXT_PUBLIC_SUPABASE_URL)"
RUN npm run build

# ── Runner: minimal production image ────────────────────────────────────────
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
# `.next/standalone` bundles its own minimal node_modules; copy it + static/public.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

# ── Dev: hot-reload via mounted source (used by docker-compose.override.yml) ─
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npx", "next", "dev", "--hostname", "0.0.0.0", "-p", "3000"]
