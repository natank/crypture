import { test, expect } from '@playwright/test';
import { MarketPage } from '../pom-pages/market-page.pom';

const inlineCoinIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23999'/%3E%3C/svg%3E";

test.describe('Trending & Discovery Feed', () => {
  let marketPage: MarketPage;

  test.beforeEach(async ({ page }) => {
    // Mock Trending API
    await page.route('**/api/coingecko/search/trending*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            coins: [
              {
                item: {
                  id: 'bitcoin',
                  coin_id: 1,
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  market_cap_rank: 1,
                  thumb: inlineCoinIcon,
                  small: inlineCoinIcon,
                  large: inlineCoinIcon,
                  slug: 'bitcoin',
                  price_btc: 1,
                  score: 0,
                },
              },
            ],
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock Top Movers API (Gainers & Losers)
    await page.route('**/api/coingecko/coins/markets*', async (route) => {
      const url = new URL(route.request().url());
      const order = url.searchParams.get('order');
      const isGainers = order === 'price_change_percentage_24h_desc';

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: isGainers ? 'pepe' : 'terra',
              symbol: isGainers ? 'pepe' : 'luna',
              name: isGainers ? 'Pepe' : 'Terra',
              image: inlineCoinIcon,
              current_price: 100,
              market_cap: 1000000,
              market_cap_rank: 1,
              price_change_percentage_24h: isGainers ? 15.5 : -20.5,
            },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock Global Market Data (to prevent errors in MarketOverview)
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

    // Mock Categories
    await page.route('**/api/coingecko/coins/categories*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ category_id: 'cryptocurrency', name: 'Cryptocurrency' }],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    marketPage = new MarketPage(page);
    await marketPage.goto();
  });

  test('should display trending coins section', async () => {
    await expect(marketPage.trendingSection).toBeVisible();

    // Should have some trending coins (assuming API works or is mocked)
    // In a real E2E, we might rely on the real API or a network mock.
    // If we rely on real API, we just check for visibility.
    await expect(marketPage.trendingCoins.first()).toBeVisible();
  });

  test('should display top gainers and losers sections', async () => {
    await expect(marketPage.topGainersSection).toBeVisible();
    await expect(marketPage.topLosersSection).toBeVisible();

    await expect(marketPage.topGainers.first()).toBeVisible();
    await expect(marketPage.topLosers.first()).toBeVisible();
  });

  test('should display correct structure for a trending coin card', async () => {
    // Wait for data to load
    await expect(marketPage.page.getByText('Bitcoin')).toBeVisible();

    // Check the first trending coin card for expected elements
    const firstCoin = marketPage.trendingCoins.first();
    await expect(firstCoin).toBeVisible();

    // Check for rank, image, name, symbol
    await expect(firstCoin.locator('img')).toBeVisible();
    // Use .first() to avoid ambiguity if multiple bold spans exist (rank and name)
    await expect(firstCoin.locator('span.font-bold').first()).toBeVisible();
    await expect(firstCoin.locator('span.text-sm')).toBeVisible(); // Symbol
  });

  test('should display correct structure for a mover row', async () => {
    await expect(marketPage.topGainersSection).toBeVisible();

    // Check the first gainer row
    const firstGainer = marketPage.topGainers.first();
    await expect(firstGainer).toBeVisible();

    // Check for image, symbol, price, change
    await expect(firstGainer.locator('img')).toBeVisible();
    await expect(firstGainer.locator('.text-green-600')).toBeVisible(); // Positive change
  });
});
