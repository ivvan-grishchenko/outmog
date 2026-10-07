# Outmog

Monorepo for **Arena** (working title) — see `GLOSSARY.md` for domain vocabulary and
`docs/adr/` for architecture decisions (ADR-008 covers this layout).

## Layout (ADR-008)

```
apps/
  api/              # @outmog/api    — NestJS backend (PostgreSQL + Prisma 7)
  web/              # @outmog/web    — Angular frontend
packages/
  shared/           # @outmog/shared — DTOs and contracts for the client/server boundary
  scoring/          # @outmog/scoring — pure, dependency-free scoring logic
```

## Prerequisites

- **Node.js ≥ 24.15** and **pnpm ≥ 11** (`corepack enable` or `npm i -g pnpm`)
- **Docker Desktop running** — required by the API e2e harness (spins up an
  ephemeral PostgreSQL per run) and for the local dev database

## Quickstart

```sh
pnpm install
pnpm verify     # lint + format + typecheck + build + unit + API e2e (green)
pnpm dev        # API on http://localhost:3000, web on http://localhost:4200
```

Open http://localhost:4200 — the page shows the API health (served from
`GET /api/health`), proving the whole skeleton is alive.

### Local development database

`apps/api` needs a PostgreSQL to run outside of tests:

```sh
pnpm db:up                              # starts/creates the outmog-pg container
copy apps\api\.env.example apps\api\.env   # Windows
cp apps/api/.env.example apps/api/.env     # POSIX
```

(The e2e tests do **not** use this database — they boot their own throwaway
container per run and migrate it from scratch. `pnpm verify` therefore works
before you ever create `.env`.)

## Testing

Two seams, per the MVP spec (BEN-64):

| Seam | Where | Command |
| ---- | ----- | ------- |
| HTTP API e2e — real endpoints, real ephemeral PostgreSQL | `apps/api/test/**/*.e2e-spec.ts` | `pnpm test:e2e` |
| Pure scoring functions | `packages/scoring/src/**/*.test.ts` | `pnpm test` |

The first e2e run pulls the `postgres:17-alpine` image (~90 MB); later runs only
pay for container boot + migrations (a few seconds). E2E files run serially
(`fileParallelism: false`) because they share one ephemeral database per run.

## Useful scripts

| Command | What it does |
| ------- | ------------ |
| `pnpm dev` | Runs API (watch) + web dev server via turbo |
| `pnpm db:up` | Start (or create) the local dev PostgreSQL container |
| `pnpm build` | Builds all packages and apps |
| `pnpm lint` / `pnpm lint:fix` | Oxlint across the repo / with autofixes |
| `pnpm format` / `pnpm format:check` | Oxfmt write / check |
| `pnpm test` / `pnpm test:e2e` | Unit tests / API e2e tests |
| `pnpm typecheck` | Type-checks every workspace |
| `pnpm verify` | All of the above, in order — the full CI check |

## Git hooks & CI

- **`pre-commit`** — husky + lint-staged lint and format just the staged files.
- **`commit-msg`** — husky + commitlint enforce
  [Conventional Commits](https://www.conventionalcommits.org/) (config in
  `commitlint.config.mjs`).
- **GitHub Actions** (`.github/workflows/ci.yml`) runs on every pull request:
  a `commitlint` job that validates each commit in the PR, and a `verify` job
  that runs `pnpm verify` (including the Docker-backed API e2e seam).

`husky` is installed by the root `prepare` script on `pnpm install`.

## Tooling

- **Lint:** `oxlint` (`.oxlintrc.json`). Categories `correctness` (error),
  `suspicious` and `perf` (warn); `typescript`, `unicorn`, `oxc`, `import`,
  `vitest` and `node` plugins.
- **Format:** `oxfmt` (`.oxfmtrc.json`, migrated from the Angular scaffold's
  Prettier settings). It deliberately skips Markdown/`docs/` (hand-authored
  prose) and `**/*.html` — oxfmt's plain-HTML parser is not Angular-template
  aware and mangles control-flow blocks.
- **Builds:** `apps/api` uses Nest's SWC builder (`apps/api/nest-cli.json`) —
  fast transpile, with decorator metadata preserved for Nest DI; type checking
  stays a separate `tsc --noEmit` task.
- **TypeScript:** root, `packages/shared`, `packages/scoring` are on TS 7.
  `apps/api` stays on TS 6.0.x — `@nestjs/cli` reads the tsconfig through the
  TypeScript programmatic API on every `nest build`/`nest start`, and TS 7.0
  ships only the `tsc` executable (the API returns in 7.1, per Nest's own error
  message), so no builder choice avoids it. `apps/web` stays on TS 6.0.x
  because Angular 22's `compiler-cli` peer range is `>=6.0 <6.1`.

## Working agreements

- `packages/scoring` stays pure: no framework, DB, or IO imports — ever (ADR-002).
- Cross-boundary types live in `packages/shared`, not in either app.
- Backend behavior is tested at the HTTP API seam only — no module-level or
  repository-level mocking. The frontend has no automated test seam for now.
- Prisma migrations are committed (`apps/api/prisma/migrations`); the generated
  client (`apps/api/src/generated`) is not — `pnpm install` regenerates it.
