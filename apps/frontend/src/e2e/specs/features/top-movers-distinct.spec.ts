import { test, expect } from '@playwright/test';

test.describe('Top Movers - Distinct Gainers and Losers', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/coingecko/global*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            data: {
              total_market_cap: { usd: 1000000000 },
              total_volume: { usd: 50000000 },
              market_cap_percentage: { btc: 50, eth: 20 },
              market_cap_change_percentage_24h_usd: 5,
              active_cryptocurrencies: 1000,
              markets: 100,
              updated_at: 1234567890,
            },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/coins/categories*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ id: 'cryptocurrency', name: 'Cryptocurrency' }],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/coins/markets*', async (route) => {
      const url = new URL(route.request().url());
      const order = url.searchParams.get('order');

      const gainers = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          current_price: 50000,
          market_cap: 1_000_000_000_000,
          market_cap_rank: 1,
          price_change_percentage_24h: 5.2,
        },
        {
          id: 'solana',
          symbol: 'sol',
          name: 'Solana',
          image: 'https://example.com/sol.png',
          current_price: 150,
          market_cap: 70_000_000_000,
          market_cap_rank: 5,
          price_change_percentage_24h: 4.1,
        },
      ];

      const losers = [
        {
          id: 'cardano',
          symbol: 'ada',
          name: 'Cardano',
          image: 'https://example.com/ada.png',
          current_price: 0.5,
          market_cap: 17_000_000_000,
          market_cap_rank: 8,
          price_change_percentage_24h: -3.8,
        },
        {
          id: 'polkadot',
          symbol: 'dot',
          name: 'Polkadot',
          image: 'https://example.com/dot.png',
          current_price: 7,
          market_cap: 10_000_000_000,
          market_cap_rank: 12,
          price_change_percentage_24h: -2.4,
        },
      ];

      // Keep loading state observable and deterministic.
      await new Promise((resolve) => setTimeout(resolve, 600));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: order === 'price_change_percentage_24h_asc' ? losers : gainers,
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });
  });

  test('should display different coins in Top Gainers and Top Losers sections', async ({
    page,
  }) => {
    // Navigate to market overview page
    await page.goto('/market');

    // Wait for the page to load and top movers section to be visible
    await page.waitForSelector('[data-testid="top-movers-section"]', {
      timeout: 10000,
    });

    // Get all coin symbols from Top Gainers section
    const gainersSection = page
      .locator('h3:has-text("Top Gainers")')
      .locator('..');
    const gainerCoins = await gainersSection
      .locator('[data-testid="coin-symbol"]')
      .allTextContents();

    // Get all coin symbols from Top Losers section
    const losersSection = page
      .locator('h3:has-text("Top Losers")')
      .locator('..');
    const loserCoins = await losersSection
      .locator('[data-testid="coin-symbol"]')
      .allTextContents();

    // Verify that both sections have coins
    expect(gainerCoins.length).toBeGreaterThan(0);
    expect(loserCoins.length).toBeGreaterThan(0);

    // Verify that no coin appears in both sections
    const overlappingCoins = gainerCoins.filter((coin) =>
      loserCoins.includes(coin)
    );
    expect(overlappingCoins).toHaveLength(0);

    // Verify that gainers have positive percentage changes
    const gainerChanges = await gainersSection
      .locator('[data-testid="price-change"]')
      .allTextContents();
    gainerChanges.forEach((change) => {
      expect(change).toMatch(/^\+/); // Should start with + for positive changes
    });

    // Verify that losers have negative percentage changes
    const loserChanges = await losersSection
      .locator('[data-testid="price-change"]')
      .allTextContents();
    loserChanges.forEach((change) => {
      expect(change).toMatch(/^-/); // Should start with - for negative changes
    });
  });

  test('should handle loading state gracefully', async ({ page }) => {
    // Navigate to market overview page
    await page.goto('/market');

    const loading = page.locator('[data-testid="top-movers-loading"]');
    const section = page.locator('[data-testid="top-movers-section"]');

    // In fast environments the loading UI can be very brief; accept either path.
    await Promise.race([
      loading.waitFor({ state: 'visible', timeout: 4000 }),
      section.waitFor({ state: 'visible', timeout: 4000 }),
    ]);

    // Wait for content to load
    await expect(section).toBeVisible({ timeout: 10000 });

    // Verify loading state is gone
    await expect(loading).not.toBeVisible();
  });
});
