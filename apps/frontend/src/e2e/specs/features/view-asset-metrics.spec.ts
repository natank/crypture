import { test, expect } from '../../fixtures';
import {
  mockCoinGeckoMarkets,
  mockCoinGeckoHistory,
} from '../../mocks/coinGecko';

test.describe('Asset Metrics Feature (REQ-023)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API calls before each test
    await mockCoinGeckoMarkets(page);
    await mockCoinGeckoHistory(page);
  });

  test('should display asset metrics panel when asset row is expanded', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add an asset to the portfolio
    await addAssetModal.openAndAdd('BTC', 1.5);
    await expect(portfolioPage.assetRow('btc')).toBeVisible();

    // 2. Verify expanded container is initially hidden
    await expect(portfolioPage.isExpandedContainerVisible('btc')).resolves.toBe(
      false
    );

    // 3. Click the asset row to expand
    await portfolioPage.toggleChart('btc');

    // 4. Verify expanded container is now visible
    await expect(portfolioPage.isExpandedContainerVisible('btc')).resolves.toBe(
      true
    );

    // 5. Verify metrics panel is visible (wait for it to appear)
    const metricsPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // 6. Verify chart is also visible (both should be shown)
    await expect(portfolioPage.chartContainerBySymbol('btc')).toBeVisible();
  });

  test('should display ATH/ATL information in metrics panel', async ({
    portfolioPage,
    addAssetModal,
    page,
  }) => {
    // 1. Add an asset and expand it
    await addAssetModal.openAndAdd('BTC', 1.5);
    await portfolioPage.toggleChart('btc');

    // 2. Wait for metrics panel to be visible and loaded (not showing loading state)
    const metricsPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // Wait for Price Extremes section to appear (indicates data has loaded)
    await expect(metricsPanel.getByText('Price Extremes')).toBeVisible({
      timeout: 10000,
    });

    // 3. Verify ATH section is present
    await expect(metricsPanel.getByText('ATH:')).toBeVisible();

    // 4. Verify ATL section is present
    await expect(metricsPanel.getByText('ATL:')).toBeVisible();
  });

  test('should display market position metrics', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add an asset and expand it
    await addAssetModal.openAndAdd('BTC', 1.5);
    await portfolioPage.toggleChart('btc');

    // 2. Wait for metrics panel to be visible
    const metricsPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // 3. Verify market position section
    await expect(metricsPanel.getByText('Market Position')).toBeVisible({
      timeout: 10000,
    });
    await expect(metricsPanel.getByText('Rank')).toBeVisible();
    await expect(metricsPanel.getByText('Market Cap')).toBeVisible();
    await expect(metricsPanel.getByText('24h Volume')).toBeVisible();
  });

  test('should display supply information', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add Bitcoin (has max supply) and expand it
    await addAssetModal.openAndAdd('BTC', 1.5);
    await portfolioPage.toggleChart('btc');

    // 2. Wait for metrics panel to be visible
    const metricsPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // 3. Verify supply section
    await expect(metricsPanel.getByText('Supply Info')).toBeVisible({
      timeout: 10000,
    });
    await expect(metricsPanel.getByText('Circulating')).toBeVisible();
    await expect(metricsPanel.getByText('Max Supply')).toBeVisible();
  });

  test('should display supply section for ETH', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add Ethereum and expand it
    await addAssetModal.openAndAdd('ETH', 2.0);
    await portfolioPage.toggleChart('eth');

    // 2. Wait for metrics panel to be visible
    const metricsPanel = portfolioPage.metricsPanelBySymbol('eth');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // 3. Wait for supply section to load
    await expect(metricsPanel.getByText('Supply Info')).toBeVisible({
      timeout: 10000,
    });
    await expect(metricsPanel.getByText('Circulating')).toBeVisible();
    await expect(metricsPanel.getByText('Max Supply')).toBeVisible();
  });

  test('should hide metrics panel when asset row is collapsed', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add an asset and expand it
    await addAssetModal.openAndAdd('BTC', 1.5);
    await portfolioPage.toggleChart('btc');

    // Wait for metrics panel to be visible first
    const metricsPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(metricsPanel).toBeVisible({ timeout: 10000 });

    // 2. Click the asset row again to collapse
    await portfolioPage.toggleChart('btc');

    // 3. Verify metrics panel is hidden
    await expect(portfolioPage.isMetricsPanelVisible('btc')).resolves.toBe(
      false
    );
    await expect(portfolioPage.isChartVisible('btc')).resolves.toBe(false);
  });

  test('should display metrics for multiple expanded assets', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // 1. Add two assets
    await addAssetModal.openAndAdd('BTC', 1.5);
    await addAssetModal.openAndAdd('ETH', 2.0);

    // 2. Expand both assets
    await portfolioPage.toggleChart('btc');
    await portfolioPage.toggleChart('eth');

    // 3. Wait for both metrics panels to be visible
    const btcMetrics = portfolioPage.metricsPanelBySymbol('btc');
    const ethMetrics = portfolioPage.metricsPanelBySymbol('eth');
    await expect(btcMetrics).toBeVisible({ timeout: 10000 });
    await expect(ethMetrics).toBeVisible({ timeout: 10000 });

    // 4. Verify both panels have loaded their data
    const btcPanel = portfolioPage.metricsPanelBySymbol('btc');
    const ethPanel = portfolioPage.metricsPanelBySymbol('eth');

    await expect(btcPanel.getByText('Price Extremes')).toBeVisible({
      timeout: 10000,
    });
    await expect(ethPanel.getByText('Price Extremes')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should display distinct ATH values for different coins (regression: duplicate ATH data)', async ({
    portfolioPage,
    addAssetModal,
  }) => {
    // Regression test for bug where all assets showed the same ATH data
    // (Bitcoin's ATH) because the backend did not forward the `ids` query
    // parameter to the CoinGecko API.

    // 1. Add two different assets
    await addAssetModal.openAndAdd('BTC', 1.0);
    await addAssetModal.openAndAdd('ETH', 2.0);

    // 2. Expand BTC and wait for its metrics to load
    await portfolioPage.toggleChart('btc');
    const btcPanel = portfolioPage.metricsPanelBySymbol('btc');
    await expect(btcPanel.getByText('Price Extremes')).toBeVisible({
      timeout: 10000,
    });

    // 3. Read BTC ATH value — mock data has BTC ATH = $69,000.00
    const btcAthText = await btcPanel
      .locator('[class*="font-medium"]')
      .filter({ hasText: /^\$/ })
      .first()
      .textContent();

    // 4. Expand ETH and wait for its metrics to load
    await portfolioPage.toggleChart('eth');
    const ethPanel = portfolioPage.metricsPanelBySymbol('eth');
    await expect(ethPanel.getByText('Price Extremes')).toBeVisible({
      timeout: 10000,
    });

    // 5. Read ETH ATH value — mock data has ETH ATH = $4,878.00
    const ethAthText = await ethPanel
      .locator('[class*="font-medium"]')
      .filter({ hasText: /^\$/ })
      .first()
      .textContent();

    // 6. The ATH values MUST be different for different coins
    expect(btcAthText).not.toEqual(ethAthText);

    // 7. Verify the actual expected values from mock data
    expect(btcAthText).toContain('69,000');
    expect(ethAthText).toContain('4,878');
  });
});
