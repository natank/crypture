import { Page } from '@playwright/test';

export async function mockCoinGeckoList(page: Page) {
  await page.route('**/api/coingecko/coins/list**', async (route) => {
    const body = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
      },
      {
        id: 'cardano',
        symbol: 'ada',
        name: 'Cardano',
      },
      {
        id: 'ripple',
        symbol: 'xrp',
        name: 'XRP',
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
      },
    ];

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

export async function mockCoinGeckoMarkets(
  page: Page,
  overrides: Partial<Record<string, number>> = {}
) {
  await page.route('**/api/coingecko/coins/markets**', async (route) => {
    const body = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: overrides.BTC ?? 30000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: overrides.ETH ?? 2000,
        image:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      },
    ];

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

export async function mockCoinGeckoChartData(page: Page) {
  await page.route('**/api/coingecko/coins/*/market_chart**', async (route) => {
    // Mock chart data with 30 days of price history
    const prices = Array.from({ length: 30 }, (_, i) => [
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      30000 + Math.random() * 5000,
    ]);

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { prices },
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

export async function mockCoinGeckoTrending(page: Page) {
  await page.route('**/api/coingecko/search/trending**', async (route) => {
    const body = {
      coins: [
        {
          item: {
            id: 'bitcoin',
            coin_id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            market_cap_rank: 1,
            thumb:
              'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
            small:
              'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
            large:
              'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            slug: 'bitcoin',
            price_btc: 1,
            score: 0,
          },
        },
        {
          item: {
            id: 'ethereum',
            coin_id: 1027,
            name: 'Ethereum',
            symbol: 'ETH',
            market_cap_rank: 2,
            thumb:
              'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
            small:
              'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
            large:
              'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            slug: 'ethereum',
            price_btc: 0.066,
            score: 1,
          },
        },
      ],
    };

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

export async function mockCoinGeckoGlobal(page: Page) {
  await page.route('**/api/coingecko/global**', async (route) => {
    const globalData = {
      active_cryptocurrencies: 10000,
      markets: 750,
      total_market_cap: {
        usd: 1200000000000,
      },
      total_volume: {
        usd: 50000000000,
      },
      market_cap_percentage: {
        btc: 48.5,
        eth: 20.0,
      },
      market_cap_change_percentage_24h_usd: 2.5,
      updated_at: Date.now() / 1000,
    };

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { data: globalData },
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}

export async function mockCoinGeckoCategories(page: Page) {
  await page.route(
    '**/api/coingecko/coins/categories/list**',
    async (route) => {
      const body = [
        {
          category_id: 'cryptocurrency',
          name: 'Cryptocurrency',
        },
        {
          category_id: 'smart-contract-platform',
          name: 'Smart Contract Platform',
        },
        {
          category_id: 'decentralized-finance-defi',
          name: 'Decentralized Finance (DeFi)',
        },
      ];

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: body,
          timestamp: new Date().toISOString(),
          requestId: 'mock-request-id',
        }),
      });
    }
  );
}

export async function mockCoinGeckoCoinDetails(page: Page) {
  await page.route('**/api/coingecko/coins/bitcoin', async (route) => {
    const body = {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: {
        large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
      },
      description: {
        en: 'Bitcoin is the first successful internet money based on peer-to-peer technology.',
      },
      links: {
        homepage: ['https://bitcoin.org/'],
        whitepaper: 'https://bitcoin.org/bitcoin.pdf',
        blockchain_site: ['https://blockchain.com/'],
        twitter_screen_name: 'bitcoin',
        subreddit_url: 'https://www.reddit.com/r/Bitcoin/',
        repos_url: {
          github: ['https://github.com/bitcoin/bitcoin'],
        },
      },
      categories: ['Cryptocurrency'],
      market_cap_rank: 1,
      market_data: {
        current_price: { usd: 30000 },
        market_cap: { usd: 580000000000 },
        total_volume: { usd: 25000000000 },
        high_24h: { usd: 31000 },
        low_24h: { usd: 29500 },
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d: 5.2,
        price_change_percentage_30d: 10.8,
        ath: { usd: 69000 },
        ath_date: { usd: '2021-11-10T14:24:11.849Z' },
        ath_change_percentage: { usd: -56.5 },
        atl: { usd: 67.81 },
        atl_date: { usd: '2013-07-06T00:00:00.000Z' },
        atl_change_percentage: { usd: 44150.2 },
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
      },
    };

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });

  await page.route('**/api/coingecko/coins/ethereum', async (route) => {
    const body = {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: {
        large:
          'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        small:
          'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        thumb:
          'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
      },
      description: {
        en: 'Ethereum is a decentralized platform that runs smart contracts.',
      },
      links: {
        homepage: ['https://ethereum.org/'],
        whitepaper: 'https://ethereum.org/en/whitepaper/',
        blockchain_site: ['https://etherscan.io/'],
        twitter_screen_name: 'ethereum',
        subreddit_url: 'https://www.reddit.com/r/ethereum/',
        repos_url: {
          github: ['https://github.com/ethereum/go-ethereum'],
        },
      },
      categories: ['Smart Contract Platform'],
      market_cap_rank: 2,
      market_data: {
        current_price: { usd: 2000 },
        market_cap: { usd: 240000000000 },
        total_volume: { usd: 12000000000 },
        high_24h: { usd: 2050 },
        low_24h: { usd: 1980 },
        price_change_percentage_24h: 1.8,
        price_change_percentage_7d: 4.5,
        price_change_percentage_30d: 8.2,
        ath: { usd: 4878 },
        ath_date: { usd: '2021-11-10T14:24:19.604Z' },
        ath_change_percentage: { usd: -59.0 },
        atl: { usd: 0.432979 },
        atl_date: { usd: '2015-10-20T00:00:00.000Z' },
        atl_change_percentage: { usd: 461800.5 },
        circulating_supply: 120000000,
        total_supply: null,
        max_supply: null,
      },
    };

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: body,
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });
}
