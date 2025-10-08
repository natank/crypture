import { Page } from "@playwright/test";

export async function mockCoinGeckoMarkets(
  page: Page,
  overrides: Partial<Record<string, number>> = {}
) {
  await page.route(
    "**/api.coingecko.com/api/v3/coins/markets**",
    async (route) => {
      const body = [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: overrides.BTC ?? 30000,
          image:
            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          current_price: overrides.ETH ?? 2000,
          image:
            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        },
      ];

      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    }
  );
}

export async function mockCoinGeckoChartData(page: Page) {
  await page.route(
    "**/api.coingecko.com/api/v3/coins/*/market_chart**",
    async (route) => {
      // Mock chart data with 30 days of price history
      const prices = Array.from({ length: 30 }, (_, i) => [
        Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
        30000 + Math.random() * 5000
      ]);
      
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ prices }),
      });
    }
  );
}
