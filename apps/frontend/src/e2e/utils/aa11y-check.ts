// e2e/utils/a11y-check.ts

import type { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

export async function runAccessibilityAudit(page: Page, context = 'body') {
  const results = await new AxeBuilder({ page }).include(context).analyze();

  // Only fail on critical violations for smoke checks
  const critical = results.violations.filter((v) => v.impact === 'critical');
  if (critical.length > 0) {
    console.error('Critical Accessibility Violations:', critical);
    throw new Error(`${critical.length} critical accessibility violations`);
  }
}
