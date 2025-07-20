// src/e2e/specs/persist-portfolio.spec.ts
import { test, expect } from "@e2e/fixtures";
test.describe("📦 Persist Portfolio", () => {
  test("should restore portfolio after reload", async ({
    page,
    portfolioPage,
    addAssetModal,
  }) => {
    await addAssetModal.openAndAdd("BTC", 1.5);
    await expect(portfolioPage.assetRow("BTC")).toBeVisible();

    // Reload the page
    await portfolioPage.reload();
    await page.pause();
    // Assert BTC is still present
    await expect(portfolioPage.assetRow("BTC")).toBeVisible();

    // Assert quantity is correct
    await expect(portfolioPage.assetQuantity("BTC", 1.5)).toBeVisible();
  });

  test("should persist empty state after deleting last asset", async ({
    portfolioPage,
    addAssetModal,
    deleteModal,
  }) => {
    // Add then delete asset
    await addAssetModal.openAndAdd("ETH", 2);
    await expect(portfolioPage.assetRow("ETH")).toBeVisible();

    await portfolioPage.openDeleteModalFor("ETH");
    await deleteModal.confirm();

    // Verify UI is empty
    await expect(portfolioPage.assetRow("ETH")).not.toBeVisible();

    // Reload the page
    await portfolioPage.reload();

    // Confirm empty state persists
    await expect(portfolioPage.assetRow("ETH")).not.toBeVisible();
    await expect(portfolioPage.isEmptyStateVisible()).toBeTruthy();
  });
});
