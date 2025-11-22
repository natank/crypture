import { test, expect } from "@playwright/test";
import { MarketPage } from "../../pom-pages/market-page.pom";

test.describe("Market Overview Dashboard", () => {
    let marketPage: MarketPage;

    const mockGlobalData = {
        data: {
            total_market_cap: { usd: 2500000000000 },
            total_volume: { usd: 120000000000 },
            market_cap_percentage: { btc: 45.234, eth: 18.756 },
            market_cap_change_percentage_24h_usd: 2.34,
            active_cryptocurrencies: 12345,
            markets: 45678,
            updated_at: 1625097600,
        },
    };

    test.beforeEach(async ({ page }) => {
        marketPage = new MarketPage(page);

        // Mock the API response
        // Use wildcard at the end to match query parameters (api key)
        await page.route("**/api/v3/global*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockGlobalData),
            });
        });
    });

    test("T1.2 & T1.3: Navigate to market page and display metrics", async ({ page }) => {
        await test.step("Navigate to market page", async () => {
            await marketPage.goto();
            await expect(marketPage.header).toBeVisible();
        });

        await test.step("Verify all metrics are displayed", async () => {
            await expect(marketPage.totalMarketCap).toBeVisible();
            await expect(marketPage.totalVolume).toBeVisible();
            await expect(marketPage.btcDominance).toBeVisible();
            await expect(marketPage.ethDominance).toBeVisible();
            await expect(marketPage.activeCryptos).toBeVisible();
            await expect(marketPage.activeMarkets).toBeVisible();
        });

        await test.step("Verify metric values are formatted correctly", async () => {
            // These assertions depend on the exact formatting logic which we'll implement
            // For now, we check they contain the expected numbers/units
            const marketCap = await marketPage.getMetricValue(marketPage.totalMarketCap);
            expect(marketCap).toContain("$2.50T"); // $2.5T

            const btcDom = await marketPage.getMetricValue(marketPage.btcDominance);
            expect(btcDom).toContain("45.23%");
        });
    });

    test("T1.4: Manual refresh functionality", async ({ page }) => {
        await marketPage.goto();

        // Mock a new response for the refresh
        const updatedData = {
            ...mockGlobalData,
            data: {
                ...mockGlobalData.data,
                total_market_cap: { usd: 2600000000000 }, // Changed value
            },
        };

        await page.route("**/api/v3/global*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(updatedData),
            });
        });

        await test.step("Click refresh button", async () => {
            await marketPage.refreshData();
            // Should show loading state briefly
            // await expect(marketPage.loadingIndicator).toBeVisible(); 
            // Note: Loading might be too fast to catch in E2E without artificial delay
        });

        await test.step("Verify data is updated", async () => {
            await expect(marketPage.totalMarketCap).toContainText("$2.60T");
        });
    });

    test("T1.5: Error state and retry functionality", async ({ page }) => {
        // Mock error response initially
        await page.route("**/api/v3/global*", async (route) => {
            await route.fulfill({ status: 500 });
        });

        await marketPage.goto();

        await test.step("Verify error banner is shown", async () => {
            await expect(marketPage.errorBanner).toBeVisible();
            await expect(marketPage.retryButton).toBeVisible();
        });

        // Mock success response for retry
        await page.route("**/api/v3/global*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockGlobalData),
            });
        });

        await test.step("Click retry and verify recovery", async () => {
            await marketPage.clickRetry();
            await expect(marketPage.errorBanner).not.toBeVisible();
            await expect(marketPage.totalMarketCap).toBeVisible();
        });
    });

    test("T1.6: Responsive layout", async ({ page }) => {
        await marketPage.goto();

        await test.step("Verify desktop layout", async () => {
            // Wait for metrics to be visible first
            await expect(marketPage.totalMarketCap).toBeVisible();

            // Check grid layout (metrics side by side)
            // This is hard to test strictly with just visibility, 
            // but we can check that all are visible on desktop
            expect(await marketPage.areAllMetricsVisible()).toBe(true);
        });

        await test.step("Verify mobile layout", async () => {
            await page.setViewportSize({ width: 375, height: 667 });
            // On mobile, they should still be visible (stacked)
            expect(await marketPage.areAllMetricsVisible()).toBe(true);
            // Could add specific CSS checks here if needed, e.g. flex-direction
        });
    });
});
