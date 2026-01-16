import { test, expect } from '../../fixtures';
import { mockCoinGeckoHistory } from '../../mocks/coinGecko';

/**
 * E2E tests for Asset Row Expansion State Preservation
 * Follow-up to KI-04: Tests that asset row expansion state is preserved
 * when navigating from Portfolio to Coin Detail and back.
 */
test.describe('Asset Row Expansion State Preservation', () => {
  test.beforeEach(async ({ page }) => {
    // Forward browser console logs to terminal for debugging
    page.on('console', (msg) => {
      console.log(`[BROWSER ${msg.type()}]: ${msg.text()}`);
    });

    // Mock history API for chart data
    await mockCoinGeckoHistory(page);
  });

  test.describe('Single Asset Expansion', () => {
    test('preserves single expanded asset on navigation', async ({
      page,
      portfolioPage,
      addAssetModal,
    }) => {
      // Add assets for testing
      await addAssetModal.openAndAdd('BTC', 1);
      await page.waitForTimeout(500);

      // Ensure modal is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Find and expand BTC row
      const btcRow = portfolioPage.assetRow('btc');
      await expect(btcRow).toBeVisible({ timeout: 5000 });

      // Verify chart is not visible initially
      const chartContainer = portfolioPage.expandedContainerBySymbol('btc');
      await expect(chartContainer).not.toBeVisible();

      // Click to expand - click on the row itself, not any buttons
      await btcRow.click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500); // Wait for expansion animation and state save

      // Verify chart is now visible
      await expect(chartContainer).toBeVisible({ timeout: 5000 });

      // Verify expansion state saved to sessionStorage
      const savedState = await page.evaluate(() =>
        sessionStorage.getItem('portfolio_expansion_state')
      );
      console.log('Saved expansion state:', savedState);
      expect(savedState).toContain('bitcoin');

      // Navigate to coin detail (use the detail link, not the row itself)
      const coinLink = btcRow.locator('a[href^="/coin/"]');
      await expect(coinLink).toBeVisible({ timeout: 5000 });
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Verify we navigated
      expect(page.url()).toContain('/coin/');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300); // Wait for restoration

      // Verify BTC row is still expanded
      await expect(chartContainer).toBeVisible({ timeout: 3000 });
    });

    test('collapsed asset remains collapsed after navigation', async ({
      page,
      portfolioPage,
      addAssetModal,
    }) => {
      // Add two assets
      await addAssetModal.openAndAdd('BTC', 1);
      await page.waitForTimeout(200);
      await addAssetModal.openAndAdd('ETH', 10);
      await page.waitForTimeout(500);

      // Ensure modal is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Verify ETH is collapsed initially
      await expect(
        portfolioPage.expandedContainerBySymbol('eth')
      ).not.toBeVisible();

      // Navigate to BTC detail without expanding ETH
      const btcRow = portfolioPage.assetRow('btc');
      const coinLink = btcRow.locator('a[href^="/coin/"]');
      await expect(coinLink).toBeVisible({ timeout: 5000 });
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);

      // Verify ETH is still collapsed
      await expect(
        portfolioPage.expandedContainerBySymbol('eth')
      ).not.toBeVisible();
    });
  });

  test.describe('Multiple Asset Expansion', () => {
    test('preserves multiple expanded assets', async ({
      page,
      portfolioPage,
      addAssetModal,
    }) => {
      // Add two assets (simpler to avoid modal timing issues)
      await addAssetModal.openAndAdd('BTC', 1);
      await page.waitForTimeout(500);
      await addAssetModal.openAndAdd('ETH', 10);
      await page.waitForTimeout(1000);

      // Ensure modal is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({
        timeout: 5000,
      });

      // Expand both - click on rows directly
      await portfolioPage.assetRow('btc').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(200);
      await portfolioPage.assetRow('eth').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);

      // Verify both expanded
      await expect(
        portfolioPage.expandedContainerBySymbol('btc')
      ).toBeVisible();
      await expect(
        portfolioPage.expandedContainerBySymbol('eth')
      ).toBeVisible();

      // Navigate to coin detail
      const btcRow = portfolioPage.assetRow('btc');
      const coinLink = btcRow.locator('a[href^="/coin/"]');
      await coinLink.click();
      await page.waitForLoadState('networkidle');

      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);

      // Verify both still expanded
      await expect(portfolioPage.expandedContainerBySymbol('btc')).toBeVisible({
        timeout: 3000,
      });
      await expect(portfolioPage.expandedContainerBySymbol('eth')).toBeVisible({
        timeout: 3000,
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('sessionStorage is used (not localStorage)', async ({
      page,
      portfolioPage,
      addAssetModal,
    }) => {
      // Add and expand BTC
      await addAssetModal.openAndAdd('BTC', 1);
      await page.waitForTimeout(500);

      // Ensure modal is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      await portfolioPage.assetRow('btc').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);

      // Check sessionStorage has the value
      const sessionValue = await page.evaluate(() =>
        sessionStorage.getItem('portfolio_expansion_state')
      );
      expect(sessionValue).toBeTruthy();
      expect(sessionValue).toContain('bitcoin');

      // Check localStorage does NOT have the value
      const localValue = await page.evaluate(() =>
        localStorage.getItem('portfolio_expansion_state')
      );
      expect(localValue).toBeNull();
    });
  });
});
