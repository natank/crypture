import { test, expect } from '@playwright/test';
import { PortfolioPage } from '../pom-pages/portfolio.pom';

test.describe('Portfolio Composition Visualizations', () => {
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
            { id: 'cardano', symbol: 'ada', name: 'Cardano' },
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
            cardano: { usd: 0.5 },
          },
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    // Mock market data with metadata for composition analysis
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
              categories: ['Layer 1', 'Store of Value'],
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
              categories: ['Layer 1', 'Smart Contracts'],
            },
            {
              id: 'cardano',
              symbol: 'ada',
              name: 'Cardano',
              image: 'https://example.com/ada.png',
              current_price: 0.5,
              market_cap: 17000000000,
              market_cap_rank: 8,
              price_change_percentage_24h: -1.5,
              price_change_percentage_7d: 2.0,
              categories: ['Layer 1', 'Smart Contracts'],
            },
          ],
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    });

    portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
  });

  test.describe('Empty State', () => {
    test('should show empty state when portfolio has no assets', async () => {
      const compositionSection = portfolioPage.page.getByTestId(
        'portfolio-composition-dashboard'
      );

      // Empty state should be visible
      await expect(
        compositionSection.getByTestId('composition-empty-state')
      ).toBeVisible();

      // Chart should not be visible
      await expect(
        compositionSection.getByTestId('allocation-pie-chart')
      ).not.toBeVisible();
    });
  });

  test.describe('Asset Allocation View', () => {
    test.beforeEach(async () => {
      // Add multiple assets to create a portfolio
      await portfolioPage.addAsset('BTC', 1);
      await portfolioPage.addAsset('ETH', 10);
    });

    test('should display portfolio allocation by asset', async () => {
      const compositionSection = portfolioPage.page.getByTestId(
        'portfolio-composition-dashboard'
      );

      // Composition section should be visible
      await expect(compositionSection).toBeVisible();

      // Chart should be visible
      const chart = compositionSection.getByTestId('allocation-pie-chart');
      await expect(chart).toBeVisible();

      // Legend should show all assets
      const legend = compositionSection.getByTestId('allocation-legend');
      await expect(legend).toBeVisible();
      await expect(legend.getByText(/bitcoin/i)).toBeVisible();
      await expect(legend.getByText(/ethereum/i)).toBeVisible();
    });

    test('should show correct allocation percentages', async () => {
      const compositionSection = portfolioPage.page.getByTestId(
        'portfolio-composition-dashboard'
      );
      const legend = compositionSection.getByTestId('allocation-legend');

      // BTC: 1 * 50000 = 50000
      // ETH: 10 * 3000 = 30000
      // Total: 80000
      // BTC %: 62.5%, ETH %: 37.5%

      await expect(legend.getByText(/62\.5%/)).toBeVisible(); // BTC
      await expect(legend.getByText(/37\.5%/)).toBeVisible(); // ETH
    });

    test.skip('should display tooltips on hover', async ({ page }) => {
      // Skipped: Chart animations make this test flaky
      // TODO: Add wait for animations to complete or disable animations in test mode
      const compositionSection = page.getByTestId(
        'portfolio-composition-dashboard'
      );
      const chart = compositionSection.getByTestId('allocation-pie-chart');

      // Hover over a pie slice (implementation will add data-testid to slices)
      const btcSlice = chart
        .locator('[data-testid="pie-slice-bitcoin"]')
        .first();
      await btcSlice.hover();

      // Tooltip should appear with detailed info
      const tooltip = page.getByTestId('allocation-tooltip');
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText('Bitcoin');
      await expect(tooltip).toContainText('$50,000');
    });
  });

  test.describe('View Selector', () => {
    test.beforeEach(async () => {
      await portfolioPage.addAsset('BTC', 1);
      await portfolioPage.addAsset('ETH', 10);
    });

    test('should have view selector with all options', async () => {
      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );

      await expect(viewSelector).toBeVisible();
      await expect(
        viewSelector.getByRole('tab', { name: /asset/i })
      ).toBeVisible();
      await expect(
        viewSelector.getByRole('tab', { name: /category/i })
      ).toBeVisible();
      await expect(
        viewSelector.getByRole('tab', { name: /market cap/i })
      ).toBeVisible();
      await expect(
        viewSelector.getByRole('tab', { name: /risk/i })
      ).toBeVisible();
    });

    test('should switch to category view', async () => {
      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );
      const categoryTab = viewSelector.getByRole('tab', { name: /category/i });

      await categoryTab.click();

      // Active tab should have primary background
      await expect(categoryTab).toHaveClass(/bg-brand-primary/);

      // Legend should show categories (with default metadata, this will be "Other")
      const legend = portfolioPage.page.getByTestId('allocation-legend');
      await expect(legend.getByText(/other/i)).toBeVisible();
    });

    test('should switch to market cap tier view', async () => {
      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );
      const marketCapTab = viewSelector.getByRole('tab', {
        name: /market cap/i,
      });

      await marketCapTab.click();

      // Legend should show market cap tiers
      const legend = portfolioPage.page.getByTestId('allocation-legend');
      await expect(legend.getByText(/large cap/i)).toBeVisible();
    });

    test('should switch to risk level view', async () => {
      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );
      const riskTab = viewSelector.getByRole('tab', { name: /risk/i });

      await riskTab.click();

      // Legend should show risk levels
      const legend = portfolioPage.page.getByTestId('allocation-legend');
      // Should have at least one risk level visible
      const hasConservative = await legend
        .getByText(/conservative/i)
        .isVisible()
        .catch(() => false);
      const hasModerate = await legend
        .getByText(/moderate/i)
        .isVisible()
        .catch(() => false);
      const hasAggressive = await legend
        .getByText(/aggressive/i)
        .isVisible()
        .catch(() => false);

      expect(hasConservative || hasModerate || hasAggressive).toBeTruthy();
    });

    test('should show diversified risk allocation, not 100% Conservative', async () => {
      // Add Cardano (small cap with volatility) to create mixed risk profile
      await portfolioPage.addAsset('ADA', 1000);

      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );
      const riskTab = viewSelector.getByRole('tab', { name: /risk/i });
      await riskTab.click();

      const legend = portfolioPage.page.getByTestId('allocation-legend');

      // Wait for the chart to render
      await portfolioPage.page.waitForTimeout(500);

      // Should show multiple risk categories, not just Conservative 100%
      const riskItems = await legend
        .locator('[data-testid="allocation-legend-item"]')
        .count();

      // With mixed portfolio (BTC + ETH + ADA), we expect multiple risk levels
      // BTC: Conservative (Large Cap, low volatility from mocks)
      // ETH: Moderate (Large Cap, moderate volatility)
      // ADA: Aggressive (Large Cap in mocks but with volatility - or if we fix mocks, it would vary)
      expect(riskItems).toBeGreaterThan(1);

      // Conservative should NOT be 100%
      const conservativeItem = legend
        .locator('[data-testid="allocation-legend-item"]')
        .filter({ hasText: /Conservative/ });
      const hasConservative = await conservativeItem
        .isVisible()
        .catch(() => false);

      if (hasConservative) {
        const conservativeText = await conservativeItem.textContent();
        // Extract percentage from text like "Conservative 62.5%"
        const percentMatch = conservativeText?.match(/(\d+(?:\.\d+)?)%/);
        if (percentMatch) {
          const percent = parseFloat(percentMatch[1]);
          // Conservative should be less than 100% with mixed portfolio
          expect(percent).toBeLessThan(100);
        }
      }
    });

    test('should show real categories, not just Other 100%', async () => {
      // Add Cardano which has different categories in mocks
      await portfolioPage.addAsset('ADA', 1000);

      const viewSelector = portfolioPage.page.getByTestId(
        'allocation-view-selector'
      );
      const categoryTab = viewSelector.getByRole('tab', { name: /category/i });
      await categoryTab.click();

      const legend = portfolioPage.page.getByTestId('allocation-legend');

      // Wait for the chart to render
      await portfolioPage.page.waitForTimeout(500);

      // Should show multiple categories, not just Other 100%
      const categoryItems = await legend
        .locator('[data-testid="allocation-legend-item"]')
        .count();

      // With BTC (Cryptocurrency), ETH (Smart Contract Platform), ADA (Layer 1, Smart Contract Platform)
      // we expect multiple distinct categories
      expect(categoryItems).toBeGreaterThan(1);

      // Check that categories are NOT all "Other"
      const otherItem = legend
        .locator('[data-testid="allocation-legend-item"]')
        .filter({ hasText: /Other/ });
      const hasOtherOnly = await otherItem
        .count()
        .then((c) => c === categoryItems);
      expect(hasOtherOnly).toBe(false);
    });
  });

  test.describe('Responsive Behavior', () => {
    test.beforeEach(async () => {
      await portfolioPage.addAsset('BTC', 1);
      await portfolioPage.addAsset('ETH', 10);
    });

    test('should adapt layout for mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const compositionSection = page.getByTestId(
        'portfolio-composition-dashboard'
      );

      // Chart and legend should be stacked vertically on mobile
      const container = compositionSection.locator('.composition-content');

      // Check that layout is vertical (flex-col)
      await expect(container).toHaveClass(/flex-col/);
    });

    test('should adapt layout for desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      const compositionSection = page.getByTestId(
        'portfolio-composition-dashboard'
      );

      // Chart and legend should be side-by-side on desktop
      const container = compositionSection.locator('.composition-content');

      // Check that layout is horizontal on larger screens
      await expect(container).toHaveClass(/lg:flex-row/);
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async () => {
      await portfolioPage.addAsset('BTC', 1);
    });

    test('should have proper ARIA labels', async () => {
      const chart = portfolioPage.page.getByTestId('allocation-pie-chart');

      // Chart should have role="img" and aria-label
      await expect(chart).toHaveAttribute('role', 'img');
      await expect(chart).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation for view selector', async ({
      page,
    }) => {
      const viewSelector = page.getByTestId('allocation-view-selector');
      const firstTab = viewSelector.getByRole('tab').first();

      // Focus first tab
      await firstTab.focus();

      // Should have visible focus indicator
      await expect(firstTab).toBeFocused();

      // Tab to next tab
      await page.keyboard.press('Tab');
      const secondTab = viewSelector.getByRole('tab').nth(1);
      await expect(secondTab).toBeFocused();
    });

    test('should provide screen reader accessible data table', async () => {
      // There should be a visually hidden table for screen readers
      const srTable = portfolioPage.page.locator('table.sr-only');
      await expect(srTable).toBeAttached(); // Should be in DOM but visually hidden

      // Table should have caption
      await expect(srTable.locator('caption')).toContainText(/allocation/i);
    });
  });
});
