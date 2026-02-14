import { test, expect } from '@e2e/test-setup';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoChartData,
  mockCoinGeckoCoinDetails,
} from '@e2e/mocks/mockCoinGecko';

/** Mock any /coins/<id> detail request not covered by mockCoinGeckoCoinDetails */
async function mockAllCoinDetails(page: import('@playwright/test').Page) {
  await page.route('**/api/coingecko/coins/*', async (route) => {
    const url = route.request().url();
    // Let market_chart and markets routes pass through to their own handlers
    if (url.includes('market_chart') || url.includes('markets')) {
      return route.fallback();
    }
    const coinId = url.split('/coins/').pop()?.split('?')[0] ?? 'unknown';
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: coinId,
          symbol: coinId.slice(0, 3),
          name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
          image: { large: '', small: '', thumb: '' },
          description: { en: '' },
          links: {
            homepage: [],
            whitepaper: '',
            blockchain_site: [],
            twitter_screen_name: '',
            subreddit_url: '',
            repos_url: { github: [] },
          },
          categories: [],
          market_cap_rank: 99,
          market_data: {
            current_price: { usd: 1 },
            market_cap: { usd: 1 },
            total_volume: { usd: 1 },
            high_24h: { usd: 1 },
            low_24h: { usd: 1 },
            price_change_percentage_24h: 0,
            price_change_percentage_7d: 0,
            price_change_percentage_30d: 0,
            ath: { usd: 1 },
            ath_date: { usd: '2021-01-01T00:00:00.000Z' },
            ath_change_percentage: { usd: 0 },
            atl: { usd: 0.01 },
            atl_date: { usd: '2020-01-01T00:00:00.000Z' },
            atl_change_percentage: { usd: 0 },
            circulating_supply: 1,
            total_supply: 1,
            max_supply: 1,
          },
        },
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

test.describe('Demo Portfolio Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoChartData(page);
    await mockCoinGeckoCoinDetails(page);
    await mockAllCoinDetails(page);
  });

  test('shows welcome modal on first visit with empty portfolio', async ({
    page,
  }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const dialog = page.getByRole('dialog', { name: /welcome to crypture/i });
    await expect(dialog).toBeVisible();
    await expect(
      page.getByRole('button', { name: /add demo portfolio/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /start from scratch/i })
    ).toBeVisible();
  });

  test('loads demo portfolio when user accepts', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Accept the demo portfolio
    await page.getByTestId('accept-demo-portfolio').click();

    // Modal should close
    await expect(
      page.getByRole('dialog', { name: /welcome to crypture/i })
    ).not.toBeVisible();

    // Demo assets that exist in the mock data should appear
    // The mock markets include BTC, ETH, and ADA
    await expect(page.getByTestId('asset-row-BTC')).toBeVisible();
    await expect(page.getByTestId('asset-row-ETH')).toBeVisible();
    await expect(page.getByTestId('asset-row-ADA')).toBeVisible();
  });

  test('shows empty portfolio when user dismisses', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Dismiss the demo
    await page.getByTestId('dismiss-demo-portfolio').click();

    // Modal should close
    await expect(
      page.getByRole('dialog', { name: /welcome to crypture/i })
    ).not.toBeVisible();

    // No assets should be present
    await expect(page.getByTestId('asset-row-BTC')).not.toBeVisible();
    await expect(page.getByTestId('asset-row-ETH')).not.toBeVisible();
  });

  test('does not show modal again after accepting', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Accept
    await page.getByTestId('accept-demo-portfolio').click();
    await expect(
      page.getByRole('dialog', { name: /welcome to crypture/i })
    ).not.toBeVisible();

    // Reload the page
    await page.reload();

    // Modal should not reappear
    await expect(
      page.getByRole('dialog', { name: /welcome to crypture/i })
    ).not.toBeVisible();

    // Assets should still be there
    await expect(page.getByTestId('asset-row-BTC')).toBeVisible();
  });

  test('does not show modal again after dismissing', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Dismiss
    await page.getByTestId('dismiss-demo-portfolio').click();

    // Reload
    await page.reload();

    // Modal should not reappear
    await expect(
      page.getByRole('dialog', { name: /welcome to crypture/i })
    ).not.toBeVisible();
  });

  test('closes modal on Escape key', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const dialog = page.getByRole('dialog', { name: /welcome to crypture/i });
    await expect(dialog).toBeVisible();

    // Click inside the dialog first to ensure focus is within the page
    await dialog.getByRole('button', { name: /add demo portfolio/i }).focus();
    await page.keyboard.press('Escape');

    await expect(dialog).not.toBeVisible();
  });
});
