import { test, expect } from "@e2e/test-setup";
import { mockCoinGeckoMarkets, mockCoinGeckoChartData, mockCoinGeckoCoinDetails, mockCoinGeckoTrending, mockCoinGeckoGlobal, mockCoinGeckoCategories } from "@e2e/mocks/mockCoinGecko";

/**
 * E2E Tests for Backlog Item 28 - Educational Tooltips & Contextual Help
 * REQ-014-research
 * 
 * Tests tooltip functionality:
 * - Tooltips appear on hover/focus
 * - Tooltip content is correct
 * - Keyboard navigation works
 * - Tooltips work across different pages
 */

test.describe("Educational Tooltips", () => {
  test.beforeEach(async ({ page }) => {
    mockCoinGeckoMarkets(page);
    mockCoinGeckoChartData(page);
    mockCoinGeckoCoinDetails(page);
    mockCoinGeckoTrending(page);
    mockCoinGeckoGlobal(page);
    mockCoinGeckoCategories(page);
  });

  test.describe("Coin Detail Page - CoinMetrics", () => {
    test("shows tooltip on hover for Market Cap", async ({ page }) => {
      await page.goto("/coin/bitcoin");

      // Wait for metrics to load
      await page.waitForSelector('[data-testid="coin-metrics"]', { timeout: 5000 });

      // Find Market Cap label with help icon
      const marketCapLabel = page.locator('dt:has-text("Market Cap")');
      await expect(marketCapLabel).toBeVisible();

      // Find help icon near Market Cap
      const helpIcon = marketCapLabel.locator('..').getByRole("button", { name: /learn more about market_cap/i });
      await expect(helpIcon).toBeVisible();

      // Hover over help icon
      await helpIcon.hover();

      // Verify tooltip appears with correct content
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("Market Cap");
      await expect(tooltip).toContainText(/total value of all coins/i);
    });

    test("shows tooltip on focus for Volume", async ({ page }) => {
      await page.goto("/coin/bitcoin");

      await page.waitForSelector('[data-testid="coin-metrics"]', { timeout: 5000 });

      // Find 24h Volume label
      const volumeLabel = page.locator('dt:has-text("24h Volume")');
      await expect(volumeLabel).toBeVisible();

      // Find help icon and focus it
      const helpIcon = volumeLabel.locator('..').getByRole("button", { name: /learn more about volume/i });
      await helpIcon.focus();

      // Verify tooltip appears
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("24h Volume");
    });

    test("dismisses tooltip on ESC key", async ({ page }) => {
      await page.goto("/coin/bitcoin");

      await page.waitForSelector('[data-testid="coin-metrics"]', { timeout: 5000 });

      const marketCapLabel = page.locator('dt:has-text("Market Cap")');
      const helpIcon = marketCapLabel.locator('..').getByRole("button", { name: /learn more about market_cap/i });
      
      await helpIcon.focus();
      
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible();

      // Press ESC
      await page.keyboard.press("Escape");

      // Verify tooltip is dismissed
      await expect(tooltip).not.toBeVisible({ timeout: 1000 });
    });
  });

  test.describe("Comparison Page - ComparisonTable", () => {
    test("shows tooltip for Market Cap in comparison table", async ({ page }) => {
      await page.goto("/compare?coin=bitcoin");

      // Wait for the page to load and coin to be added
      await page.waitForSelector('[data-testid="comparison-table"], [data-testid="comparison-empty"]', { timeout: 5000 });

      // If empty state, manually add a coin
      const isEmpty = await page.locator('[data-testid="comparison-empty"]').isVisible().catch(() => false);
      if (isEmpty) {
        // Use coin selector to add Bitcoin
        const coinSelector = page.locator('[data-testid="coin-selector-search"]');
        await coinSelector.fill("bitcoin");
        await page.getByRole("button", { name: /bitcoin/i }).first().click();
      }

      // Wait for comparison table to appear
      await page.waitForSelector('[data-testid="comparison-table"]', { timeout: 10000 });

      // Find Market Cap help icon in the comparison table
      const comparisonTable = page.locator('[data-testid="comparison-table"]');
      const marketCapHelpIcon = comparisonTable.getByRole("button", { name: /learn more about market_cap/i }).first();
      await expect(marketCapHelpIcon).toBeVisible();

      // Hover over help icon
      await marketCapHelpIcon.hover();

      // Verify tooltip appears
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("Market Cap");
    });
  });

  test.describe("Portfolio Page - AssetMetricsPanel", () => {
    test("shows tooltip for metrics in expanded asset row", async ({ page }) => {
      await page.goto("/portfolio");

      // Add an asset first
      await page.getByRole("button", { name: /add asset/i }).click();
      await page.locator("select#asset-select").selectOption({ label: "Bitcoin (BTC)" });
      await page.getByLabel(/quantity/i).fill("1");
      await page.getByRole("dialog").getByRole("button", { name: /add asset/i }).click();

      // Wait for asset to appear
      await page.waitForSelector('[data-testid^="asset-row-"]', { timeout: 5000 });

      // Expand asset row to show metrics (the entire row is clickable)
      const assetRow = page.locator('[data-testid^="asset-row-"]').first();
      await expect(assetRow).toBeVisible();
      await assetRow.click();

      // Wait for expanded container to appear
      await page.waitForSelector('[data-testid^="asset-expanded-container-"]', { timeout: 5000 });

      // Wait for metrics panel to load (it may show loading state first)
      await page.waitForSelector('[data-testid="asset-metrics-panel"], [data-testid="asset-metrics-loading"]', { timeout: 10000 });
      
      // If loading, wait for actual panel
      const isLoading = await page.locator('[data-testid="asset-metrics-loading"]').isVisible().catch(() => false);
      if (isLoading) {
        await page.waitForSelector('[data-testid="asset-metrics-panel"]', { timeout: 10000 });
      }

      // Find Market Cap help icon in the metrics panel
      const metricsPanel = page.locator('[data-testid="asset-metrics-panel"]');
      const marketCapHelpIcon = metricsPanel.getByRole("button", { name: /learn more about market_cap/i }).first();
      await expect(marketCapHelpIcon).toBeVisible();

      // Hover over help icon
      await marketCapHelpIcon.hover();

      // Verify tooltip appears
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("Market Cap");
    });
  });

  test.describe("Market Overview Page", () => {
    test("shows tooltip for Market Cap metric card", async ({ page }) => {
      await page.goto("/market");

      // Wait for market metrics to load
      await page.waitForSelector('[data-testid="metric-total-market-cap"]', { timeout: 5000 });

      // Find Market Cap card
      const marketCapCard = page.getByTestId("metric-total-market-cap");
      await expect(marketCapCard).toBeVisible();

      // Find help icon in the card label
      const helpIcon = marketCapCard.getByRole("button", { name: /learn more about market_cap/i });
      await expect(helpIcon).toBeVisible();

      // Hover over help icon
      await helpIcon.hover();

      // Verify tooltip appears
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("Market Cap");
    });

    test("shows tooltip for Volume metric card", async ({ page }) => {
      await page.goto("/market");

      await page.waitForSelector('[data-testid="metric-total-volume"]', { timeout: 5000 });

      const volumeCard = page.getByTestId("metric-total-volume");
      const helpIcon = volumeCard.getByRole("button", { name: /learn more about volume/i });
      
      await helpIcon.hover();

      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("24h Volume");
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("navigates to tooltip with keyboard", async ({ page }) => {
      await page.goto("/coin/bitcoin");

      await page.waitForSelector('[data-testid="coin-metrics"]', { timeout: 5000 });

      // Find and focus the first help icon directly
      const marketCapLabel = page.locator('dt:has-text("Market Cap")');
      const helpIcon = marketCapLabel.locator('..').getByRole("button", { name: /learn more about market_cap/i });
      await expect(helpIcon).toBeVisible();
      
      // Focus the help icon
      await helpIcon.focus();

      // Verify tooltip appears on focus
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText("Market Cap");
    });
  });
});
