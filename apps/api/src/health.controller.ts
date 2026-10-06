import { Controller, Get } from "@nestjs/common";
import { FORMULA_VERSION } from "@outmog/scoring";
import type { HealthResponse } from "@outmog/shared";

import { PrismaService } from "./prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth(): Promise<HealthResponse> {
    let db: HealthResponse["db"] = "up";
    try {
      // Probes the migrated schema (not just SELECT 1), so db:"up" proves the
      // boot → migrate legs of the e2e seam. HTTP stays 200 even when db is
      // down: status:"ok" is liveness, db carries readiness — the e2e test
      // asserts db:"up" explicitly.
      await this.prisma.appMeta.count();
    } catch {
      db = "down";
    }

    return { status: "ok", db, formulaVersion: FORMULA_VERSION };
  }
}
