# Wing's Buy n Sell — Rules Index

> `AGENTS.md` is always loaded. This file is a **lazy index** — `concern → playbook §`. Detail lives in `playbooks/`. Read only the § you need via `Read offset`.

| Concern                                         | Playbook                                   | Sections                                            |
| ----------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| Naming, imports, constants, logging, comments   | `playbooks/universal.md`                   | §Naming, §Functions, §Imports, §Constants, §Logging |
| Strict TypeScript, `no any`, Zod, unions        | `playbooks/universal.md`                   | §Strict Mode, §No any, §Type vs Interface, §Zod     |
| Folder placement, feature ownership             | `playbooks/universal.md`                   | §Folder Structure, §Cross-Feature Imports           |
| Error codes, AppError, `error.code` routing     | `playbooks/universal.md`                   | §Error Handling                                     |
| Testing (Vitest/RTL/Playwright)                 | `playbooks/universal.md`                   | §Testing                                            |
| Git branches, commits `type(scope):`, PR        | `playbooks/universal.md`                   | §Git Conventions                                    |
| Server vs Client, Services, Repositories        | `playbooks/stack/nextjs.md`                | §1-8, §14-24, §41-43                                |
| Data reading (Server Component vs API)          | `playbooks/stack/nextjs.md`                | §8-11                                               |
| TanStack Query / Server Actions / nuqs / t3-env | `playbooks/stack/nextjs.md`                | §73, §76-77, §75, §80                               |
| Forms (RHF + Zod) / Validation / AuthZ          | `playbooks/stack/nextjs.md`                | §74, §51-52, §50                                    |
| Supabase clients (browser/server/admin)         | `playbooks/database/supabase.md`           | §Client Setup, §Which Client to Use                 |
| RLS on every table, policies                    | `playbooks/database/supabase.md`           | §Row Level Security                                 |
| Auth (Supabase Auth) / Storage / Realtime       | `playbooks/database/supabase.md`           | §Supabase Auth, §Storage, §Realtime                 |
| Migrations, type gen                            | `playbooks/migration/supabase-cli.md`      | §Migration Commands, §Type Generation               |
| Tailwind `cn()`, shadcn/ui, tokens, responsive  | `playbooks/styling/tailwind-extensions.md` | §cn, §shadcn, §Color Rules, §Responsive             |
| CI (Next.js)                                    | `playbooks/devops/github-actions.md`       | §Next.js CI                                         |

**How to use:** Task touches Supabase RLS? → `Read playbooks/database/supabase.md` offset §RLS only. Never `Read` all playbooks eagerly.
