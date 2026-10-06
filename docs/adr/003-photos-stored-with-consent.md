# ADR-003: Photos stored with consent (supersedes initial "landmarks-only" stance)

**Status:** Accepted
**Date:** 2026-10-06

## Context

The initial plan was to store only landmark data and discard images, to minimize biometric-data liability. But async vote duels (ADR-001) require voters to actually *see* the opponents' faces. The alternatives — landmark-derived wireframe avatars (kills the product's emotional core) or ephemeral duel-scoped photos (makes photo retention a security-critical core feature) — were evaluated and rejected.

## Decision

Store user photos, under these conditions:

1. **Explicit, recorded consent** at Scan time before any photo is stored.
2. **Deletion rights:** a user can delete their photo and account at any time; deletion removes photos and derived data.
3. **Moderation applies to every photo** before it becomes visible in a Stat Card or Duel (ADR-009).
4. Biometric handling follows GDPR special-category rules: legal basis documented, data minimization for everything *around* the photo (we still keep raw landmark storage lean), and retention is deliberate, not accidental.

## Consequences

- The product carries real legal responsibility for image custody from day one — the consent flow, deletion pipeline, and moderation baseline (ADR-009) are launch blockers, not later features.
- Duel rendering is simple: voters see real photos.
- A future pivot back to landmarks-only (or ephemeral duel photos) remains possible because Metric Rows (ADR-006) keep all derived data independent of images.
