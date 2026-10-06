# ADR-006: Facial stats stored as key-value metric rows

**Status:** Accepted
**Date:** 2026-10-06

## Context

Facial Stats evolve: new measurements will be added as the scoring spec matures (Phase 0 spike, ADR-002), and the future stat-based combat layer (ADR-001) will consume them. Fixed columns per stat would make every new metric a schema migration.

## Decision

Store derived facial measurements as **Metric Rows**:

```
MetricRow(userId, metricKey, value, formulaVersion, scannedAt)
```

- `metricKey` — e.g. `symmetry_deviation`, `canthal_tilt`, `gonial_angle`.
- `formulaVersion` — which Formula Version produced the value (ADR-002, ADR-007).
- The current Stat Card reads the latest row per `metricKey` for the user's active Scan.

Named user-facing Stats (Jawline, Symmetry, Eyes, ...) are an aggregation layer over metric rows, defined per Formula Version — not columns.

## Consequences

- New metrics ship as data, not schema changes.
- Historical scores remain interpretable because every value carries its formula version.
- Queries for "a user's full stat set" are slightly less trivial than a wide row — acceptable; an index on `(userId, metricKey, scannedAt)` covers the hot path.
- Stat-based combat (v2+) can consume metrics generically without schema surgery.
