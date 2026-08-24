# syntax=docker/dockerfile:1

# ── Base: install dependencies ──────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat
COPY package*.json ./
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
RUN npm run build

# ── Runner: minimal production image ────────────────────────────────────────
FROM node:20-alpine AS runner
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
