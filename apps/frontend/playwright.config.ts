// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e/specs",
  // In CI, only run critical smoke tests (add-asset, portfolio basics)
  testMatch: process.env.CI 
    ? [
        '**/features/add-asset.spec.ts',
        '**/features/delete-asset.spec.ts',
        '**/features/portfolio-value.spec.ts',
        '**/flows/persist-portfolio.spec.ts',
      ]
    : "**/*.spec.ts", // Run all tests locally
  testIgnore: [],
  use: {
    baseURL: process.env.CI ? "http://127.0.0.1:4173" : "http://localhost:4200",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000, // 5 second timeout for actions
    navigationTimeout: 10000, // 10 second timeout for navigation
    trace: 'on-first-retry', // Capture trace on first retry
  },
  timeout: 30 * 1000, // 30 second timeout per test
  retries: process.env.CI ? 0 : 0, // No retries in CI to fail fast
  workers: process.env.CI ? 1 : undefined, // Single worker in CI
  fullyParallel: false, // Run tests serially
  webServer: process.env.CI ? {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    timeout: 90 * 1000, // wait up to 90s for server to start in CI (cold start can be slow)
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  } : {
    command: "npx nx serve frontend",
    url: "http://localhost:4200",
    timeout: 30 * 1000, // wait up to 30s for server to start
    reuseExistingServer: true,
  },
});
