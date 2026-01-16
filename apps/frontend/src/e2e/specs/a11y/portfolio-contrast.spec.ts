import { test } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test("Portfolio page has no contrast accessibility violations", async ({
  page,
}) => {
  await page.goto("/portfolio");

  const results = await new AxeBuilder({ page }).include("body").analyze();

  if (results.violations.length > 0) {
    console.error(
      "Accessibility Violations:",
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n) => n.html),
      }))
    );
    throw new Error(
      `${results.violations.length} accessibility violations found`
    );
  }
});
