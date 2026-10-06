# ADR-001: Hybrid battle format — async vote duels first, stat-based combat later

**Status:** Accepted
**Date:** 2026-10-06

## Context

The product's core loop is PvP between users' faces. "Battle" was undefined and could mean: community-voted duels, real-time live battles, or stat-driven game combat. The choice shapes the entire data model, infrastructure (WebSockets vs none), and how the product differs from a "hot-or-not clone".

## Decision

Adopt a hybrid, phased format:

1. **Phase 2 (v1 battles): asynchronous vote duels.** Two Scans go head-to-head; the community votes through the Vote Feed over a voting window; the result is rank-weighted, subject to Arbiter Veto, and updates ELO.
2. **Later (v2+): stat-based combat.** Facial Stats become combat attributes and battles become actual game matches. The metric storage model (ADR-006) is chosen so this can be added without re-engineering.

Real-time live battles are explicitly rejected for v1: they require WebSockets, presence, and live-photo anti-cheat infrastructure that the MVP does not need.

## Consequences

- The Phase 2 backend needs only a duel lifecycle state machine and voting endpoints — no real-time transport yet.
- The product stays distinct from a rating site because the roadmap ends at genuine game combat.
- ELO, leagues, and the duel lifecycle must be designed so a future combat resolver can reuse them (same rating pipeline, different result source).
