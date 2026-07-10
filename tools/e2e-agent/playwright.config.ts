import { defineConfig, devices } from "@playwright/test";

/**
 * E2E agent — public-surface journeys against the live site (default
 * digilist.no; override with E2E_BASE_URL). Headless, resilient (retries),
 * JSON report consumed by src/run.ts to file categorized Linear bugs.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: 2, // real-network resilience: a journey must fail twice to count
  reporter: [["json", { outputFile: "report.json" }], ["line"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "https://digilist.no",
    headless: true,
    ignoreHTTPSErrors: false,
    actionTimeout: 12_000,
    navigationTimeout: 25_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
