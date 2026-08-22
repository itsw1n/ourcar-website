# Wing's Buy n Sell — Context

- **Project:** Wing's Buy n Sell — Davao City Japanese surplus mini van showroom
- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + Supabase (PostgreSQL/Auth/Storage) + @supabase/ssr
- **Frontend:** TanStack Query + React Aria + React Hook Form + Zod + nuqs + next-safe-action + Lucide + GSAP/ScrollTrigger + Lenis + cn()
- **Architecture:** Medium default (`Action → Service → Database`, escalate to `Repository` only when DB access complex/shared)
- **Database:** Supabase — tables: profiles, categories, vehicles, vehicle_images, testimonials — `supabase/migrations/`
- **Styling:** White-first editorial, red accent, semantic tokens `hsl(var(--*))`, `data-ui` + `cn()` required
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_MESSENGER_URL`
- **Playbooks:** `playbooks/` holds selected canonical rules (never duplicate in `docs/` or `AGENTS.md`)
