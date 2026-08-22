# Universal Playbook (consolidated)

> Authority for all projects. Detail lives here; `AGENTS.md` only summarizes + points.
> Read only the section you need via `Read` with `offset`.

---

## Naming
- Files: React components `PascalCase` (`UserCard.tsx`), hooks `camelCase` (`useUser.ts`), utils `camelCase`, types `camelCase`, CSS Modules `PascalCase`, SQL migrations `snake_case` (`V1__create_users_table.sql`).
- Variables/functions: `camelCase`. Constants: `SCREAMING_SNAKE`. React components/types/interfaces/enums: `PascalCase`.
- Name for WHAT it does (`getUserById`, `handleLoginSubmit`), not generic (`getData`, `doStuff`).
- Booleans start with `is/has/can` (`isLoading`, `canEdit`).
- One responsibility per function; max 3 params (else options object); return early to avoid nesting.

## Imports
- Always `@/` absolute imports; never `../../`. Barrel `index.ts` only for a feature's public API.
- Order (ESLint-enforced): external libs → internal `@/` → types → styles.

## Constants
- No magic numbers/strings in logic. Put constants in `src/constants/index.ts` or feature-level file. Use `ROLES.ADMIN`, not `'ADMIN'`.

## TypeScript (see also nextjs.md §73-77)
- `strict: true` always — never disable, no `ts-ignore` without `// reason:`.
- No `any` — use `unknown`, `Record<string, unknown>`, unions. Justified `any` needs `// reason:` comment.
- Objects → `interface`; unions/intersections/primitives → `type`. No `I` prefix.
- Prefer union types over enums (`const X = { A:'A' } as const` + `type T = typeof X[keyof]`).
- Zod at runtime boundaries (forms, API, env). Infer types: `type T = z.infer<typeof Schema>`.
- Catch `unknown`; route on `error.code` not message. Avoid `as` without reason comment.

## Folder Structure (Next.js)
```
src/
├── app/                 # routing, pages, layouts, route.ts, loading/error/not-found
├── features/[name]/     # components, hooks, queries, actions, services, schemas, types
├── components/ui/       # generic primitives (no feature logic)
├── components/shared/   # cross-feature UI (Header, EmptyState)
├── lib/                 # shared infra (supabase, logger, errors, safe-action, env)
├── stores/              # Zustand (UI state only)
├── types/               # global + db types
└── schemas/             # shared Zod schemas
```
- Feature owns its code; shared code → `components/shared/` or `lib/`, not copied across features.
- Never: feature A importing feature B's internals. Cross-feature need → lift to shared.

## Error Handling
- Frontend: `lib/errors.ts` `AppError(code, message, status)`; `isAppError()`. Route on `error.code`, never `error.message`. Never show raw errors.
- Server Action: wrap try/catch, return `{ success, data }` or `{ success:false, code, message }`.
- Never expose stack traces, SQL, paths, or table names in responses.
- Unknown/unexpected → `INTERNAL_ERROR` with user-safe message.

## Testing (see nextjs.md §73 for TanStack/nuqs specifics)
- Layers: Unit (Vitest, fast) → Component (RTL) → E2E (Playwright, critical flows only).
- Test behavior not implementation. Colocate `*.test.ts(x)` with source.
- Always: hooks, utils, Zod schemas. When complex: conditional render, interactions, loading/error states. Skip: simple presentational, page composers.
- Hook test: mock at API layer (`vi.mock('../api')`), wrap in `QueryClientProvider`.
- Form test: validation errors + successful submit via `userEvent`.
- Zod test: valid passes; each invalid field fails.
- E2E: only auth/checkout/core flows; use `getByRole`/`getByLabel`, not CSS selectors.

## Git Conventions
- Branches: `main` (prod, protected), `dev` (integration). Feature branches: `feature/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`.
- NEVER commit/push to `main` or `dev` directly; branch off `dev`. NEVER push/PR unless explicitly asked.
- Commits: `type(scope): description` — lowercase, no period, present tense, <72 chars.
  - Types: `feat` `fix` `refactor` `chore` `docs` `test` `ci` `style`.
  - Scopes (Next.js): `app` `api` `db` `auth` `ci` `docs` `deps`.
  - One logical change per commit.
- Workflow: branch off `dev` → small commits → push branch → PR to `dev` only when asked.

## Agent Rules (pre-write checklist)
1. Check if functionality already exists; reuse before create.
2. Confirm which layer/folder owns the responsibility.
3. Choose simplest correct design; don't add layers for ceremony.
4. Follow existing patterns; don't introduce new ones.
5. Before new dependency: prefer what the stack already provides.
6. No `console.log`/`debugger`/TODO/hardcoded secrets in commits.
