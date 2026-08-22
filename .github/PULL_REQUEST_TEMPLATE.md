## What does this PR do?

<!-- Describe the change clearly. What problem does it solve? -->

---

## Type of change

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `refactor` — restructure without behavior change
- [ ] `chore` — deps, config, tooling
- [ ] `docs` — documentation only
- [ ] `test` — adding or updating tests

---

## Scope

- [ ] `app` `api` `db` `auth` `ci` `docs` `deps` (Next.js scopes)

---

## How to test this?

1.
2.
3.

---

## Checklist

### General

- [ ] Branched off `dev`, not `main`
- [ ] Branch name follows convention (`feat/`, `fix/`, `refactor/`, `chore/`)
- [ ] Commits follow `type(scope): description` convention
- [ ] No `console.log` or debug code
- [ ] No hardcoded secrets or credentials

### Quality

- [ ] `make lint` passes
- [ ] `make build` passes

### Frontend (if applicable)

- [ ] New code lives under `src/features/<name>/` or `src/components/`
- [ ] No business logic in page/layout files
- [ ] `cn()` used for conditional classes; `data-ui` on reusable UI
- [ ] Supabase calls use the correct client (`client/server/admin`)

### Docs

- [ ] `AGENTS.md` / `docs/` / `playbooks/` updated if rules changed

---

Closes #
