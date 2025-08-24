// e2e/specs/a11y-mobile-smoke.spec.ts
import { test, expect } from "@e2e/test-setup";
import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";
import { runAccessibilityAudit } from "@e2e/utils/aa11y-check";

async function assertMinTappable(locator: ReturnType<typeof test.extend>["arguments"][0]["page"]["locator"], min = 44) {
  const box = await locator.boundingBox();
  expect(box, `Element ${await locator.toString()} should be attached with a bounding box`).not.toBeNull();
  if (!box) return; // type guard
  expect(box.width).toBeGreaterThanOrEqual(min);
  expect(box.height).toBeGreaterThanOrEqual(min);
}

test.describe("A11y & Mobile smoke", () => {
  test.beforeEach(async ({ page }) => {
    await mockCoinGeckoMarkets(page);
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12/13-ish
  });

  test("critical controls are visible, tappable, and page has no critical a11y violations", async ({ page }) => {
    await page.goto("/");

    // Core controls and inputs
    const addAssetButton = page.getByTestId("add-asset-button");
    const exportButton = page.getByTestId("export-button");
    const importButton = page.getByTestId("import-button");
    const filterInput = page.getByPlaceholder(/search assets/i);
    const sortDropdown = page.getByTestId("sort-dropdown");

    await expect(addAssetButton).toBeVisible();
    await expect(exportButton).toBeVisible();
    await expect(importButton).toBeVisible();
    await expect(filterInput).toBeVisible();
    await expect(sortDropdown).toBeVisible();

    // Tappable size check (44x44)
    await assertMinTappable(addAssetButton);
    await assertMinTappable(exportButton);
    await assertMinTappable(importButton);

    // Basic a11y audit (axe)
    await runAccessibilityAudit(page);
  });
});
