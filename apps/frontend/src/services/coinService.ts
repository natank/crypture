import { coinGeckoApiService } from './coinGeckoApiService';
import type {
  GlobalMarketData,
  GlobalMarketApiResponse,
  TrendingCoin,
  TrendingApiResponse,
  MarketMover,
  Category,
  MarketCoin,
  CoinDetails,
} from 'types/market';

export type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
};

export async function fetchTopCoins(): Promise<CoinInfo[]> {
  try {
    const data = await coinGeckoApiService.getCoinsMarkets({
      perPage: 100,
      page: 1,
    });

    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch coin list');
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
  try {
    const data = await coinGeckoApiService.getMarketChart(assetId, {
      days,
    });
    return data.prices;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch asset history');
  }
}

// Cache for global market data

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let globalMarketCache: { data: GlobalMarketData; timestamp: number } | null =
  null;

export const clearGlobalMarketCache = () => {
  globalMarketCache = null;
};

export async function fetchGlobalMarketData(): Promise<GlobalMarketData> {
  // Check cache first
  if (
    globalMarketCache &&
    Date.now() - globalMarketCache.timestamp < CACHE_DURATION
  ) {
    return globalMarketCache.data;
  }

  try {
    const data = await coinGeckoApiService.getGlobal();

    const marketData: GlobalMarketData = {
      totalMarketCap: data.data.total_market_cap.usd,
      totalVolume24h: data.data.total_volume.usd,
      btcDominance: data.data.market_cap_percentage.btc,
      ethDominance: data.data.market_cap_percentage.eth,
      marketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
      activeCryptocurrencies: data.data.active_cryptocurrencies,
      markets: data.data.markets,
      updatedAt: data.data.updated_at,
    };

    // Update cache
    globalMarketCache = {
      data: marketData,
      timestamp: Date.now(),
    };

    return marketData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch global market data');
  }
}

export async function fetchTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const data = await coinGeckoApiService.getTrending();
    return data.coins.map((coin: { item: TrendingCoin }) => coin.item);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch trending coins');
  }
}

export async function fetchTopMovers(): Promise<{
  gainers: MarketMover[];
  losers: MarketMover[];
}> {
  try {
    const [gainers, losers] = await Promise.all([
      coinGeckoApiService.getCoinsMarkets({
        perPage: 5,
        page: 1,
        order: 'price_change_percentage_24h_desc',
      }),
      coinGeckoApiService.getCoinsMarkets({
        perPage: 5,
        page: 1,
        order: 'price_change_percentage_24h_asc',
      }),
    ]);

    return { gainers, losers };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch top movers');
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await coinGeckoApiService.getCategories();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch categories');
  }
}

export async function fetchMarketCoins(
  category?: string
): Promise<MarketCoin[]> {
  try {
    const data = await coinGeckoApiService.getCoinsMarkets({
      perPage: 100,
      page: 1,
      sparkline: false,
      category,
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch market coins');
  }
}

// Cache for asset metrics data
const assetMetricsCache: Map<string, { data: MarketCoin; timestamp: number }> =
  new Map();
const ASSET_METRICS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchAssetMetrics(
  coinId: string
): Promise<MarketCoin | null> {
  // Check cache first
  const cached = assetMetricsCache.get(coinId);
  if (cached && Date.now() - cached.timestamp < ASSET_METRICS_CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await coinGeckoApiService.getCoinsMarkets({
      ids: [coinId],
    });

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
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch asset metrics');
  }
}

// Cache for coin details data (REQ-014)
const coinDetailsCache: Map<string, { data: CoinDetails; timestamp: number }> =
  new Map();
const COIN_DETAILS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function fetchCoinDetails(coinId: string): Promise<CoinDetails> {
  // Check cache first
  const cached = coinDetailsCache.get(coinId);
  if (cached && Date.now() - cached.timestamp < COIN_DETAILS_CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await coinGeckoApiService.getCoinById(coinId);
    
    if (!data) {
      throw new Error('Coin not found');
    }

    // Update cache
    coinDetailsCache.set(coinId, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.message === 'Coin not found' ||
       error.message.includes('Coin not found'))
    ) {
      throw error;
    }
    throw new Error('Unable to fetch coin details');
  }
}
