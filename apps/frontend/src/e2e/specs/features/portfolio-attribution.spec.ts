import { test, expect } from '@playwright/test';

test.describe('PortfolioPage CoinGecko Attribution', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portfolio');
  });

  test('should display CoinGecko attribution when portfolio has assets', async ({
    page,
  }) => {
    // Mock portfolio with assets to ensure attribution is visible
    await page.route('**/api/coins/markets*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
            market_cap: 1000000000000,
            market_cap_rank: 1,
            price_change_percentage_24h: 2.5,
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            current_price: 3000,
            market_cap: 500000000000,
            market_cap_rank: 2,
            price_change_percentage_24h: 1.8,
          },
        ]),
      });
    });

    // Wait for portfolio to load
    await page.waitForSelector('[data-testid="portfolio-container"]', {
      timeout: 10000,
    });

    // Check for attribution in PortfolioPage (standard variant)
    const portfolioAttribution = page.locator(
      'text=Data provided by CoinGecko'
    );
    await expect(portfolioAttribution).toBeVisible();

    // Check that attribution links to CoinGecko
    const attributionLink = page.locator('a[href*="coingecko.com"]');
    await expect(attributionLink).toBeVisible();
    await expect(attributionLink).toHaveAttribute('target', '_blank');
    await expect(attributionLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check for UTM parameters
    await expect(attributionLink).toHaveAttribute(
      'href',
      /utm_source=crypture/
    );
  });

  test('should display compact attribution in AssetList when assets are present', async ({
    page,
  }) => {
    // Mock portfolio with assets
    await page.route('**/api/coins/markets*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
          },
        ]),
      });
    });

    // Wait for assets to load
    await page.waitForSelector('[data-testid="asset-row"]', { timeout: 10000 });

    // Check for compact attribution in AssetList
    const assetListAttribution = page.locator('text=Source: CoinGecko');
    await expect(assetListAttribution).toBeVisible();

    // Verify it's the compact variant (smaller text)
    const attributionContainer = assetListAttribution
      .locator('..')
      .locator('..');
    await expect(attributionContainer).toHaveClass(/text-xs/);
  });

  test('should not display attribution in AssetList when portfolio is empty', async ({
    page,
  }) => {
    // Mock empty portfolio
    await page.route('**/api/coins/markets*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Wait for empty state
    await page.waitForSelector('[data-testid="empty-state"]', {
      timeout: 10000,
    });

    // Check that compact attribution is NOT present in AssetList
    const assetListAttribution = page.locator('text=Source: CoinGecko');
    await expect(assetListAttribution).not.toBeVisible();
  });

  test('attribution should be accessible', async ({ page }) => {
    // Mock portfolio with assets
    await page.route('**/api/coins/markets*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
          },
        ]),
      });
    });

    // Wait for attribution to be visible
    await page.waitForSelector('text=Data provided by CoinGecko', {
      timeout: 10000,
    });

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const attributionLink = page.locator('a[href*="coingecko.com"]:focus');
    await expect(attributionLink).toBeVisible();

    // Test ARIA labels
    await expect(attributionLink).toHaveAttribute(
      'aria-label',
      /Visit CoinGecko website/
    );
  });

  test('attribution should be responsive', async ({ page }) => {
    // Mock portfolio with assets
    await page.route('**/api/coins/markets*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
          },
        ]),
      });
    });

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForSelector('text=Data provided by CoinGecko', {
      timeout: 10000,
    });

    const attribution = page.locator('text=Data provided by CoinGecko');
    await expect(attribution).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(attribution).toBeVisible();
  });
});
