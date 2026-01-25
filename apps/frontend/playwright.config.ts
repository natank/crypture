// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/e2e/specs',
  // In CI, run critical smoke tests covering core functionality
  testMatch: process.env.CI
    ? [
        // Core portfolio operations
        '**/features/add-asset.spec.ts',
        '**/features/delete-asset.spec.ts',
        '**/features/edit-asset-quantity.spec.ts',
        '**/features/portfolio-value.spec.ts',
        '**/features/value-calculation.spec.ts',
        // Data persistence & import/export
        '**/flows/persist-portfolio.spec.ts',
        '**/flows/export-portfolio.spec.ts',
        '**/flows/import-portfolio.spec.ts',
        // UI/UX critical paths
        '**/features/asset-sorting-filtering.spec.ts',
        '**/features/portfolio-layout.spec.ts',
        '**/features/navigation-state-preservation.spec.ts',
      ]
    : '**/*.spec.ts', // Run all tests locally
  testIgnore: [],
  use: {
    baseURL: process.env.CI ? 'http://127.0.0.1:4173' : 'http://localhost:5173',
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
  webServer: process.env.CI
    ? {
        command:
          'npx vite preview --outDir ../../dist/apps/frontend --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        timeout: 120 * 1000, // wait up to 120s for server to start in CI
        reuseExistingServer: false,
      }
    : {
        command: 'cd apps/frontend && npm run dev',
        url: 'http://localhost:5173',
        timeout: 60 * 1000, // wait up to 60s for server to start
        reuseExistingServer: true,
      },
});
