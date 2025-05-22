// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e/specs",
  use: {
    baseURL: "http://localhost:5173", // adjust to your dev server
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    timeout: 10 * 1000, // wait up to 10s for server to start
    reuseExistingServer: !process.env.CI,
  },
});
