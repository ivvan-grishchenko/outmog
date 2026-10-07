import { describe, expect, it } from 'vitest';

import { aggregateMetricValues, FORMULA_VERSION } from './index';

describe('FORMULA_VERSION', () => {
  it('is a non-empty immutable tag', () => {
    expect(FORMULA_VERSION).toBe('v0-skeleton');
  });
});

describe('aggregateMetricValues (stub)', () => {
  it('returns 0 for a stat with no metrics', () => {
    expect(aggregateMetricValues([])).toBe(0);
  });

  it('returns the arithmetic mean of the metric values', () => {
    expect(aggregateMetricValues([2, 4, 6])).toBe(4);
  });

  it('is deterministic — same inputs, same output', () => {
    const values = [0.1, 0.7, 0.42, 0.99];
    expect(aggregateMetricValues(values)).toBe(aggregateMetricValues(values));
  });
});
