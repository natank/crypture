// e2e/utils/a11y-check.ts

import type { Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

export async function runAccessibilityAudit(page: Page, context = "body") {
  const results = await new AxeBuilder({ page }).include(context).analyze();

  if (results.violations.length > 0) {
    console.error("Accessibility Violations:", results.violations);
    throw new Error(
      `${results.violations.length} accessibility violations found`
    );
  }
}
