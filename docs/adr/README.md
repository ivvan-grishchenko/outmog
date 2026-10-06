# Architecture Decision Records

Decisions made during the initial grilling/design session (2026-10-06).

| # | Decision | Status |
|---|----------|--------|
| [001](001-hybrid-battle-format.md) | Hybrid battle format — async vote duels first, stat-based combat later | Accepted |
| [002](002-server-side-deterministic-scoring.md) | Server-side deterministic face scoring | Accepted |
| [003](003-photos-stored-with-consent.md) | Photos stored with consent (supersedes landmarks-only) | Accepted |
| [004](004-liveness-challenge-and-telemetry.md) | Liveness via client challenge + telemetry, server-verified | Accepted |
| [005](005-vote-integrity.md) | Vote integrity — blind voting, rank-weighted votes, Arbiter Veto | Accepted |
| [006](006-metric-rows.md) | Facial stats stored as key-value metric rows | Accepted |
| [007](007-scan-locked-scores.md) | Scan-locked scores with formula versioning | Accepted |
| [008](008-monorepo-layout.md) | Monorepo — turbo + pnpm, shared contracts, pure scoring package | Accepted |
| [009](009-moderation-baseline.md) | Launch moderation baseline — the "Baseline Trio" | Accepted |
| [010](010-age-gate-and-tone.md) | 18+ gate and encouraging tone | Accepted |

## Open sub-decisions (not yet ADRs)

- **Scoring spec** — which 5–8 metrics, normalization, stat mapping (output of the Phase 0 spike; will become an ADR).
- **ML runtime** — tfjs-node in NestJS vs Python MediaPipe sidecar vs client-scan + server-re-verify (blocked on spike).
- **NSFW screening provider** — interface must be a thin adapter (ADR-009).
- **Deployment target** — undecided; everything stays containerized and portable.
- **Object storage** for photos (S3-compatible recommended for portability).
