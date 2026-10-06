# ADR-010: 18+ gate and encouraging tone

**Status:** Accepted
**Date:** 2026-10-06

## Context

Looksmaxxing culture has documented harms, particularly with minors (body-image damage, "blackpill" communities, derogatory self-labeling). A product that scores faces and ranks users needs an explicit stance on audience and tone before launch — not after the first incident.

## Decision

1. **Hard 18+ gate** at signup, enforced before any Scan, upload, or duel participation. Age is attested at account creation (OAuth identity) and re-attested in the consent flow.
2. **Encouraging tone** in all copy and score presentation:
   - Feedback is framed as improvable stats ("growth areas"), never fixed flaws.
   - No looksmaxxing-culture derogatory vocabulary ("subhuman", "failo", etc.) anywhere in product copy, tier names, or generated feedback.
   - League names (Bronze → Chiseled) are aspirational, not derogatory.
3. Score displays emphasize trajectory and league progression over absolute numbers where possible.

## Consequences

- Legal exposure for biometric + body-image content is minimized to adults.
- Copy guidelines belong in the design system (Google Stitch → Angular component translation should encode this tone in reusable components).
- The Arbiter's feedback and any generated stat commentary must be generated from approved copy templates — never free-form LLM text about a user's face in v1.
- Moderation (ADR-009) extends to user-generated text: profile names/handles go through basic profility/slur screening using the same report flow.
