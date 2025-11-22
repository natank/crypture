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
import { GlobalMarketData, GlobalMarketApiResponse } from "../types/market";

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
