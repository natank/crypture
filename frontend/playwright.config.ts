// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e/specs",
  testMatch: "**/*.spec.ts", // Match only .spec.ts files
  use: {
    baseURL: process.env.CI ? "http://localhost:4173" : "http://localhost:5173",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000, // 5 second timeout for actions
    trace: 'on-first-retry', // Capture trace on first retry
  },
  timeout: 30 * 1000, // 30 second timeout per test
  retries: process.env.CI ? 0 : 0, // No retries in CI to fail fast
  webServer: process.env.CI ? {
    command: "npm run preview",
    url: "http://localhost:4173",
    timeout: 15 * 1000, // wait up to 15s for server to start
    reuseExistingServer: false,
  } : {
    command: "npm run dev",
    url: "http://localhost:5173",
    timeout: 30 * 1000, // wait up to 30s for server to start
    reuseExistingServer: true,
  },
});
