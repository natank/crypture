import { test, expect } from '@playwright/test';
import { MarketPage } from '../../pom-pages/market-page.pom';

test.describe('Category Exploration', () => {
  let marketPage: MarketPage;

  const mockCategories = [
    { id: 'layer-1', name: 'Layer 1' },
    { id: 'decentralized-finance-defi', name: 'DeFi' },
    { id: 'gaming', name: 'Gaming' },
  ];

  const mockCoinsAll = [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 50000,
      price_change_percentage_24h: 2.5,
      market_cap: 1000000000000,
      market_cap_rank: 1,
      image: 'btc.png',
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3000,
      price_change_percentage_24h: 1.2,
      market_cap: 350000000000,
      market_cap_rank: 2,
      image: 'eth.png',
    },
  ];

  const mockCoinsDeFi = [
    {
      id: 'uniswap',
      symbol: 'uni',
      name: 'Uniswap',
      current_price: 10,
      price_change_percentage_24h: 5.0,
      market_cap: 6000000000,
      market_cap_rank: 20,
      image: 'uni.png',
    },
  ];

  test.beforeEach(async ({ page }) => {
    marketPage = new MarketPage(page);

    // Mock Global Market Data
    await page.route('**/api/coingecko/global*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            data: {
              total_market_cap: { usd: 2500000000000 },
              total_volume: { usd: 120000000000 },
              market_cap_percentage: { btc: 45.0, eth: 18.0 },
              market_cap_change_percentage_24h_usd: 2.5,
              active_cryptocurrencies: 10000,
              markets: 750,
              updated_at: Date.now() / 1000,
            },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock Trending Coins
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
                  name: 'Bitcoin',
                  symbol: 'BTC',
                  market_cap_rank: 1,
                  thumb: 'btc.png',
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

    // Mock Categories
    await page.route(
      '**/api/coingecko/coins/categories/list*',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockCategories,
            timestamp: new Date().toISOString(),
            requestId: 'mock-request-id',
          }),
        });
      }
    );

    // Mock Categories endpoint (without /list)
    await page.route('**/api/coingecko/coins/categories', async (route) => {
      const url = route.request().url();
      // Only match exact /categories, not /categories/list
      if (!url.includes('/list')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockCategories,
            timestamp: new Date().toISOString(),
            requestId: 'mock-request-id',
          }),
        });
      }
    });

    // Mock Market Data
    await page.route('**/api/coingecko/coins/markets*', async (route) => {
      const url = new URL(route.request().url());
      const category = url.searchParams.get('category');

      if (category === 'decentralized-finance-defi') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockCoinsDeFi,
            timestamp: new Date().toISOString(),
            requestId: 'mock-request-id',
          }),
        });
      } else {
        // Default / All
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: mockCoinsAll,
            timestamp: new Date().toISOString(),
            requestId: 'mock-request-id',
          }),
        });
      }
    });
  });

  test('User can view categories and filter coins', async ({ page }) => {
    await marketPage.goto();

    await test.step('Verify categories are displayed', async () => {
      // Check for category filter visibility
      await expect(page.getByTestId('category-filter')).toBeVisible();
      await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'DeFi' })).toBeVisible();
    });

    await test.step('Verify default coin list (All)', async () => {
      // Use specific test ID to target only the market coin list table
      const marketTable = page.getByTestId('market-coin-list-table');
      await expect(marketTable.getByText('Bitcoin')).toBeVisible();
      await expect(marketTable.getByText('Ethereum')).toBeVisible();
    });

    await test.step('Select DeFi category', async () => {
      const defiResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname.includes('/api/coingecko/coins/markets') &&
          url.searchParams.get('category') === 'decentralized-finance-defi'
        );
      });
      await page.getByRole('button', { name: 'DeFi' }).click();
      await defiResponse;
    });

    await test.step('Verify filtered coin list (DeFi)', async () => {
      // Use specific test ID to target only the market coin list table
      const marketTable = page.getByTestId('market-coin-list-table');
      // Bitcoin should disappear, Uniswap should appear
      await expect(marketTable.getByText('Bitcoin')).toHaveCount(0);
      await expect(marketTable.getByText('Uniswap')).toBeVisible();
    });

    await test.step('Return to All categories', async () => {
      const allResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.pathname.includes('/api/coingecko/coins/markets') &&
          !url.searchParams.get('category')
        );
      });
      await page.getByRole('button', { name: 'All' }).click();
      await allResponse;
      const marketTable = page.getByTestId('market-coin-list-table');
      await expect(marketTable.getByText('Bitcoin')).toBeVisible();
    });
  });
});
