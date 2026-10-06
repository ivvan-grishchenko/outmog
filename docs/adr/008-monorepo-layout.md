# ADR-008: Monorepo layout — turbo + pnpm, shared contracts, pure scoring package

**Status:** Accepted
**Date:** 2026-10-06

## Context

The stack is Node.js + NestJS (API) and Angular (web). Without a shared contracts package, types drift across the client/server boundary. Scoring and battle math benefit from being isolated from framework code.

## Decision

Use a pnpm + turbo monorepo:

```
apps/
  api/              # NestJS backend
  web/              # Angular frontend
packages/
  shared/           # DTOs, types, and contracts used by both apps
                    # (capture payload incl. Liveness Telemetry, duel, vote, leaderboard)
  scoring/          # pure, dependency-free scoring logic:
                    # metric definitions, normalization, stat aggregation
```

- `packages/shared` is the single source of truth for the client/server boundary.
- `packages/scoring` has **no framework or DB dependencies** — pure functions in, pure results out — so it is unit-testable and reusable by future clients (stat-based combat engine, native apps).
- Turbo handles build orchestration and caching; pnpm handles workspaces.

## Consequences

- Type-safe across the boundary by construction.
- The scoring spec (Phase 0 spike output) lives in `packages/scoring` and is reviewed/tested in isolation — the product's core IP has a deliberate home.
- Slightly more upfront scaffolding than two bare apps; paid back immediately by contract stability.
