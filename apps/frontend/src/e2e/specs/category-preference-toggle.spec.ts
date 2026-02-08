import { test, expect } from '../console-setup';
import { PortfolioPage } from '../pom-pages/portfolio.pom';

test.describe('Category Preference Toggle', () => {
  let portfolioPage: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    // Mock CoinGecko API for coin list
    await page.route('**/api/coingecko/coins/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock price data
    await page.route('**/api/coingecko/simple/price*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            bitcoin: { usd: 50000 },
            ethereum: { usd: 3000 },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock market data
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
            {
              id: 'ethereum',
              symbol: 'eth',
              name: 'Ethereum',
              image: 'https://example.com/eth.png',
              current_price: 3000,
              market_cap: 350000000000,
              market_cap_rank: 2,
              price_change_percentage_24h: 3.2,
              price_change_percentage_7d: 7.5,
            },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock coin details with index fund categories
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
              'Coinbase 50 Index',
            ],
            market_cap_rank: 1,
            market_data: { current_price: { usd: 50000 } },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    await page.route('**/api/coingecko/coins/ethereum', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            categories: [
              'Smart Contract Platform',
              'Layer 1 (L1)',
              'Ethereum Ecosystem',
              'FTX Holdings',
              'Multicoin Capital Portfolio',
              'Proof of Stake (PoS)',
              'GMCI Index',
              'Coinbase 50 Index',
            ],
            market_cap_rank: 2,
            market_data: { current_price: { usd: 3000 } },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
  });

  test('should default to filtered categories', async () => {
    // Clear localStorage to ensure clean state
    await portfolioPage.page.evaluate(() => localStorage.clear());
    await portfolioPage.reload();

    // Add Bitcoin to portfolio
    await portfolioPage.addAsset('BTC', 1);

    // Switch to category view
    const viewSelector = portfolioPage.page.getByTestId(
      'allocation-view-selector'
    );
    const categoryTab = viewSelector.getByRole('tab', { name: /category/i });
    await categoryTab.click();

    // Wait for the chart to render
    await portfolioPage.page.waitForTimeout(500);

    const legend = portfolioPage.page.getByTestId('allocation-legend');
    const categoryItems = await legend
      .locator('[data-testid="allocation-legend-item"]')
      .all();

    // Should show 4 filtered categories (default behavior)
    expect(categoryItems.length).toBe(4);

    const categoryNames = await Promise.all(
      categoryItems.map(async (item) => {
        const text = await item.textContent();
        // Remove percentage and dollar amount, keep just the category name
        return text
          ?.replace(/\d+(?:\.\d+)?%/, '')
          .replace(/\$[\d,]+(?:\.\d+)?/, '')
          .trim();
      })
    );

    // Should show core categories only
    expect(categoryNames).toContain('Smart Contract Platform');
    expect(categoryNames).toContain('Layer 1 (L1)');
    expect(categoryNames).toContain('Proof of Work (PoW)');
    expect(categoryNames).toContain('Bitcoin Ecosystem');

    // Should NOT show index fund categories
    expect(categoryNames).not.toContain('FTX Holdings');
    expect(categoryNames).not.toContain('GMCI 30 Index');
    expect(categoryNames).not.toContain('GMCI Index');
    expect(categoryNames).not.toContain('Coinbase 50 Index');
  });

  test('should navigate to settings page', async () => {
    // Click Settings link in navigation
    const settingsLink = portfolioPage.page.getByRole('link', {
      name: 'Settings',
    });
    await settingsLink.click();

    // Should navigate to settings page
    await expect(portfolioPage.page).toHaveURL('/settings');

    // Should show settings page content
    await expect(
      portfolioPage.page.getByRole('heading', { name: 'Settings', level: 1 })
    ).toBeVisible();
    await expect(
      portfolioPage.page.getByText('Customize your portfolio experience')
    ).toBeVisible();
  });

  test('should show category settings on settings page', async () => {
    // Navigate to settings page
    await portfolioPage.page.goto('/settings');

    // Should show category settings
    await expect(
      portfolioPage.page.getByRole('heading', {
        name: 'Category Display',
        exact: true,
      })
    ).toBeVisible();
    await expect(
      portfolioPage.page.getByText(
        'Choose how categories are displayed in portfolio composition'
      )
    ).toBeVisible();

    // Should have radio buttons
    await expect(
      portfolioPage.page.locator('#filtered-categories')
    ).toBeVisible();
    await expect(portfolioPage.page.locator('#all-categories')).toBeVisible();

    // Should have information section
    await expect(
      portfolioPage.page.getByText('Core Categories:')
    ).toBeVisible();
    await expect(
      portfolioPage.page.getByText('Index Categories:')
    ).toBeVisible();
  });

  test('should default to core categories in settings', async () => {
    // Clear localStorage and navigate to settings
    await portfolioPage.page.evaluate(() => localStorage.clear());
    await portfolioPage.page.goto('/settings');

    // Should have "Core Categories Only" selected by default
    const coreCategoriesRadio = portfolioPage.page.locator(
      '#filtered-categories'
    );
    const allCategoriesRadio = portfolioPage.page.locator('#all-categories');

    await expect(coreCategoriesRadio).toBeChecked();
    await expect(allCategoriesRadio).not.toBeChecked();
  });

  test('should allow switching to all categories', async () => {
    // Navigate to settings page
    await portfolioPage.page.goto('/settings');

    // Switch to "All Categories"
    const allCategoriesRadio = portfolioPage.page.locator('#all-categories');
    await allCategoriesRadio.check();

    // Should be selected
    await expect(allCategoriesRadio).toBeChecked();
    await expect(
      portfolioPage.page.locator('#filtered-categories')
    ).not.toBeChecked();
  });

  test('should save preference and apply it in portfolio', async ({ page }) => {
    // Set up mocks for this test
    await page.route('**/api/coingecko/coins/list*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' }],
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
              'Coinbase 50 Index',
            ],
            market_cap_rank: 1,
            market_data: { current_price: { usd: 50000 } },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Start on settings page and set preference first
    await page.goto('/settings');
    await page.locator('#all-categories').check();
    await page.waitForTimeout(500);

    // Verify the setting is saved
    const savedSettings = await page.evaluate(() => {
      return localStorage.getItem('crypture_user_settings');
    });
    expect(savedSettings).toBe('{"showAllCategories":true}');

    // Now go to portfolio and add Bitcoin
    await page.goto('/portfolio');
    await page.waitForTimeout(500);

    // Add Bitcoin to portfolio (direct implementation to avoid fixture localStorage clearing)
    const addAssetButton = page.getByTestId('add-asset-button');
    await addAssetButton.click();

    // Wait for dialog to appear
    await page
      .getByRole('dialog', { name: /add crypto asset/i })
      .waitFor({ state: 'visible' });

    // Select Bitcoin using custom dropdown
    await page.getByTestId('asset-select').click();
    const btcOption = page
      .locator('[role="option"]')
      .filter({ hasText: /Bitcoin \(BTC\)/i })
      .first();
    await btcOption.waitFor({ state: 'visible', timeout: 5000 });
    await btcOption.click();

    // Fill quantity
    await page.getByLabel(/quantity/i).fill('1');

    // Confirm
    await page.getByTestId('confirm-add-asset').click();

    // Wait for asset to be added
    await page.waitForTimeout(1000);

    // Switch to category view
    const viewSelector = page.getByTestId('allocation-view-selector');
    const categoryTab = viewSelector.getByRole('tab', { name: /category/i });
    await categoryTab.click();
    await page.waitForTimeout(1000);

    const legend = page.getByTestId('allocation-legend');
    const categoryItems = await legend
      .locator('[data-testid="allocation-legend-item"]')
      .all();

    // Should show all 8 categories when preference is set to "All Categories"
    expect(categoryItems.length).toBe(8);

    const categoryNames = await Promise.all(
      categoryItems.map(async (item) => {
        const text = await item.textContent();
        // Remove percentage and dollar amount, keep just the category name
        return text
          ?.replace(/\d+(?:\.\d+)?%/, '')
          .replace(/\$[\d,]+(?:\.\d+)?/, '')
          .trim();
      })
    );

    // Should include both core and index fund categories
    expect(categoryNames).toContain('Smart Contract Platform');
    expect(categoryNames).toContain('Layer 1 (L1)');
    expect(categoryNames).toContain('Proof of Work (PoW)');
    expect(categoryNames).toContain('Bitcoin Ecosystem');
    expect(categoryNames).toContain('FTX Holdings');
    expect(categoryNames).toContain('GMCI 30 Index');
    expect(categoryNames).toContain('GMCI Index');
    expect(categoryNames).toContain('Coinbase 50 Index');
  });

  test('should persist preference across page reloads', async () => {
    // Navigate to settings and enable all categories
    await portfolioPage.page.goto('/settings');
    await portfolioPage.page.locator('#all-categories').check();

    // Reload the page
    await portfolioPage.page.reload();

    // Should still have "All Categories" selected
    await expect(portfolioPage.page.locator('#all-categories')).toBeChecked();
    await expect(
      portfolioPage.page.locator('#filtered-categories')
    ).not.toBeChecked();
  });

  test('should allow switching back to filtered categories', async () => {
    // Start with "All Categories" preference
    await portfolioPage.page.goto('/settings');
    await portfolioPage.page.locator('#all-categories').check();

    // Switch back to "Core Categories Only"
    const coreCategoriesRadio = portfolioPage.page.locator(
      '#filtered-categories'
    );
    await coreCategoriesRadio.check();

    // Should be selected
    await expect(coreCategoriesRadio).toBeChecked();
    await expect(
      portfolioPage.page.locator('#all-categories')
    ).not.toBeChecked();

    // Go to portfolio and verify filtered categories
    await portfolioPage.page.goto('/portfolio');
    await portfolioPage.addAsset('BTC', 1);

    const viewSelector = portfolioPage.page.getByTestId(
      'allocation-view-selector'
    );
    const categoryTab = viewSelector.getByRole('tab', { name: /category/i });
    await categoryTab.click();

    await portfolioPage.page.waitForTimeout(500);

    const legend = portfolioPage.page.getByTestId('allocation-legend');
    const categoryItems = await legend
      .locator('[data-testid="allocation-legend-item"]')
      .all();

    // Should show 4 filtered categories again
    expect(categoryItems.length).toBe(4);
  });

  test('should work with multiple coins in portfolio', async () => {
    // Enable all categories in settings
    await portfolioPage.page.goto('/settings');
    await portfolioPage.page.locator('#all-categories').check();

    // Go to portfolio and add multiple coins
    await portfolioPage.page.goto('/portfolio');
    await portfolioPage.addAsset('BTC', 1);
    await portfolioPage.addAsset('ETH', 2);

    // Switch to category view
    const viewSelector = portfolioPage.page.getByTestId(
      'allocation-view-selector'
    );
    const categoryTab = viewSelector.getByRole('tab', { name: /category/i });
    await categoryTab.click();

    await portfolioPage.page.waitForTimeout(500);

    const legend = portfolioPage.page.getByTestId('allocation-legend');
    const categoryItems = await legend
      .locator('[data-testid="allocation-legend-item"]')
      .all();

    // Should show categories from both coins
    expect(categoryItems.length).toBeGreaterThan(4);

    const categoryNames = await Promise.all(
      categoryItems.map(async (item) => {
        const text = await item.textContent();
        // Remove percentage and dollar amount, keep just the category name
        return text
          ?.replace(/\d+(?:\.\d+)?%/, '')
          .replace(/\$[\d,]+(?:\.\d+)?/, '')
          .trim();
      })
    );

    // Should have categories from both Bitcoin and Ethereum
    expect(categoryNames).toContain('Smart Contract Platform'); // Both coins
    expect(categoryNames).toContain('Layer 1 (L1)'); // Both coins
    expect(categoryNames).toContain('Proof of Work (PoW)'); // Bitcoin
    expect(categoryNames).toContain('Bitcoin Ecosystem'); // Bitcoin
    expect(categoryNames).toContain('Ethereum Ecosystem'); // Ethereum
    expect(categoryNames).toContain('Proof of Stake (PoS)'); // Ethereum

    // Should include index fund categories from both coins
    expect(categoryNames).toContain('FTX Holdings'); // Both coins
    expect(categoryNames).toContain('GMCI Index'); // Both coins
    expect(categoryNames).toContain('Coinbase 50 Index'); // Both coins
  });
});
