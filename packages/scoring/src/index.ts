/**
 * packages/scoring — pure, dependency-free scoring logic (ADR-002, ADR-008).
 *
 * Stub for the walking skeleton: the real scoring spec (metrics, normalization,
 * stat aggregation) is the output of the Phase 0 spike and lands here with its
 * own ADR. Nothing in this package may import a framework, DB, or IO module.
 */

/**
 * Immutable tag identifying the scoring formula that produced a result (ADR-002,
 * ADR-007). Every Metric Row and Scan Result records the Formula Version that
 * produced it. Bumped only by a deliberate formula release.
 */
export const FORMULA_VERSION = 'v0-skeleton';

/**
 * Placeholder stat aggregation: the arithmetic mean of a stat's Metric values,
 * or 0 when a stat has no Metrics yet. Deterministic by construction — same
 * inputs plus same Formula Version always produce the same output (ADR-002).
 *
 * TODO(phase-0-spike): replace with the real normalization + aggregation spec.
 */
export function aggregateMetricValues(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}
