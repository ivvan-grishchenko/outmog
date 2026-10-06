import type { INestApplication } from "@nestjs/common";

/**
 * Cross-cutting HTTP configuration shared by the real bootstrap (src/main.ts)
 * and the e2e seam (test/health.e2e-spec.ts) so both serve identical routes.
 */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix("api");
}
