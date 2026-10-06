/**
 * DTOs and type contracts shared across the client/server boundary (ADR-008).
 * This package is the single source of truth for what crosses the wire.
 */

/** Path of the API health endpoint (the API mounts everything under a global prefix). */
export const HEALTH_PATH = "/api/health";

/** Response contract of `GET /api/health`. */
export interface HealthResponse {
  /** Liveness of the API process itself. */
  status: "ok";
  /** Result of a real `SELECT 1` round-trip against PostgreSQL. */
  db: "up" | "down";
  /** Formula Version of the scoring package built into this API (ADR-002, ADR-007). */
  formulaVersion: string;
}
