// Console setup for E2E tests to capture browser console logs
import { test as base, Page } from '@playwright/test';

// Extend test to capture console logs
export const test = base.extend({
  page: async ({ page }, use) => {
    // Capture console logs
    const consoleMessages: string[] = [];
    
    // Listen for all console events
    page.on('console', (msg) => {
      const message = `[${msg.type()}] ${msg.text()}${msg.location() ? ` (${msg.location().url}:${msg.location().lineNumber})` : ''}`;
      consoleMessages.push(message);
      
      // Also log to terminal for immediate visibility
      console.log(`🔍 Browser Console: ${message}`);
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      const errorMessage = `[PAGE ERROR] ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
      consoleMessages.push(errorMessage);
      console.log(`❌ Browser Error: ${errorMessage}`);
    });

    // Provide the page to the test
    await use(page);

    // After test, you can access consoleMessages if needed
    // For now, we're just logging them to terminal in real-time
  },
});

export { expect } from '@playwright/test';
