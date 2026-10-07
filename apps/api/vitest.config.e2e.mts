import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // NestJS DI relies on decorator metadata, which esbuild does not emit —
  // SWC does. This is the standard NestJS + Vitest pairing.
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['test/global-setup.mts'],
    // First run may pull the postgres image; container boot is never instant.
    hookTimeout: 300_000,
    testTimeout: 60_000,
    // One ephemeral database per run: e2e files execute serially so concurrent
    // files can never observe each other's data mid-flight.
    fileParallelism: false,
  },
});
