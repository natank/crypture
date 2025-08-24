import { test as base, expect, Page } from "@playwright/test";

// Custom helper to fail first and then succeed after retry
async function mockMarketsFailThenSucceed(page: Page) {
  let callCount = 0;
  await page.route("**/api.coingecko.com/api/v3/coins/markets**", async (route) => {
    callCount++;
    if (callCount === 1) {
      // First call fails
      return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "fail" }) });
    }
    // Subsequent calls succeed with static data
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

    // Navigate to app
    await page.goto("/");

    // Expect error banner visible
    const retryButton = page.getByRole("button", { name: /retry/i });
    await expect(retryButton).toBeVisible();

    // Controls remain enabled while error is present (disabled only during loading/refreshing)
    const filterInput = page.getByPlaceholder("Search assets...");
    const sortDropdown = page.getByTestId("sort-dropdown");
    const addAssetButton = page.getByTestId("add-asset-button");

    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();

    // Click Retry -> next request succeeds, error should disappear and controls enabled
    await retryButton.click();

    await expect(retryButton).toHaveCount(0);
    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();
  });
});
