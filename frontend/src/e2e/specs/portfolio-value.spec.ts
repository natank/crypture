import { test, expect } from "@e2e/fixtures";
import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";

test.describe("Portfolio value display", () => {
  test("should show BTC value = $15,000 when added at 0.5 @ $30k", async ({
    portfolioPage,
    addAssetModal,
  }) => {
    await mockCoinGeckoMarkets(portfolioPage.page);

    await addAssetModal.openAndAdd("BTC", 0.5);

    const btcRow = portfolioPage.assetRow("BTC");
    await expect(btcRow).toContainText("Price: $30,000");
    await expect(btcRow).toContainText("Total: $15,000");
    await expect(portfolioPage.header).toContainText("$15,000");
  });

  test("should show global and inline fallback when price fetch fails", async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Simulate CoinGecko API failure
    await portfolioPage.page.route("**/coins/markets**", (route) =>
      route.fulfill({ status: 500, body: "Internal Server Error" })
    );

    // 2. Load the page
    await portfolioPage.goto();

    // 3. Expect *any* global alert (broader match)
    const alerts = portfolioPage.page.locator('div[role="alert"]');
    await expect(alerts.first()).toBeVisible();

    // 4. Open Add Asset Modal
    await addAssetModal.open();

    // 5. AssetSelector will render fallback <div role="alert"> with error
    const modalInlineError = portfolioPage.page
      .locator('[role="dialog"]')
      .locator('div[role="alert"]');

    await expect(modalInlineError).toBeVisible();
    await expect(modalInlineError).toContainText(/error|failed/i);

    // 6. Asset <select> is not rendered
    const assetSelect = portfolioPage.page.locator("select#asset-select");
    await expect(assetSelect).toHaveCount(0);
  });
});
