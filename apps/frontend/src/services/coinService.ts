import type { GlobalMarketData, GlobalMarketApiResponse, TrendingCoin, TrendingApiResponse, MarketMover, Category, MarketCoin, CoinDetails } from "types/market";

export type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
};

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const COINS_URL =
  `https://api.coingecko.com/api/v3/coins/markets` +
  `?vs_currency=usd&order=market_cap_desc&per_page=100&page=1` +
  `&x_cg_demo_api_key=${API_KEY}`;

export async function fetchTopCoins(): Promise<CoinInfo[]> {
  try {
    const response = await fetch(COINS_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinInfo[] = await response.json();

    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
    }));
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch coin list");
  }
}

export type PriceHistoryPoint = [number, number]; // [timestamp, price]

export type PriceHistoryResponse = {
  prices: PriceHistoryPoint[];
};

export async function fetchAssetHistory(
  assetId: string,
  days: number
): Promise<PriceHistoryPoint[]> {
  const HISTORY_URL =
    `https://api.coingecko.com/api/v3/coins/${assetId}/market_chart` +
    `?vs_currency=usd&days=${days}&interval=daily&x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(HISTORY_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: PriceHistoryResponse = await response.json();

    return data.prices;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch asset history");
  }
}

// Cache for global market data

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let globalMarketCache: { data: GlobalMarketData; timestamp: number } | null = null;

export const clearGlobalMarketCache = () => {
  globalMarketCache = null;
};

export async function fetchGlobalMarketData(): Promise<GlobalMarketData> {
  // Check cache first
  if (globalMarketCache && (Date.now() - globalMarketCache.timestamp) < CACHE_DURATION) {
    return globalMarketCache.data;
  }

  const GLOBAL_URL = `https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(GLOBAL_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const json: GlobalMarketApiResponse = await response.json();
    const { data } = json;

    const marketData: GlobalMarketData = {
      totalMarketCap: data.total_market_cap.usd,
      totalVolume24h: data.total_volume.usd,
      btcDominance: data.market_cap_percentage.btc,
      ethDominance: data.market_cap_percentage.eth,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd,
      activeCryptocurrencies: data.active_cryptocurrencies,
      markets: data.markets,
      updatedAt: data.updated_at,
    };

    // Update cache
    globalMarketCache = {
      data: marketData,
      timestamp: Date.now(),
    };

    return marketData;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch global market data");
  }
}

export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  const TRENDING_URL = `https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(TRENDING_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const json: TrendingApiResponse = await response.json();
    return json.coins.map((coin: { item: TrendingCoin }) => coin.item);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch trending coins");
  }
}

export async function fetchTopMovers(): Promise<{ gainers: MarketMover[]; losers: MarketMover[] }> {
  const BASE_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=5&page=1&x_cg_demo_api_key=${API_KEY}`;
  const GAINERS_URL = `${BASE_URL}&order=price_change_percentage_24h_desc`;
  const LOSERS_URL = `${BASE_URL}&order=price_change_percentage_24h_asc`;

  try {
    const [gainersRes, losersRes] = await Promise.all([
      fetch(GAINERS_URL),
      fetch(LOSERS_URL)
    ]);

    if (!gainersRes.ok || !losersRes.ok) {
      throw new Error(`CoinGecko API error`);
    }

    const gainers: MarketMover[] = await gainersRes.json();
    const losers: MarketMover[] = await losersRes.json();

    return { gainers, losers };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch top movers");
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const CATEGORIES_URL = `https://api.coingecko.com/api/v3/coins/categories/list?x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(CATEGORIES_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: Category[] = await response.json();
    return data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch categories");
  }
}

export async function fetchMarketCoins(category?: string): Promise<MarketCoin[]> {
  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${API_KEY}`;

  if (category) {
    url += `&category=${category}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: MarketCoin[] = await response.json();
    return data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch market coins");
  }
}

// Cache for asset metrics data
const assetMetricsCache: Map<string, { data: MarketCoin; timestamp: number }> = new Map();
const ASSET_METRICS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchAssetMetrics(coinId: string): Promise<MarketCoin | null> {
  // Check cache first
  const cached = assetMetricsCache.get(coinId);
  if (cached && (Date.now() - cached.timestamp) < ASSET_METRICS_CACHE_DURATION) {
    return cached.data;
  }

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: MarketCoin[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    const coinData = data[0];
    
    // Update cache
    assetMetricsCache.set(coinId, {
      data: coinData,
      timestamp: Date.now(),
    });

    return coinData;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch asset metrics");
  }
}

// Cache for coin details data (REQ-014)
const coinDetailsCache: Map<string, { data: CoinDetails; timestamp: number }> = new Map();
const COIN_DETAILS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function fetchCoinDetails(coinId: string): Promise<CoinDetails> {
  // Check cache first
  const cached = coinDetailsCache.get(coinId);
  if (cached && (Date.now() - cached.timestamp) < COIN_DETAILS_CACHE_DURATION) {
    return cached.data;
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Coin not found");
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinDetails = await response.json();
    
    // Update cache
    coinDetailsCache.set(coinId, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.message.startsWith("CoinGecko API error") || error.message === "Coin not found")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch coin details");
  }
}
