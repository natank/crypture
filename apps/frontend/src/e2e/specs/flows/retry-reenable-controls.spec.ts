import { test as base, expect, Page } from "@playwright/test";

async function mockMarketsFailThenSucceed(page: Page) {
  let callCount = 0;
  await page.route("**/api.coingecko.com/api/v3/coins/markets**", async (route) => {
    callCount++;
    if (callCount === 1) {
      return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "fail" }) });
    }
    const body = [
      { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 30000, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
      { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 2000, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    ];
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

base.describe("Retry flow clears error and re-enables controls", () => {
  base("error shown initially, retry succeeds, controls usable before and after", async ({ page }) => {
    await mockMarketsFailThenSucceed(page);
    await page.goto("/portfolio");

    // Use first() to handle multiple retry buttons from error banners
    const retryButton = page.getByRole("button", { name: /retry/i }).first();
    await expect(retryButton).toBeVisible();
    const filterInput = page.getByTestId("filter-input").first();
    const sortDropdown = page.getByTestId("sort-dropdown").first();
    const addAssetButton = page.getByTestId("add-asset-button");

    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();

    await retryButton.click();

    await expect(retryButton).toHaveCount(0);
    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();
  });
});
