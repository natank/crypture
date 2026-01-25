import { test as base, expect, Page } from '@playwright/test';

async function mockMarketsWithDelayedRefresh(page: Page, delayMs = 800) {
  let callCount = 0;
  try {
    await page.unroute('**/api/coingecko/coins/markets**');
  } catch {
    // Ignore unroute failures
  }

  await page.route('**/api/coingecko/coins/markets**', async (route) => {
    callCount++;
    const body = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 30000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 2000,
        image:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      },
    ];

    if (callCount > 1) await new Promise((r) => setTimeout(r, delayMs));

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

// Traceability: UI States — refreshing disables controls, sets aria-busy, shows lightweight updating indicator
base.describe('Refreshing state disables controls and sets aria-busy', () => {
  base(
    'during background refresh, controls disabled and main has aria-busy=true',
    async ({ page }) => {
      await mockMarketsWithDelayedRefresh(page, 1000);
      await page.goto('/portfolio?e2e=1');
      await expect(page.getByText(/Total Portfolio Value/i)).toBeVisible();

      const filterInput = page.getByTestId('filter-input').first();
      const sortDropdown = page.getByTestId('sort-dropdown').first();
      const addAssetButton = page.getByTestId('add-asset-button');

      await expect(filterInput).toBeEnabled();
      await expect(sortDropdown).toBeEnabled();
      await expect(addAssetButton).toBeEnabled();

      await page.getByTestId('refresh-now').click();
      const busyMain = page.locator("main[aria-busy='true']").first();
      await busyMain.waitFor({ state: 'visible', timeout: 8000 });

      await expect(filterInput).toBeDisabled();
      await expect(sortDropdown).toBeDisabled();
      await expect(addAssetButton).toBeDisabled();

      await busyMain.waitFor({ state: 'detached', timeout: 8000 });
      await expect(page.locator("main[aria-busy='true']")).toHaveCount(0);

      await expect(filterInput).toBeEnabled();
      await expect(sortDropdown).toBeEnabled();
      await expect(addAssetButton).toBeEnabled();
    }
  );
});
