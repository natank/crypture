// Console setup for E2E tests to capture browser console logs
import { test as base, Page } from '@playwright/test';

// Check if console logging should be enabled
const enableVerboseLogging = process.env.E2E_VERBOSE_LOGS === 'true';
const disableAllLogging = process.env.E2E_VERBOSE_LOGS === 'false';

// Extend test to capture console logs
export const test = base.extend({
  page: async ({ page }, use) => {
    // Only capture console logs if verbose logging is enabled
    if (!disableAllLogging) {
      page.on('console', (msg) => {
        // Always show errors
        if (msg.type() === 'error') {
          const message = `[${msg.type()}] ${msg.text()}${msg.location() ? ` (${msg.location().url}:${msg.location().lineNumber})` : ''}`;
          console.log(`❌ Browser Error: ${message}`);
          return;
        }

        // Show warnings unless explicitly disabled
        if (msg.type() === 'warning') {
          const message = `[${msg.type()}] ${msg.text()}${msg.location() ? ` (${msg.location().url}:${msg.location().lineNumber})` : ''}`;
          console.log(`⚠️ Browser Warning: ${message}`);
          return;
        }

        // Show all logs if verbose logging is enabled
        if (enableVerboseLogging) {
          const message = `[${msg.type()}] ${msg.text()}${msg.location() ? ` (${msg.location().url}:${msg.location().lineNumber})` : ''}`;
          console.log(`🔍 Browser Console: ${message}`);
        }
      });

      // Listen for page errors (always show)
      page.on('pageerror', (error) => {
        const errorMessage = `[PAGE ERROR] ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
        console.log(`💥 Page Error: ${errorMessage}`);
      });
    } else {
      // When logging is disabled, completely silence browser console
      page.on('console', () => {});
      page.on('pageerror', () => {});
    }

    // Provide the page to the test (using Playwright's extend API, not React)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { expect } from '@playwright/test';
