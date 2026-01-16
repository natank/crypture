import { test, expect } from "@playwright/test";
import { ComparisonPage } from "../../pom-pages/comparison-page.pom";

test.describe("Coin Comparison Feature", () => {
    let comparisonPage: ComparisonPage;

    const mockTopCoins = [
        { id: "bitcoin", name: "Bitcoin", symbol: "btc", current_price: 50000 },
        { id: "ethereum", name: "Ethereum", symbol: "eth", current_price: 3000 },
        { id: "solana", name: "Solana", symbol: "sol", current_price: 100 },
        { id: "cardano", name: "Cardano", symbol: "ada", current_price: 0.5 },
    ];

    const mockCoinDetails = (id: string, name: string, symbol: string, price: number) => ({
        id,
        symbol,
        name,
        image: {
            thumb: `https://example.com/${id}-thumb.png`,
            small: `https://example.com/${id}-small.png`,
            large: `https://example.com/${id}-large.png`,
        },
        description: { en: `${name} description` },
        links: {
            homepage: [`https://${id}.org`],
            whitepaper: "",
            blockchain_site: [],
            twitter_screen_name: id,
            subreddit_url: "",
            repos_url: { github: [] },
        },
        categories: ["Cryptocurrency"],
        market_cap_rank: 1,
        market_data: {
            current_price: { usd: price },
            market_cap: { usd: price * 1000000 },
            total_volume: { usd: price * 100000 },
            high_24h: { usd: price * 1.02 },
            low_24h: { usd: price * 0.98 },
            price_change_percentage_24h: 5.5,
            price_change_percentage_7d: 10.2,
            price_change_percentage_30d: 15.3,
            ath: { usd: price * 1.5 },
            ath_date: { usd: "2021-11-10T00:00:00.000Z" },
            ath_change_percentage: { usd: -33 },
            atl: { usd: price * 0.01 },
            atl_date: { usd: "2015-01-01T00:00:00.000Z" },
            atl_change_percentage: { usd: 9900 },
            circulating_supply: 19000000,
            total_supply: 21000000,
            max_supply: 21000000,
        },
    });

    const mockPriceHistory = [
        [Date.now() - 30 * 24 * 60 * 60 * 1000, 45000],
        [Date.now() - 15 * 24 * 60 * 60 * 1000, 48000],
        [Date.now(), 50000],
    ];

    test.beforeEach(async ({ page }) => {
        comparisonPage = new ComparisonPage(page);

        // Mock top coins API
        await page.route("**/api/v3/coins/markets*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockTopCoins),
            });
        });

        // Mock coin details API
        await page.route("**/api/v3/coins/bitcoin?*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockCoinDetails("bitcoin", "Bitcoin", "btc", 50000)),
            });
        });

        await page.route("**/api/v3/coins/ethereum?*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockCoinDetails("ethereum", "Ethereum", "eth", 3000)),
            });
        });

        await page.route("**/api/v3/coins/solana?*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockCoinDetails("solana", "Solana", "sol", 100)),
            });
        });

        // Mock price history API
        await page.route("**/api/v3/coins/*/market_chart*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ prices: mockPriceHistory }),
            });
        });
    });

    test("displays empty state when no coins selected", async () => {
        await comparisonPage.goto();

        await expect(comparisonPage.header).toBeVisible();
        await expect(comparisonPage.emptyState).toBeVisible();
        await expect(comparisonPage.emptyState).toContainText("No coins selected");
    });

    test("can search and select coins for comparison", async () => {
        await comparisonPage.goto();

        await test.step("Search for Bitcoin", async () => {
            await comparisonPage.searchCoin("bitcoin");
            await expect(comparisonPage.coinSelectorResults).toBeVisible();
            await expect(comparisonPage.coinSelectorResults).toContainText("Bitcoin");
        });

        await test.step("Select Bitcoin", async () => {
            await comparisonPage.selectCoinFromResults("Bitcoin");
            await expect(comparisonPage.selectedCoinsBar).toBeVisible();
            await expect(comparisonPage.selectedCoinsBar).toContainText("Bitcoin");
        });

        await test.step("Empty state should be hidden", async () => {
            await expect(comparisonPage.emptyState).not.toBeVisible();
        });
    });

    test("can select up to 3 coins", async () => {
        await comparisonPage.goto();

        await test.step("Add first coin", async () => {
            await comparisonPage.searchCoin("bitcoin");
            await comparisonPage.selectCoinFromResults("Bitcoin");
            expect(await comparisonPage.getSelectedCoinCount()).toBe(1);
        });

        await test.step("Add second coin", async () => {
            await comparisonPage.searchCoin("ethereum");
            await comparisonPage.selectCoinFromResults("Ethereum");
            expect(await comparisonPage.getSelectedCoinCount()).toBe(2);
        });

        await test.step("Add third coin", async () => {
            await comparisonPage.searchCoin("solana");
            await comparisonPage.selectCoinFromResults("Solana");
            expect(await comparisonPage.getSelectedCoinCount()).toBe(3);
        });

        await test.step("Selector should be hidden at max", async () => {
            await expect(comparisonPage.coinSelectorInput).not.toBeVisible();
        });
    });

    test("can remove coins from comparison", async () => {
        await comparisonPage.goto();

        // Add a coin first
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");
        await expect(comparisonPage.selectedCoinsBar).toContainText("Bitcoin");

        // Remove the coin
        await comparisonPage.removeCoin("bitcoin");

        // Should show empty state again
        await expect(comparisonPage.emptyState).toBeVisible();
    });

    test("displays comparison table with metrics", async () => {
        await comparisonPage.goto();

        // Add coins
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");

        await test.step("Wait for table to load", async () => {
            await expect(comparisonPage.comparisonTable).toBeVisible({ timeout: 10000 });
        });

        await test.step("Verify table contains expected metrics", async () => {
            await expect(comparisonPage.comparisonTable).toContainText("Price");
            await expect(comparisonPage.comparisonTable).toContainText("Market Cap");
            await expect(comparisonPage.comparisonTable).toContainText("24h Change");
        });
    });

    test("displays comparison chart with time range controls", async () => {
        await comparisonPage.goto();

        // Add a coin
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");

        await test.step("Wait for chart to load", async () => {
            await expect(comparisonPage.comparisonChart).toBeVisible({ timeout: 10000 });
        });

        await test.step("Verify time range buttons exist", async () => {
            await expect(comparisonPage.timeRangeButtons).toBeVisible();
            await expect(comparisonPage.timeRangeButtons).toContainText("7D");
            await expect(comparisonPage.timeRangeButtons).toContainText("30D");
            await expect(comparisonPage.timeRangeButtons).toContainText("90D");
            await expect(comparisonPage.timeRangeButtons).toContainText("1Y");
        });

        await test.step("30D should be selected by default", async () => {
            expect(await comparisonPage.isTimeRangeSelected("30D")).toBe(true);
        });
    });

    test("can change chart time range", async () => {
        await comparisonPage.goto();

        // Add a coin
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");
        await expect(comparisonPage.comparisonChart).toBeVisible({ timeout: 10000 });

        // Change time range
        await comparisonPage.selectTimeRange("7D");

        await test.step("7D should now be selected", async () => {
            expect(await comparisonPage.isTimeRangeSelected("7D")).toBe(true);
            expect(await comparisonPage.isTimeRangeSelected("30D")).toBe(false);
        });
    });

    test("pre-selects coin from URL parameter", async () => {
        await comparisonPage.gotoWithCoin("bitcoin");

        await test.step("Bitcoin should be pre-selected", async () => {
            await expect(comparisonPage.selectedCoinsBar).toBeVisible({ timeout: 10000 });
            await expect(comparisonPage.selectedCoinsBar).toContainText("Bitcoin");
        });

        await test.step("Comparison content should be visible", async () => {
            await expect(comparisonPage.comparisonTable).toBeVisible({ timeout: 10000 });
        });
    });

    test("excludes already selected coins from search results", async () => {
        await comparisonPage.goto();

        // Add Bitcoin
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");

        // Search for Bitcoin again - should not appear
        await comparisonPage.searchCoin("bitcoin");
        
        // Results should show "No coins found" since Bitcoin is already selected
        await expect(comparisonPage.coinSelectorResults).toContainText("No coins found");
    });

    test("responsive: works on mobile viewport", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await comparisonPage.goto();

        // Add a coin
        await comparisonPage.searchCoin("bitcoin");
        await comparisonPage.selectCoinFromResults("Bitcoin");

        await test.step("Table should be visible and scrollable", async () => {
            await expect(comparisonPage.comparisonTable).toBeVisible({ timeout: 10000 });
        });

        await test.step("Chart should be visible", async () => {
            await expect(comparisonPage.comparisonChart).toBeVisible({ timeout: 10000 });
        });
    });
});
