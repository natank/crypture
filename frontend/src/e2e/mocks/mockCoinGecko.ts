import { Page } from "@playwright/test";

export async function mockCoinGeckoMarkets(page: Page) {
  await page.route(
    "**/api.coingecko.com/api/v3/coins/markets**",
    async (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "bitcoin",
            symbol: "btc",
            name: "Bitcoin",
            current_price: 30000,
            image:
              "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          },
          {
            id: "ethereum",
            symbol: "eth",
            name: "Ethereum",
            current_price: 2000,
            image:
              "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          },
        ]),
      });
    }
  );
}
