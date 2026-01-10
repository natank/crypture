// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e/specs",
  testMatch: "**/*.spec.ts", // Match only .spec.ts files
  use: {
    baseURL: "http://localhost:5173", // adjust to your dev server
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000, // 10 second timeout for actions
    trace: 'on-first-retry', // Capture trace on first retry
  },
  timeout: 60 * 1000, // 60 second timeout per test
  retries: process.env.CI ? 1 : 0, // Retry once in CI
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    timeout: 30 * 1000, // wait up to 30s for server to start
    reuseExistingServer: !process.env.CI,
  },
});
