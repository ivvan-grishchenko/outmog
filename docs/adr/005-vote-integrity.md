# ADR-005: Duel vote integrity — blind voting, rank-weighted votes, Arbiter Veto

**Status:** Accepted
**Date:** 2026-10-06

## Context

Community voting is inherently gameable: users can brigade (coordinate votes via external channels), farm alt accounts, or bias results. Pure community voting was rejected as too exploitable; pure AI-decided outcomes were rejected as removing the social core. Rank-weighted voting was chosen as the primary mechanism.

## Decision

Duel outcomes combine three mechanisms:

1. **Rank-weighted votes** — a vote's weight scales with the voter's own league rank; higher-ranked users' votes count more.
2. **Blind voting** — votes are hidden from everyone (including voters) until the duel closes, and duels are shown to voters in randomized order, to limit coordination feedback loops.
3. **Arbiter Veto** — an AI/algorithmic judge reviews outcomes and vetoes outliers (statistically anomalous vote patterns), resolving the duel by its own judgment or voiding it.

## Consequences

- Weighting gives invested, established users more influence and makes cheap alt-account votes nearly weightless (new accounts are low-rank by construction).
- The Arbiter is a required Phase 2 component, not an optional extra; its decision rules must be logged so vetoed duels are auditable.
- ELO must handle vetoed/voided duels as a distinct resolution type (no rating change, or Arbiter-decided change) — the duel lifecycle in the data model needs this state from the start.
- Voting UX copy must not reveal weights or the Arbiter's mechanics in detail, to avoid gaming the meta.
