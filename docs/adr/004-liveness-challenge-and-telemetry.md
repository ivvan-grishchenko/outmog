# ADR-004: Liveness via client challenge + telemetry, server-verified

**Status:** Accepted
**Date:** 2026-10-06

## Context

Users could submit photos of other people, celebrities, or static images. Cryptographically secure liveness detection is out of scope for v1, but some anti-fake measure must exist at scan time (chosen over "trust + review flags" and duplicate-face detection).

## Decision

The Scan flow uses a **Liveness Challenge**:

1. The Angular app (MediaPipe FaceLandmarker in-browser) runs a randomized challenge sequence — blink, turn head, smile — during camera capture.
2. The client records **Liveness Telemetry**: frame-by-frame landmark deltas showing the challenges were performed.
3. The client submits the captured frame **plus** telemetry.
4. The server sanity-checks the telemetry for plausibility (and re-detects landmarks on the frame as part of scoring, ADR-002) before accepting the Scan.

This is a *client-trust-with-verification* model, not cryptographic liveness. It raises the bar enough for v1 and blocks naive static-image uploads.

## Consequences

- The scan UX must be built around an interactive challenge sequence, not a single selfie tap — this is the most complex frontend flow in Phase 1.
- A determined attacker with a custom client can still fake telemetry. Acceptable for v1; server-side re-verification depth can increase later without changing the contract.
- The capture contract (frame + telemetry) must be defined in `packages/shared` early, since both apps depend on it.
