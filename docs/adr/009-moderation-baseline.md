# ADR-009: Launch moderation baseline — the "Baseline Trio"

**Status:** Accepted
**Date:** 2026-10-06

## Context

The product stores user photos (ADR-003). Users can upload photos of other people without consent, celebrity faces, or NSFW content. For a photo-centric, 18+ product, moderation is a launch blocker, not a later feature.

## Decision

Three non-negotiable checks at launch, applied before any photo becomes visible:

1. **One-face validation** — the server rejects uploads where zero or multiple faces are detected (server-side detection already exists for scoring, ADR-002).
2. **NSFW check** — automated explicit-content screening of every upload (provider chosen in Phase 1; must be containerization-friendly per the portability stance).
3. **Report flow** — in-app reporting of users/photos. An upheld report annuls affected Duel results (Duel Annulment: ELO reverted) and can remove the offending Stat Card.

## Consequences

- The upload pipeline is: consent → capture → liveness (ADR-004) → one-face check → NSFW check → store → moderate-visible. Each stage must be able to reject and report a reason.
- Duel Annulment must be built into the duel/rating model from the start of Phase 2, not bolted on.
- Manual review tooling can be minimal in v1 (a report queue is enough), but the report → annul → remove path must actually work on day one.
- Provider choice for NSFW screening is an open sub-decision for Phase 1; the interface around it should be a thin adapter so providers can be swapped.
