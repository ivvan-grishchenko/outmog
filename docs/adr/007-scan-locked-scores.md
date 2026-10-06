# ADR-007: Scan-locked scores with formula versioning

**Status:** Accepted
**Date:** 2026-10-06

## Context

The scoring formula will change over time (better metrics, better normalization). Options: global recompute of all users (fair meta, but users can watch their number drop overnight), version-per-season (ties scoring to a season cadence that doesn't exist in v1), or scan-locked scores.

## Decision

Scores are **scan-locked**: a Scan Result persists unchanged — including the formula version that produced it — until the user performs a new Scan.

- Every Metric Row and Stat Card render is tagged with its `formulaVersion`.
- When a new Formula Version ships, existing users are unaffected until they choose to rescan.
- Rescans are user-initiated (rate-limited) — not forced by releases.

## Consequences

- No surprise score drops; users control when their number changes. This fits the Encouraging Tone (ADR-010).
- The user base can temporarily run on mixed formula versions — leaderboards must tolerate (and can display) this; the Arbiter and matchmaking treat scores formula-agnostically.
- If a formula version is later found to be broken or abusive, a targeted recompute of affected scans is possible because inputs (landmarks) and formula versions are both retained.
