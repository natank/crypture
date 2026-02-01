// Console setup for E2E tests to capture browser console logs
import { test as base, Page } from '@playwright/test';

// Extend test to capture console logs (less verbose)
export const test = base.extend({
  page: async ({ page }, use) => {
    // Capture console logs (only errors and warnings)
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        const message = `[${msg.type()}] ${msg.text()}${msg.location() ? ` (${msg.location().url}:${msg.location().lineNumber})` : ''}`;
        console.log(`🔍 Browser Console: ${message}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      const errorMessage = `[PAGE ERROR] ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
      console.log(`❌ Browser Error: ${errorMessage}`);
    });

    // Provide the page to the test
    await use(page);
  },
});

export { expect } from '@playwright/test';
