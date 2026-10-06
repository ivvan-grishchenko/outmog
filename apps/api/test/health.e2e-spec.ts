import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FORMULA_VERSION } from "@outmog/scoring";
import { HEALTH_PATH, type HealthResponse } from "@outmog/shared";

import { AppModule } from "../src/app.module";
import { configureApp } from "../src/bootstrap";

/**
 * Primary test seam (see BEN-64 "Testing Decisions"): real HTTP against a real
 * PostgreSQL. The database is an ephemeral container booted and migrated by
 * test/global-setup.mts before any test file runs.
 */
describe("GET /api/health", () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.listen(0);

    const address = (app.getHttpServer() as Server).address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await app?.close();
  });

  it("boots against the migrated database and reports ok with the scoring formula version", async () => {
    const response = await fetch(`${baseUrl}${HEALTH_PATH}`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as HealthResponse;
    expect(body).toEqual<HealthResponse>({
      status: "ok",
      db: "up",
      formulaVersion: FORMULA_VERSION,
    });
  });
});
