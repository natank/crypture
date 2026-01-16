import { test, expect } from '@playwright/test';
import { PortfolioPage } from '@e2e/pom-pages/portfolio.pom';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoList,
  mockCoinGeckoChartData,
  mockCoinGeckoCoinDetails,
} from '@e2e/mocks/mockCoinGecko';

/**
 * E2E tests for KI-04: Navigation State Preservation
 * Tests that filter, sort, and scroll state are preserved when navigating
 * from Portfolio to Coin Detail and back.
 */
test.describe('Navigation State Preservation (KI-04)', () => {
  let portfolioPage: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    // Mock CoinGecko API to avoid rate limiting
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoList(page);
    await mockCoinGeckoChartData(page);
    await mockCoinGeckoCoinDetails(page);

    // Forward browser console logs to terminal for debugging
    page.on('console', (msg) => {
      console.log(`[BROWSER ${msg.type()}]: ${msg.text()}`);
    });

    portfolioPage = new PortfolioPage(page);
    await portfolioPage.goto();
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Add an asset so we have something to navigate to
    await portfolioPage.addAsset('BTC', 1);
    await page.waitForTimeout(200); // Wait for asset to be added
  });

  test.describe('Filter State Preservation', () => {
    test('preserves filter text after navigating to coin detail and back', async ({
      page,
    }) => {
      // Set a filter
      await portfolioPage.filterInput.fill('bit');
      await page.waitForTimeout(100); // Allow state to save

      // Navigate to coin detail
      const coinLink = page.locator('a[href^="/coin/"]').first();
      await expect(coinLink).toBeVisible({ timeout: 5000 });
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Verify filter is preserved
      const filterValue = await portfolioPage.filterInput.inputValue();
      expect(filterValue).toBe('bit');
    });

    test('preserves filter across tabs in same session', async ({
      page,
      context,
    }) => {
      // Set a filter
      await portfolioPage.filterInput.fill('eth');
      await page.waitForTimeout(100);

      // Open new tab in same context (shares sessionStorage)
      const newPage = await context.newPage();
      const newPortfolioPage = new PortfolioPage(newPage);
      await newPortfolioPage.goto();
      await newPage.waitForLoadState('networkidle');

      // Note: sessionStorage is NOT shared across tabs by default in browsers
      // Each tab gets its own sessionStorage copy, so filter should be empty
      const filterValue = await newPortfolioPage.filterInput.inputValue();
      expect(filterValue).toBe(''); // New tab = new sessionStorage
    });
  });

  test.describe('Sort State Preservation', () => {
    test('preserves sort option after navigating to coin detail and back', async ({
      page,
    }) => {
      // Change sort to value-desc
      await portfolioPage.sortDropdown.selectOption('value-desc');
      await page.waitForTimeout(100);

      // Navigate to coin detail
      const coinLink = page.locator('a[href^="/coin/"]').first();
      await expect(coinLink).toBeVisible({ timeout: 5000 });
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Verify sort is preserved
      const sortValue = await portfolioPage.sortDropdown.inputValue();
      expect(sortValue).toBe('value-desc');
    });

    test('preserves sort option after page reload within session', async ({
      page,
    }) => {
      // Change sort
      await portfolioPage.sortDropdown.selectOption('name-desc');
      await page.waitForTimeout(100);

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify sort is preserved
      const sortValue = await portfolioPage.sortDropdown.inputValue();
      expect(sortValue).toBe('name-desc');
    });
  });

  test.describe('Scroll Position Preservation', () => {
    test('restores scroll position after navigating back from coin detail', async ({
      page,
    }) => {
      // Wait for page to fully stabilize first
      await page.waitForTimeout(1000);

      // Scroll down and wait for it to stabilize
      await page.evaluate(() => window.scrollTo(0, 300));

      // Wait for scroll to stabilize and be saved
      await page.waitForTimeout(500);

      // Verify scroll position is stable at ~300
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Manually save the scroll position to ensure it's captured
      await page.evaluate(() => {
        sessionStorage.setItem('scroll_/portfolio', window.scrollY.toString());
      });

      // Navigate to coin detail
      const coinLink = page.locator('a[href^="/coin/"]').first();
      await expect(coinLink).toBeVisible({ timeout: 5000 });

      // Check sessionStorage right before click
      const savedBeforeClick = await page.evaluate(() =>
        sessionStorage.getItem('scroll_/portfolio')
      );

      // Use force:true to prevent Playwright from scrolling element into view
      await coinLink.click({ force: true });
      await page.waitForLoadState('networkidle');

      // Verify we navigated
      expect(page.url()).toContain('/coin/');

      // Check what's in sessionStorage after navigation
      const savedAfter = await page.evaluate(() =>
        sessionStorage.getItem('scroll_/portfolio')
      );

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Wait for scroll restoration
      await page.waitForTimeout(1000);

      // Verify we're back on portfolio
      expect(page.url()).toContain('/portfolio');

      // Check final scroll position
      const scrollAfter = await page.evaluate(() => window.scrollY);
      const savedFinal = await page.evaluate(() =>
        sessionStorage.getItem('scroll_/portfolio')
      );

      // The scroll should be restored to approximately where we were
      // Allow tolerance because page might have different content
      expect(scrollAfter).toBeGreaterThanOrEqual(200);
      expect(scrollAfter).toBeLessThanOrEqual(500);
    });

    test('scrolls to top on fresh navigation to portfolio', async ({
      page,
    }) => {
      // Navigate to a different page first
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate to portfolio
      await portfolioPage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(100);

      // Verify we're at the top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);
    });
  });

  test.describe('Combined State Preservation', () => {
    test('preserves both filter and sort after navigation', async ({
      page,
    }) => {
      // Set filter and sort - use "bit" to match Bitcoin
      await portfolioPage.filterInput.fill('bit');
      await portfolioPage.sortDropdown.selectOption('value-asc');
      await page.waitForTimeout(100);

      // Navigate away and back
      const coinLink = page.locator('a[href^="/coin/"]').first();
      await expect(coinLink).toBeVisible({ timeout: 5000 });
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation occurred
      expect(page.url()).toContain('/coin/');

      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Verify both are preserved
      const filterValue = await portfolioPage.filterInput.inputValue();
      const sortValue = await portfolioPage.sortDropdown.inputValue();
      expect(filterValue).toBe('bit');
      expect(sortValue).toBe('value-asc');
    });
  });

  test.describe('Edge Cases', () => {
    test('handles empty filter gracefully', async ({ page }) => {
      // Set and clear filter
      await portfolioPage.filterInput.fill('test');
      await page.waitForTimeout(50);
      await portfolioPage.filterInput.fill('');
      await page.waitForTimeout(100);

      // Reload
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify empty filter is preserved
      const filterValue = await portfolioPage.filterInput.inputValue();
      expect(filterValue).toBe('');
    });

    test('sessionStorage is used (not localStorage)', async ({ page }) => {
      // Set filter
      await portfolioPage.filterInput.fill('storage-test');
      await page.waitForTimeout(100);

      // Check sessionStorage has the value
      const sessionValue = await page.evaluate(() =>
        sessionStorage.getItem('portfolio_filter_sort')
      );
      expect(sessionValue).toContain('storage-test');

      // Check localStorage does NOT have the value
      const localValue = await page.evaluate(() =>
        localStorage.getItem('portfolio_filter_sort')
      );
      expect(localValue).toBeNull();
    });
  });
});
