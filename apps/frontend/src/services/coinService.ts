import { coinGeckoApiService } from './coinGeckoApiService';
import type {
  GlobalMarketData,
  TrendingCoin,
  MarketMover,
  Category,
  MarketCoin,
  CoinDetails,
} from 'types/market';
import type { CoinGeckoPriceData } from '@crypture/shared-types';

export type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  categories?: string[];
};

export async function fetchTopCoins(): Promise<CoinInfo[]> {
  try {
    const data = await coinGeckoApiService.getCoinsMarkets({
      perPage: 100,
      page: 1,
    });

    return data.map((coin: CoinGeckoPriceData) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      // Note: 7d change not available in markets endpoint, will use 24h as fallback
      price_change_percentage_7d: coin.price_change_percentage_24h,
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
    if (!data || !data.prices) {
      throw new Error('No price data received');
    }
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
    if (!data || !data.coins) {
      throw new Error('No trending data received');
    }
    return data.coins.map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      market_cap_rank: coin.item.market_cap_rank,
      thumb: coin.item.thumb,
      small: coin.item.small,
      large: coin.item.large,
      slug: coin.item.slug,
      price_btc: coin.item.price_btc,
      score: coin.item.score,
      coin_id: parseInt(coin.item.id, 10) || 0,
    }));
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
    // Fetch more coins initially to ensure we have enough distinct options
    const [topGainers, topLosers] = await Promise.all([
      coinGeckoApiService.getCoinsMarkets({
        perPage: 20, // Fetch more to have enough distinct coins
        page: 1,
        order: 'price_change_percentage_24h_desc',
      }),
      coinGeckoApiService.getCoinsMarkets({
        perPage: 20, // Fetch more to have enough distinct coins
        page: 1,
        order: 'price_change_percentage_24h_asc',
      }),
    ]);

    // Filter for actual gainers (positive change) and losers (negative change)
    const actualGainers = topGainers.filter(
      (coin) => (coin.price_change_percentage_24h || 0) > 0
    );
    const actualLosers = topLosers.filter(
      (coin) => (coin.price_change_percentage_24h || 0) < 0
    );

    // Get IDs of gainers to exclude from losers list
    const gainerIds = new Set(actualGainers.map((coin) => coin.id));

    // Filter out any coins that appear in both lists
    const distinctLosers = actualLosers.filter(
      (coin) => !gainerIds.has(coin.id)
    );

    const mapToMarketMover = (coins: CoinGeckoPriceData[]): MarketMover[] =>
      coins.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        image: coin.image || '/default-coin-icon.png',
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
      }));

    return {
      gainers: mapToMarketMover(actualGainers.slice(0, 5)), // Limit to top 5
      losers: mapToMarketMover(distinctLosers.slice(0, 5)), // Limit to top 5
    };
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
    return data.map((category) => ({
      category_id: category.id,
      name: category.name,
    }));
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
      category,
    });
    return data.map((coin) => ({
      ...coin,
      image: coin.image || '/default-coin-icon.png',
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to fetch market coins');
  }
}

// Cache for coin categories (coinId -> categories mapping)
const coinCategoriesCache: Map<
  string,
  { categories: string[]; timestamp: number }
> = new Map();
const CATEGORIES_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch categories for multiple coins in parallel
 * Uses caching to avoid repeated API calls
 */
export async function fetchCoinCategories(
  coinIds: string[]
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  const idsToFetch: string[] = [];

  // Check cache first
  const now = Date.now();
  for (const coinId of coinIds) {
    const cached = coinCategoriesCache.get(coinId);
    if (cached && now - cached.timestamp < CATEGORIES_CACHE_DURATION) {
      result[coinId] = cached.categories;
    } else {
      idsToFetch.push(coinId);
    }
  }

  // Fetch missing categories in parallel
  if (idsToFetch.length > 0) {
    const fetchPromises = idsToFetch.map(async (coinId) => {
      try {
        const data = await coinGeckoApiService.getCoinById(coinId);
        if (data?.categories && data.categories.length > 0) {
          // Update cache
          coinCategoriesCache.set(coinId, {
            categories: data.categories,
            timestamp: now,
          });
          return { coinId, categories: data.categories };
        }
        return { coinId, categories: ['Other'] };
      } catch (error) {
        console.warn(`Failed to fetch categories for ${coinId}:`, error);
        return { coinId, categories: ['Other'] };
      }
    });

    const fetchedResults = await Promise.all(fetchPromises);
    for (const { coinId, categories } of fetchedResults) {
      result[coinId] = categories;
    }
  }

  return result;
}

// Export for testing
export function clearCategoriesCache(): void {
  coinCategoriesCache.clear();
}

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

    const coinData: MarketCoin = {
      ...data[0],
      image: data[0].image || '/default-coin-icon.png',
    };

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

    // Map CoinGeckoDetailResponse to CoinDetails
    const coinDetails: CoinDetails = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: data.image || {
        large: '',
        small: '',
        thumb: '',
      },
      description: (data.description?.en
        ? { en: data.description.en }
        : { en: '' }) as { en: string },
      links: data.links || {
        homepage: [],
        whitepaper: '',
        blockchain_site: [],
        twitter_screen_name: '',
        subreddit_url: '',
        repos_url: {
          github: [],
        },
      },
      categories: data.categories || [],
      market_cap_rank: data.market_cap_rank,
      market_data: {
        current_price: { usd: data.market_data?.current_price?.usd ?? 0 },
        market_cap: { usd: data.market_data?.market_cap?.usd ?? 0 },
        total_volume: { usd: data.market_data?.total_volume?.usd ?? 0 },
        high_24h: { usd: data.market_data?.high_24h?.usd ?? 0 },
        low_24h: { usd: data.market_data?.low_24h?.usd ?? 0 },
        price_change_percentage_24h:
          data.market_data?.price_change_percentage_24h,
        price_change_percentage_7d:
          data.market_data?.price_change_percentage_7d,
        price_change_percentage_30d:
          data.market_data?.price_change_percentage_30d,
        ath: { usd: data.market_data?.ath?.usd ?? 0 },
        ath_date: { usd: data.market_data?.ath_date?.usd ?? '' },
        ath_change_percentage: {
          usd: data.market_data?.ath_change_percentage?.usd ?? 0,
        },
        atl: { usd: data.market_data?.atl?.usd ?? 0 },
        atl_date: { usd: data.market_data?.atl_date?.usd ?? '' },
        atl_change_percentage: {
          usd: data.market_data?.atl_change_percentage?.usd ?? 0,
        },
        circulating_supply: data.market_data?.circulating_supply,
        total_supply: data.market_data?.total_supply,
        max_supply: data.market_data?.max_supply,
      },
    };

    // Update cache
    coinDetailsCache.set(coinId, {
      data: coinDetails,
      timestamp: Date.now(),
    });

    return coinDetails;
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
