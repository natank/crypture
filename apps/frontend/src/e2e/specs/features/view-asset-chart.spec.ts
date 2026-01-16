import { test, expect } from '../../fixtures';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoHistory,
} from '../../mocks/coinGecko';

test.describe('Asset Chart Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls before each test
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoHistory(page);
  });

  test('should display and interact with the price chart', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add an asset to the portfolio
    await addAssetModal.openAndAdd('BTC', 1.5);
    await expect(portfolioPage.assetRow('btc')).toBeVisible();

    // 2. Verify chart is initially hidden
    await expect(portfolioPage.isChartVisible('btc')).resolves.toBe(false);

    // 3. Click the asset row to show the chart
    await portfolioPage.toggleChart('btc');
    await expect(portfolioPage.isChartVisible('btc')).resolves.toBe(true);

    // 4. Verify the chart component is rendered inside the container
    const chart = portfolioPage
      .chartContainerBySymbol('btc')
      .locator('[data-testid="asset-chart"]');
    await expect(chart).toBeVisible();

    // 5. Change the time range to 7 days and verify
    await portfolioPage.selectTimeRange('btc', 7);
    // We can't easily verify the chart content, but we can check if the button is selected
    const sevenDayButton = portfolioPage.timeRangeButtonByDays('btc', 7);
    await expect(sevenDayButton).toHaveClass(/bg-brand-primary/);

    // 6. Change the time range to 1 year (365 days)
    await portfolioPage.selectTimeRange('btc', 365);
    const oneYearButton = portfolioPage.timeRangeButtonByDays('btc', 365);
    await expect(oneYearButton).toHaveClass(/bg-brand-primary/);

    // 7. Click the asset row again to hide the chart
    await portfolioPage.toggleChart('btc');
    await expect(portfolioPage.isChartVisible('btc')).resolves.toBe(false);
  });
});
