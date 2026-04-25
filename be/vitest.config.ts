import { defineConfig } from "vitest/config";
import { config } from "dotenv";

/* Load .env.test before any module is evaluated so drizzle.ts picks up the test DATABASE_URL */
config({ path: ".env.test", override: true });

export default defineConfig({
  test: {
    /* expose describe/it/expect etc. globally without imports in every test file */
    globals: true,
    /* run in Node.js (not jsdom) — required for Express/Postgres */
    environment: "node",
    /* spawn a child process instead of worker threads — process.env changes are reliable */
    pool: "forks",
    /* allow up to 15s per test — DB operations need headroom */
    testTimeout: 15000,
    /* run test files sequentially — all files share the same DB */
    fileParallelism: false,
  },
});
