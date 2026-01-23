// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e/specs",
  testMatch: "**/*.spec.ts", // Match only .spec.ts files
  // In CI, only run critical smoke tests
  testIgnore: process.env.CI ? [
    '**/a11y-mobile-smoke.spec.ts',
    '**/a11y/**',
    '**/features/category-exploration.spec.ts',
    '**/features/coin-comparison.spec.ts',
    '**/features/daily-summary.spec.ts',
    '**/features/educational-tooltips.spec.ts',
    '**/features/expansion-state-preservation.spec.ts',
    '**/features/market-overview.spec.ts',
    '**/features/notifications.spec.ts',
    '**/features/price-alerts.spec.ts',
    '**/features/view-asset-chart.spec.ts',
    '**/features/view-asset-metrics.spec.ts',
    '**/flows/refreshing-disabled-controls.spec.ts',
    '**/flows/retry-reenable-controls.spec.ts',
    '**/portfolio-composition-viz.spec.ts',
    '**/portfolio-performance.spec.ts',
    '**/trending-discovery.spec.ts',
  ] : [],
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
    timeout: 60 * 1000, // wait up to 60s for server to start in CI (cold start can be slow)
    reuseExistingServer: false,
  } : {
    command: "npx nx serve frontend",
    url: "http://localhost:4200",
    timeout: 30 * 1000, // wait up to 30s for server to start
    reuseExistingServer: true,
  },
});
