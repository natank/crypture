import { test as base, expect, Page } from "@playwright/test";

async function mockMarketsWithDelayedRefresh(page: Page, delayMs = 800) {
  let callCount = 0;
  // Remove any existing routes for the markets endpoint (in case fixtures added one)
  try {
    await page.unroute("**/api.coingecko.com/api/v3/coins/markets**");
  } catch {}

  await page.route("**/api.coingecko.com/api/v3/coins/markets**", async (route) => {
    callCount++;
    const body = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        current_price: 30000,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        current_price: 2000,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
    ];

    // First call: respond immediately to complete initial loading
    // Subsequent calls: delay to keep refreshing state observable
    if (callCount > 1) await new Promise((r) => setTimeout(r, delayMs));

    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

// Traceability: UI States — refreshing disables controls, sets aria-busy, shows lightweight updating indicator
base.describe("Refreshing state disables controls and sets aria-busy", () => {
  base("during background refresh, controls disabled and main has aria-busy=true", async ({ page }) => {
    // Ensure polling is short; CI uses script with VITE_POLL_INTERVAL=2000 already
    await mockMarketsWithDelayedRefresh(page, 1000);

    await page.goto("/?e2e=1");

    // Wait for initial load to complete (header visible and controls enabled)
    await expect(page.getByText(/Total Portfolio Value/i)).toBeVisible();

    const filterInput = page.getByPlaceholder("Search assets...");
    const sortDropdown = page.getByTestId("sort-dropdown");
    const addAssetButton = page.getByTestId("add-asset-button");

    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();

    // Trigger a deterministic refresh via test-only button
    await page.getByTestId("refresh-now").click();
    // Observe aria-busy=true on main during refresh
    const busyMain = page.locator("main[aria-busy='true']").first();
    await busyMain.waitFor({ state: "visible", timeout: 8000 });

    await expect(filterInput).toBeDisabled();
    await expect(sortDropdown).toBeDisabled();
    await expect(addAssetButton).toBeDisabled();

    // After refresh completes, aria-busy should be removed and controls re-enable
    await busyMain.waitFor({ state: "detached", timeout: 8000 });
    await expect(page.locator("main[aria-busy='true']")).toHaveCount(0);

    await expect(filterInput).toBeEnabled();
    await expect(sortDropdown).toBeEnabled();
    await expect(addAssetButton).toBeEnabled();
  });
});
