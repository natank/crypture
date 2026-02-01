import { test, expect } from '../console-setup';

test.describe('Category Preference Simple Test', () => {
  test('should toggle category preference and see effect', async ({ page }) => {
    // Set up mocks
    await page.route('**/api/coingecko/coins/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/simple/price*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            bitcoin: { usd: 50000 },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/coins/markets*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'bitcoin',
              symbol: 'btc',
              name: 'Bitcoin',
              image: 'https://example.com/btc.png',
              current_price: 50000,
              market_cap: 1000000000000,
              market_cap_rank: 1,
              price_change_percentage_24h: 2.5,
              price_change_percentage_7d: 5.0,
            },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/coins/bitcoin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            categories: [
              'Smart Contract Platform',
              'Layer 1 (L1)',
              'FTX Holdings',
              'Proof of Work (PoW)',
              'Bitcoin Ecosystem',
              'GMCI 30 Index',
              'GMCI Index',
              'Coinbase 50 Index'
            ],
            market_cap_rank: 1,
            market_data: { current_price: { usd: 50000 } },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Start on settings page
    await page.goto('/settings');
    
    // Should default to filtered categories
    await expect(page.locator('#filtered-categories')).toBeChecked();
    await expect(page.locator('#all-categories')).not.toBeChecked();
    
    // Check localStorage
    const initialSettings = await page.evaluate(() => {
      return localStorage.getItem('crypture_user_settings');
    });
    console.log('Initial settings:', initialSettings);
    
    // Switch to all categories
    await page.locator('#all-categories').check();
    await page.waitForTimeout(500);
    
    // Check localStorage after change
    const updatedSettings = await page.evaluate(() => {
      return localStorage.getItem('crypture_user_settings');
    });
    console.log('Updated settings:', updatedSettings);
    
    // Should now have all categories selected
    await expect(page.locator('#all-categories')).toBeChecked();
    await expect(page.locator('#filtered-categories')).not.toBeChecked();
    
    // Verify the setting was saved correctly
    expect(updatedSettings).toBe('{"showAllCategories":true}');
  });
});
