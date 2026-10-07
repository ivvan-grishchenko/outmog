/**
 * DTOs and type contracts shared across the client/server boundary (ADR-008).
 * This package is the single source of truth for what crosses the wire.
 */

/** Everything in apps/api is served under this global prefix (Nest format, no leading slash). */
export const API_PREFIX = 'api';

/** Path of the API health endpoint (the API mounts everything under a global prefix). */
export const HEALTH_PATH = `/${API_PREFIX}/health`;

/** Response contract of `GET /api/health`. */
export interface HealthResponse {
  /** Liveness of the API process itself. */
  status: 'ok';
  /**
   * Result of a real probe against PostgreSQL that reads a table only the
   * committed migrations create — so `up` proves both connectivity and that
   * the schema is migrated.
   */
  db: 'up' | 'down';
  /** Formula Version of the scoring package built into this API (ADR-002, ADR-007). */
  formulaVersion: string;
}
