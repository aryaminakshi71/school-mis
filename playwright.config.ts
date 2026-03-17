import { defineConfig, devices } from "@playwright/test";

const playwrightPort = process.env.PLAYWRIGHT_PORT || "3005";
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${playwrightPort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `DB_URL="$(node scripts/setup-e2e-db.mjs --print-url)"; export E2E_TEST=1 SKIP_CLOUDFLARE=true SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0 PORT=${playwrightPort} DATABASE_URL="$DB_URL" SCHOOL_MIS_E2E_DATABASE_URL="$DB_URL"; node scripts/setup-e2e-db.mjs && cd apps/web && bun run dev`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
