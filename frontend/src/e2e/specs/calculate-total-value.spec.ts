import { mockCoinGeckoMarkets } from "@e2e/mocks/mockCoinGecko";
import { test, expect } from "@e2e/fixtures";

test.describe("Total Portfolio Value Calculation", () => {
  test.beforeEach(async ({ portfolioPage, page }) => {
    await mockCoinGeckoMarkets(page);

    await portfolioPage.goto();
  });

  test("displays correct total after adding BTC (0.5 @ $30,000)", async ({
    page,
    addAssetModal,
    portfolioPage,
  }) => {
    // 🧪 Step 0: Mock price data for BTC
    await mockCoinGeckoMarkets(page);

    // Step 1: Add BTC with quantity 0.5
    await addAssetModal.openAndAdd("BTC", 0.5);

    // Step 2: Assert total value = 0.5 * 30,000 = $15,000.00
    await expect(portfolioPage.header).toContainText("$15,000");
  });

  test("updates total value after deleting BTC", async ({
    page,
    addAssetModal,
    portfolioPage,
    deleteModal,
  }) => {
    // 🧪 Step 0: Mock CoinGecko price for BTC
    await mockCoinGeckoMarkets(page);

    // ➕ Step 1: Add BTC with quantity 0.5
    await addAssetModal.openAndAdd("BTC", 0.5);

    // ✅ Step 2: Confirm total shows $15,000
    await expect(portfolioPage.header).toContainText("$15,000");

    // 🗑️ Step 3: Trigger delete for BTC
    await portfolioPage.openDeleteModalFor("BTC");
    await deleteModal.confirm();

    // 💰 Step 4: Confirm total is $0 or fallback
    await expect(portfolioPage.header).toContainText("$0");
  });

  test("shows fallback UI when price fetch fails", async ({
    page,
    addAssetModal,
    portfolioPage,
  }) => {
    // 🧪 Step 0: Provide asset data without price
    await page.route(
      "**/api.coingecko.com/api/v3/coins/markets**",
      async (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: "bitcoin",
              symbol: "btc",
              name: "Bitcoin",
              image:
                "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            },
          ]),
        });
      }
    );

    // ➕ Step 1: Add BTC
    await addAssetModal.openAndAdd("BTC", 0.5);

    // ⚠️ Step 2: Total value should show fallback ("$0")
    await expect(portfolioPage.header).toContainText("$0");
  });
});
