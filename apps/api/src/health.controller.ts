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
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = "down";
    }

    return { status: "ok", db, formulaVersion: FORMULA_VERSION };
  }
}
