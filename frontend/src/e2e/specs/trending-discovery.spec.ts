import { test, expect } from '@playwright/test';
import { MarketPage } from '../pom-pages/market-page.pom';

test.describe('Trending & Discovery Feed', () => {
    let marketPage: MarketPage;

    test.beforeEach(async ({ page }) => {
        // Mock Trending API
        await page.route('**/search/trending*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    coins: [
                        {
                            item: {
                                id: 'bitcoin',
                                coin_id: 1,
                                name: 'Bitcoin',
                                symbol: 'BTC',
                                market_cap_rank: 1,
                                thumb: 'https://example.com/btc.png',
                                small: 'https://example.com/btc_small.png',
                                large: 'https://example.com/btc_large.png',
                                slug: 'bitcoin',
                                price_btc: 1,
                                score: 0
                            }
                        }
                    ]
                })
            });
        });

        // Mock Top Movers API (Gainers & Losers)
        await page.route('**/coins/markets*', async route => {
            const url = route.request().url();
            const isGainers = url.includes('order=price_change_percentage_24h_desc');

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: isGainers ? 'pepe' : 'terra',
                        symbol: isGainers ? 'pepe' : 'luna',
                        name: isGainers ? 'Pepe' : 'Terra',
                        image: 'https://example.com/icon.png',
                        current_price: 100,
                        market_cap: 1000000,
                        market_cap_rank: 1,
                        price_change_percentage_24h: isGainers ? 15.5 : -20.5
                    }
                ])
            });
        });

        // Mock Global Market Data (to prevent errors in MarketOverview)
        await page.route('**/global*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        total_market_cap: { usd: 1000000000 },
                        total_volume: { usd: 50000000 },
                        market_cap_percentage: { btc: 50, eth: 20 },
                        market_cap_change_percentage_24h_usd: 5,
                        active_cryptocurrencies: 1000,
                        markets: 100,
                        updated_at: 1234567890
                    }
                })
            });
        });

        marketPage = new MarketPage(page);
        await marketPage.goto();
    });

    test('should display trending coins section', async () => {
        await expect(marketPage.trendingSection).toBeVisible();

        // Should have some trending coins (assuming API works or is mocked)
        // In a real E2E, we might rely on the real API or a network mock.
        // If we rely on real API, we just check for visibility.
        await expect(marketPage.trendingCoins.first()).toBeVisible();
    });

    test('should display top gainers and losers sections', async () => {
        await expect(marketPage.topGainersSection).toBeVisible();
        await expect(marketPage.topLosersSection).toBeVisible();

        await expect(marketPage.topGainers.first()).toBeVisible();
        await expect(marketPage.topLosers.first()).toBeVisible();
    });

    test('should display correct structure for a trending coin card', async () => {
        // Wait for data to load
        await expect(marketPage.page.getByText('Bitcoin')).toBeVisible();

        // Check the first trending coin card for expected elements
        const firstCoin = marketPage.trendingCoins.first();
        await expect(firstCoin).toBeVisible();

        // Check for rank, image, name, symbol
        await expect(firstCoin.locator('img')).toBeVisible();
        // Use .first() to avoid ambiguity if multiple bold spans exist (rank and name)
        await expect(firstCoin.locator('span.font-bold').first()).toBeVisible();
        await expect(firstCoin.locator('span.text-sm')).toBeVisible(); // Symbol
    });

    test('should display correct structure for a mover row', async () => {
        // Check the first gainer row
        const firstGainer = marketPage.topGainers.first();
        await expect(firstGainer).toBeVisible();

        // Check for image, symbol, price, change
        await expect(firstGainer.locator('img')).toBeVisible();
        await expect(firstGainer.locator('.text-green-600')).toBeVisible(); // Positive change
    });
});
