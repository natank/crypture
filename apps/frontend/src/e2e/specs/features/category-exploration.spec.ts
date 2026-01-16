import { test, expect } from "@playwright/test";
import { MarketPage } from "../../pom-pages/market-page.pom";

test.describe("Category Exploration", () => {
    let marketPage: MarketPage;

    const mockCategories = [
        { category_id: "layer-1", name: "Layer 1" },
        { category_id: "decentralized-finance-defi", name: "DeFi" },
        { category_id: "gaming", name: "Gaming" },
    ];

    const mockCoinsAll = [
        {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            current_price: 50000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000000,
            market_cap_rank: 1,
            image: "btc.png"
        },
        {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            current_price: 3000,
            price_change_percentage_24h: 1.2,
            market_cap: 350000000000,
            market_cap_rank: 2,
            image: "eth.png"
        }
    ];

    const mockCoinsDeFi = [
        {
            id: "uniswap",
            symbol: "uni",
            name: "Uniswap",
            current_price: 10,
            price_change_percentage_24h: 5.0,
            market_cap: 6000000000,
            market_cap_rank: 20,
            image: "uni.png"
        }
    ];

    test.beforeEach(async ({ page }) => {
        marketPage = new MarketPage(page);

        // Mock Categories
        await page.route("**/api/v3/coins/categories/list*", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockCategories),
            });
        });

        // Mock Market Data
        await page.route("**/api/v3/coins/markets*", async (route) => {
            const url = new URL(route.request().url());
            const category = url.searchParams.get("category");

            if (category === "decentralized-finance-defi") {
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(mockCoinsDeFi),
                });
            } else {
                // Default / All
                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(mockCoinsAll),
                });
            }
        });
    });

    test("User can view categories and filter coins", async ({ page }) => {
        await marketPage.goto();

        await test.step("Verify categories are displayed", async () => {
            // Check for category filter visibility
            await expect(page.getByTestId("category-filter")).toBeVisible();
            await expect(page.getByRole("button", { name: "All" })).toBeVisible();
            await expect(page.getByRole("button", { name: "DeFi" })).toBeVisible();
        });

        await test.step("Verify default coin list (All)", async () => {
            // Use specific selector to avoid strict mode violation (Bitcoin appears in trending/movers too)
            await expect(page.getByRole('table').getByText("Bitcoin")).toBeVisible();
            await expect(page.getByRole('table').getByText("Ethereum")).toBeVisible();
        });

        await test.step("Select DeFi category", async () => {
            await page.getByRole("button", { name: "DeFi" }).click();
        });

        await test.step("Verify filtered coin list (DeFi)", async () => {
            // Bitcoin should disappear, Uniswap should appear
            await expect(page.getByRole('table').getByText("Bitcoin")).not.toBeVisible();
            await expect(page.getByRole('table').getByText("Uniswap")).toBeVisible();
        });

        await test.step("Return to All categories", async () => {
            await page.getByRole("button", { name: "All" }).click();
            await expect(page.getByRole('table').getByText("Bitcoin")).toBeVisible();
        });
    });
});
