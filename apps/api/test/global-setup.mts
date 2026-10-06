import { execa } from "execa";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

/**
 * Vitest global setup for the API e2e seam: boots a real, ephemeral PostgreSQL
 * container per run, migrates it with the committed Prisma migrations, and
 * exposes DATABASE_URL to the test workers. Teardown destroys the container —
 * nothing persists between runs.
 */

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let container: StartedPostgreSqlContainer;

export async function setup(): Promise<void> {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();

  const databaseUrl = container.getConnectionUri();
  process.env.DATABASE_URL = databaseUrl;

  // Resolve the Prisma CLI entry point without relying on shell-specific bin
  // shims (Windows). Runs `prisma migrate deploy` with the ephemeral URL.
  const require = createRequire(import.meta.url);
  const prismaPackageJson = require.resolve("prisma/package.json");
  const prismaCli = path.join(path.dirname(prismaPackageJson), "build", "index.js");

  await execa(process.execPath, [prismaCli, "migrate", "deploy"], {
    cwd: apiRoot,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });
}

export async function teardown(): Promise<void> {
  await container?.stop();
}
