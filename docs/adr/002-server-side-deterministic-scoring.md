# ADR-002: Server-side deterministic face scoring

**Status:** Accepted
**Date:** 2026-10-06

## Context

Face scoring could run client-side (TensorFlow.js in Angular) or server-side. Client-side is cheap but trivially cheatable (crafted landmark payloads) and scores drift between client versions. The scoring formula is the product's core IP.

## Decision

All scoring runs server-side in `apps/api`, using the pure logic in `packages/scoring` (ADR-008):

- The client sends a captured frame + Liveness Telemetry; the server detects landmarks, computes Metrics, normalizes them, and aggregates them into Facial Stats.
- Scoring is **deterministic**: same landmarks + same Formula Version ⇒ same result. No learned/black-box model in v1 (ADR for the scoring spec will follow from the Phase 0 spike).
- Every result records its **Formula Version** (ADR-007).

## Consequences

- Scores are auditable, testable, and identical for every user regardless of client version.
- Server-side landmark detection in Node.js has a known technical risk (tfjs-node runtime); a Phase 0 spike must validate it. Fallback options: a small Python MediaPipe sidecar, or client-scan + server-re-verify.
- `packages/scoring` stays dependency-free and pure so it is unit-testable and reusable by future clients (e.g. stat-based combat engine).
- The client never submits scores or landmarks as authoritative input — only raw capture artifacts.
