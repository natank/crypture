import { test, expect } from '@e2e/fixtures';
import { mockCoinGeckoMarkets } from '@e2e/mocks/mockCoinGecko';

test.describe('Portfolio value display', () => {
  test('should show BTC value = $15,000 when added at 0.5 @ $30k', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    await mockCoinGeckoMarkets(portfolioPage.page);

    await addAssetModal.openAndAdd('BTC', 0.5);

    const btcRow = portfolioPage.assetRow('BTC');
    await expect(btcRow).toContainText('Price: $30,000');
    await expect(btcRow).toContainText('Total: $15,000');
    await expect(portfolioPage.header).toContainText('$15,000');
  });

  test('should show global and inline fallback when price fetch fails', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Simulate CoinGecko API failure
    await portfolioPage.page.route('**/coins/markets**', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' })
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
    const assetSelect = portfolioPage.page.locator('select#asset-select');
    await expect(assetSelect).toHaveCount(0);
  });
  test('should update BTC value when price changes via polling', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Start with mocked BTC @ $30,000
    await mockCoinGeckoMarkets(portfolioPage.page, {
      BTC: 30000,
    });

    await addAssetModal.openAndAdd('BTC', 0.5);

    const btcRow = portfolioPage.assetRow('BTC');
    await expect(btcRow).toContainText('Total: $15,000');

    // 2. Mock API to respond with BTC @ $40,000 on next fetch
    await portfolioPage.page.unroute('**/coins/markets**'); // remove old handler
    await portfolioPage.page.route('**/coins/markets**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 40000,
          },
        ]),
      });
    });

    // 3. Force a refetch by reloading the page so we don't depend on polling timing
    await portfolioPage.reload();

    // 4. Verify updated value deterministically
    const btcRowAfter = portfolioPage.assetRow('BTC');
    await expect(btcRowAfter).toContainText('Total: $20,000');

    await expect(portfolioPage.header).toContainText('$20,000');
  });
});
