# Glossary

Canonical domain vocabulary for the Arena project (working title). Use these terms consistently in code, tickets, docs, and UI copy. If a term here is wrong or missing, this file is the place to fix it first.

## Core concepts

**Arena**
The product as a whole: a phone-first web application where users scan their face, receive facial stats, and compete in duels.

**Scan**
The act of capturing a user's face via camera with a Liveness Challenge, producing a photo (with consent), landmark data, and derived Facial Stats. A Scan is the source of truth for a user's stats until superseded by a new Scan.

**Scan Result**
The persisted output of a Scan: the photo (consented), raw landmark data, and the set of Metric Rows computed by a specific Formula Version.

**Stat Card**
The user-facing profile view showing a user's photo, named Facial Stats (Jawline, Symmetry, Eyes, ...), overall score, league, and rank. The product's primary profile artifact.

**Facial Stats**
Named, user-facing attributes derived from geometric measurements of a Scan (e.g. Jawline, Symmetry, Eyes, Structure). Each stat is backed by one or more Metrics.

**Metric**
A single deterministic geometric measurement computed from landmarks (e.g. symmetry deviation, canthal tilt, gonial angle, facial thirds ratio). Metrics are internal; Stats are the user-facing aggregation of Metrics.

**Metric Row**
The storage unit for stats: a row of `(userId, metricKey, value, formulaVersion)`. See ADR-006.

**Formula Version**
An immutable, tagged version of the scoring formula (metric definitions, normalization, stat aggregation). Every Metric Row and Scan Result records which Formula Version produced it. See ADR-002, ADR-007.

**Scan-Locked Score**
The rule that a user's score persists unchanged until they perform a new Scan, regardless of Formula Version releases. See ADR-007.

## Battles

**Duel**
A head-to-head asynchronous battle between two users' Scans. Lifecycle: `open → voting window → closed → (Arbiter Veto applied) → resolved (ELO updated)`.

**Vote Feed**
The home screen of the application: a randomized stream of open Duels that any signed-in user can vote on. Voting is the default activity; battling is opt-in.

**Vote**
A signed-in user's preference between the two sides of a Duel. Votes are blind (hidden until the Duel closes) and Rank-Weighted.

**Blind Voting**
Votes are not visible to anyone (including voters) until the Duel closes. See ADR-005.

**Rank-Weighted Vote**
A Vote whose weight scales with the voter's own league rank, so higher-ranked users' votes count more. See ADR-005.

**Arbiter**
The AI/algorithmic judge that reviews Duel outcomes and can veto outlier results (e.g. suspected brigading). See ADR-005.

**Arbiter Veto**
The Arbiter's override of a community-vote outcome. An applied Veto annuls the community result and resolves the Duel by the Arbiter's judgment (or voids it entirely).

**Matchmaking Queue**
The opt-in queue a user joins to be paired into a Duel. Pairing is ELO-banded. Users can never be dragged into a Duel without opting in.

**Placement Matches**
The first 5 Duels a user fights, which set their initial ELO before league placement.

**ELO**
The rating number updated after each resolved Duel. Internal; users see their League and position within it.

## Leagues

**League**
A tier of rank. Names, ascending: **Bronze → Silver → Gold → Platinum → Diamond → Chiseled**.

**Chiseled**
The top league — the aspiration of the ladder. On-theme, deliberately non-toxic naming.

## Anti-fraud & moderation

**Liveness Challenge**
The camera flow during a Scan: the browser prompts the user to blink, turn their head, etc., and captures the frame plus frame-by-frame landmark telemetry. Exists to block photo-of-a-photo and static image uploads. See ADR-004.

**Liveness Telemetry**
The client-captured sequence of landmark deltas recorded during the Liveness Challenge, sent with the frame so the server can sanity-check plausibility before scoring.

**Baseline Trio**
The non-negotiable launch moderation set (ADR-009):
1. **One-face validation** — server rejects uploads with zero or multiple detectable faces.
2. **NSFW check** — automated explicit-content screening before a photo is accepted.
3. **Report flow** — in-app reporting of users/photos; a upheld report annuls affected Duel results and can remove the Stat Card.

**Duel Annulment**
Removing a Duel's rating effects (ELO reverted) due to an upheld report or Arbiter Veto.

**Consent**
The explicit, recorded user permission required before a Scan photo is stored. Includes the right to delete the photo (and account) at any time. See ADR-003.

## Users & accounts

**18+ Gate**
The hard age requirement at signup, enforced before any Scan or upload. See ADR-010.

**Encouraging Tone**
The product's copy stance: scores and feedback are framed as improvable stats ("growth areas"), never as fixed flaws or looksmaxxing-culture derogatory vocabulary. See ADR-010.

## Tech (names used in code and docs)

**Monorepo Layout** — turbo + pnpm workspace (ADR-008):
- `apps/api` — NestJS backend
- `apps/web` — Angular frontend
- `packages/shared` — DTOs and types shared across the boundary
- `packages/scoring` — pure, dependency-free scoring logic (metrics, normalization, aggregation)

**Scored Server-Side** — all scoring runs in `apps/api` (via `packages/scoring`); the client never computes or submits scores. See ADR-002.

## Deferred (v2+) vocabulary — do not build yet, but names are reserved

**Stat-Based Combat** — the future game layer where Facial Stats become combat attributes (e.g. Jawline = Attack, Symmetry = Defense) in actual game matches, replacing/augmenting vote-based resolution.

**Season** — a ranked period (league resets, optional rescan under a new Formula Version).
