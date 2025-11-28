import { Page } from '@playwright/test';
import { PriceHistoryPoint } from '@services/coinService';

// Full mock data for market coins with ATH/ATL and supply metrics (REQ-023)
const mockMarketCoins = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 55000,
    market_cap: 1050000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    total_volume: 35000000000,
    high_24h: 56000,
    low_24h: 54000,
    ath: 69000,
    ath_date: '2021-11-10T00:00:00.000Z',
    ath_change_percentage: -20.29,
    atl: 67.81,
    atl_date: '2013-07-06T00:00:00.000Z',
    atl_change_percentage: 81000,
    circulating_supply: 19500000,
    total_supply: 19500000,
    max_supply: 21000000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/eth.png',
    current_price: 4000,
    market_cap: 480000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
    total_volume: 18000000000,
    high_24h: 4100,
    low_24h: 3900,
    ath: 4878,
    ath_date: '2021-11-10T00:00:00.000Z',
    ath_change_percentage: -18.0,
    atl: 0.432979,
    atl_date: '2015-10-20T00:00:00.000Z',
    atl_change_percentage: 923000,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null, // Ethereum has no max supply
  },
];

// Mock for the main coin list fetch
export async function mockCoinGeckoMarkets(page: Page) {
  await page.route('**/api/v3/coins/markets*', (route) => {
    const url = route.request().url();
    const params = new URL(url).searchParams;
    const ids = params.get('ids');
    
    // If specific IDs are requested (for asset metrics), filter the response
    let responseData = mockMarketCoins;
    if (ids) {
      const idList = ids.split(',');
      responseData = mockMarketCoins.filter(coin => idList.includes(coin.id));
    }
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: responseData,
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
