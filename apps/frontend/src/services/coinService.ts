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

    const mapToMarketMover = (coins: CoinGeckoPriceData[]): MarketMover[] =>
      coins.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        image: '', // Default empty string since CoinGeckoPriceData doesn't have image
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
      }));

    return {
      gainers: mapToMarketMover(gainers),
      losers: mapToMarketMover(losers),
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
      image: '', // Default empty string since CoinGeckoPriceData doesn't have image
    }));
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

    const coinData: MarketCoin = {
      ...data[0],
      image: '', // Default empty string since CoinGeckoPriceData doesn't have image
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

    // Map CoinGeckoPriceData to CoinDetails with default values
    const coinDetails: CoinDetails = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      image: {
        large: '',
        small: '',
        thumb: '',
      },
      description: {
        en: '',
      },
      links: {
        homepage: [],
        whitepaper: '',
        blockchain_site: [],
        twitter_screen_name: '',
        subreddit_url: '',
        repos_url: {
          github: [],
        },
      },
      categories: [],
      market_cap_rank: data.market_cap_rank,
      market_data: {
        current_price: { usd: data.current_price },
        market_cap: { usd: data.market_cap },
        total_volume: { usd: data.total_volume },
        high_24h: { usd: data.high_24h },
        low_24h: { usd: data.low_24h },
        price_change_percentage_24h: data.price_change_percentage_24h,
        price_change_percentage_7d: 0,
        price_change_percentage_30d: 0,
        ath: { usd: data.ath },
        ath_date: { usd: data.ath_date },
        ath_change_percentage: { usd: data.ath_change_percentage },
        atl: { usd: data.atl },
        atl_date: { usd: data.atl_date },
        atl_change_percentage: { usd: data.atl_change_percentage },
        circulating_supply: data.circulating_supply,
        total_supply: data.total_supply,
        max_supply: data.max_supply,
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
