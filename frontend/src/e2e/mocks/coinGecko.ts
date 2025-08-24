import { Page } from '@playwright/test';
import { PriceHistoryPoint } from '@services/coinService';

// Mock for the main coin list fetch
export async function mockCoinGeckoMarkets(page: Page) {
  await page.route('**/api/v3/coins/markets*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 55000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 4000 },
      ],
    });
  });
}

// Generates mock history data for a given number of days
const generateMockHistory = (days: number, basePrice: number): PriceHistoryPoint[] => {
    const data: PriceHistoryPoint[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const price = basePrice + Math.random() * (basePrice * 0.1) - (basePrice * 0.05);
        data.push([date.getTime(), price]);
    }
    return data;
};


// Mock for the asset price history fetch
export async function mockCoinGeckoHistory(page: Page) {
  await page.route('**/api/v3/coins/*/market_chart*', (route) => {
    const url = route.request().url();
    const assetId = url.match(/coins\/(.*?)\/market_chart/)?.[1];
    const days = parseInt(new URL(url).searchParams.get('days') || '30', 10);

    let prices: PriceHistoryPoint[] = [];
    if (assetId === 'bitcoin') {
        prices = generateMockHistory(days, 55000);
    } else if (assetId === 'ethereum') {
        prices = generateMockHistory(days, 4000);
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: {
        prices,
      },
    });
  });
}
