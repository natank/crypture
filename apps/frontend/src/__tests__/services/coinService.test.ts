import {
  fetchTopCoins,
  fetchAssetHistory,
  fetchGlobalMarketData,
  clearGlobalMarketCache,
  fetchCoinCategories,
  clearCategoriesCache,
} from '@services/coinService';
import { coinGeckoApiService } from '@services/coinGeckoApiService';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type {
  CoinGeckoPriceData,
  CoinGeckoMarketChartResponse,
  CoinGeckoGlobalResponse,
  CoinGeckoDetailResponse,
} from '@crypture/shared-types';

// Mock the coinGeckoApiService
vi.mock('@services/coinGeckoApiService', () => ({
  coinGeckoApiService: {
    getCoinsMarkets: vi.fn(),
    getMarketChart: vi.fn(),
    getGlobal: vi.fn(),
    getTrending: vi.fn(),
    getCategories: vi.fn(),
    getCoinById: vi.fn(),
  },
}));

const mockCoins: CoinGeckoPriceData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: null,
    total_volume: 20000000000,
    high_24h: 51000,
    low_24h: 49000,
    price_change_24h: 1000,
    price_change_percentage_24h: 2.0,
    market_cap_change_24h: 20000000000,
    market_cap_change_percentage_24h: 2.0,
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69000,
    ath_change_percentage: -27.5,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 73676.2,
    atl_date: '2013-07-06T00:00:00.000Z',
    roi: null,
    last_updated: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3000,
    market_cap: 360000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: null,
    total_volume: 10000000000,
    high_24h: 3100,
    low_24h: 2900,
    price_change_24h: 100,
    price_change_percentage_24h: 3.45,
    market_cap_change_24h: 12000000000,
    market_cap_change_percentage_24h: 3.45,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    ath: 4878,
    ath_change_percentage: -38.5,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 0.432,
    atl_change_percentage: 694444.4,
    atl_date: '2015-10-20T00:00:00.000Z',
    roi: null,
    last_updated: '2024-01-01T00:00:00.000Z',
  },
];

describe('fetchTopCoins', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns formatted coin list on success', async () => {
    vi.mocked(coinGeckoApiService.getCoinsMarkets).mockResolvedValueOnce(
      mockCoins
    );

    const coins = await fetchTopCoins();

    expect(coins).toEqual([
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        current_price: 50000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.0,
        price_change_percentage_7d: 2.0,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        current_price: 3000,
        market_cap_rank: 2,
        price_change_percentage_24h: 3.45,
        price_change_percentage_7d: 3.45,
      },
    ]);
    expect(coinGeckoApiService.getCoinsMarkets).toHaveBeenCalledWith({
      perPage: 100,
      page: 1,
    });
  });

  it('throws an error on failed response', async () => {
    vi.mocked(coinGeckoApiService.getCoinsMarkets).mockRejectedValueOnce(
      new Error('API error: 500')
    );

    await expect(fetchTopCoins()).rejects.toThrow('API error: 500');
  });

  it('throws an error on fetch failure', async () => {
    vi.mocked(coinGeckoApiService.getCoinsMarkets).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(fetchTopCoins()).rejects.toThrow('Network error');
  });
});

describe('fetchAssetHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns price history on success', async () => {
    const mockHistory: CoinGeckoMarketChartResponse = {
      prices: [
        [1672531200000, 16500],
        [1672617600000, 16600],
      ],
      market_caps: [
        [1672531200000, 320000000000],
        [1672617600000, 321000000000],
      ],
      total_volumes: [
        [1672531200000, 20000000000],
        [1672617600000, 21000000000],
      ],
    };
    vi.mocked(coinGeckoApiService.getMarketChart).mockResolvedValueOnce(
      mockHistory
    );

    const history = await fetchAssetHistory('bitcoin', 7);

    expect(history).toEqual(mockHistory.prices);
    expect(coinGeckoApiService.getMarketChart).toHaveBeenCalledWith('bitcoin', {
      days: 7,
    });
  });

  it('throws an error on failed response', async () => {
    vi.mocked(coinGeckoApiService.getMarketChart).mockRejectedValueOnce(
      new Error('API error: 404')
    );

    await expect(fetchAssetHistory('nonexistent', 7)).rejects.toThrow(
      'API error: 404'
    );
  });

  it('throws an error on fetch failure', async () => {
    vi.mocked(coinGeckoApiService.getMarketChart).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(fetchAssetHistory('bitcoin', 7)).rejects.toThrow(
      'Network error'
    );
  });
});

describe('fetchGlobalMarketData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    clearGlobalMarketCache();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockGlobalResponse: CoinGeckoGlobalResponse = {
    data: {
      active_cryptocurrencies: 12345,
      upcoming_icos: 0,
      ongoing_icos: 0,
      ended_icos: 0,
      markets: 45678,
      total_market_cap: {
        btc: 1000000000000,
        eth: 500000000000,
        usd: 2500000000000,
      },
      total_volume: {
        btc: 50000000000,
        eth: 30000000000,
        usd: 120000000000,
      },
      market_cap_percentage: {
        btc: 45.234,
        eth: 18.756,
      },
      market_cap_change_percentage_24h_usd: 2.34,
      updated_at: 1625097600,
    },
  };

  it('returns formatted global market data on success', async () => {
    vi.mocked(coinGeckoApiService.getGlobal).mockResolvedValueOnce(
      mockGlobalResponse
    );

    const data = await fetchGlobalMarketData();

    expect(data).toEqual({
      totalMarketCap: 2500000000000,
      totalVolume24h: 120000000000,
      btcDominance: 45.234,
      ethDominance: 18.756,
      marketCapChange24h: 2.34,
      activeCryptocurrencies: 12345,
      markets: 45678,
      updatedAt: 1625097600,
    });
    expect(coinGeckoApiService.getGlobal).toHaveBeenCalledOnce();
  });

  it('uses cached data if within 10 minutes', async () => {
    vi.mocked(coinGeckoApiService.getGlobal).mockResolvedValue(
      mockGlobalResponse
    );

    // First call - fetches from API
    await fetchGlobalMarketData();
    expect(coinGeckoApiService.getGlobal).toHaveBeenCalledTimes(1);

    // Advance time by 9 minutes
    vi.advanceTimersByTime(9 * 60 * 1000);

    // Second call - should use cache
    await fetchGlobalMarketData();
    expect(coinGeckoApiService.getGlobal).toHaveBeenCalledTimes(1);
  });

  it('refetches data if cache expired (> 10 minutes)', async () => {
    vi.mocked(coinGeckoApiService.getGlobal).mockResolvedValue(
      mockGlobalResponse
    );

    // First call
    await fetchGlobalMarketData();
    expect(coinGeckoApiService.getGlobal).toHaveBeenCalledTimes(1);

    // Advance time by 11 minutes
    vi.advanceTimersByTime(11 * 60 * 1000);

    // Second call - should refetch
    await fetchGlobalMarketData();
    expect(coinGeckoApiService.getGlobal).toHaveBeenCalledTimes(2);
  });

  it('throws an error on failed response', async () => {
    vi.mocked(coinGeckoApiService.getGlobal).mockRejectedValueOnce(
      new Error('API error: 500')
    );

    await expect(fetchGlobalMarketData()).rejects.toThrow('API error: 500');
  });
});

describe('fetchCoinCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCategoriesCache();
  });

  const mockBitcoinDetail: CoinGeckoDetailResponse = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    categories: ['Store of Value', 'Layer 1'],
    asset_platform_id: null,
    platforms: {},
    detail_platforms: {},
    block_time_in_minutes: 10,
    hashing_algorithm: 'SHA-256',
    public_notice: null,
    additional_notices: [],
    localization: {},
    description: {},
    links: {
      homepage: [],
      whitepaper: '',
      blockchain_site: [],
      official_forum_url: [],
      chat_url: [],
      announcement_url: [],
      twitter_screen_name: '',
      facebook_username: '',
      bitcointalk_thread_identifier: null,
      telegram_channel_identifier: '',
      subreddit_url: '',
      repos_url: { github: [], bitbucket: [] },
    },
    image: { thumb: '', small: '', large: '' },
    country_origin: '',
    genesis_date: null,
    sentiment_votes_up_percentage: 0,
    sentiment_votes_down_percentage: 0,
    watchlist_portfolio_users: 0,
    market_cap_rank: 1,
    market_data: {
      current_price: {},
      total_value_locked: null,
      mcap_to_tvl_ratio: null,
      fdv_to_tvl_ratio: null,
      roi: null,
      ath: {},
      ath_change_percentage: {},
      ath_date: {},
      atl: {},
      atl_change_percentage: {},
      atl_date: {},
      market_cap: {},
      market_cap_rank: 1,
      fully_diluted_valuation: {},
      total_volume: {},
      high_24h: {},
      low_24h: {},
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      price_change_percentage_7d: 0,
      price_change_percentage_14d: 0,
      price_change_percentage_30d: 0,
      price_change_percentage_60d: 0,
      price_change_percentage_200d: 0,
      price_change_percentage_1y: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      price_change_24h_in_currency: {},
      price_change_percentage_1h_in_currency: {},
      price_change_percentage_24h_in_currency: {},
      price_change_percentage_7d_in_currency: {},
      price_change_percentage_14d_in_currency: {},
      price_change_percentage_30d_in_currency: {},
      price_change_percentage_60d_in_currency: {},
      price_change_percentage_200d_in_currency: {},
      price_change_percentage_1y_in_currency: {},
      market_cap_change_24h_in_currency: {},
      market_cap_change_percentage_24h_in_currency: {},
      total_supply: null,
      max_supply: null,
      circulating_supply: 0,
      last_updated: '',
    },
    community_data: {
      facebook_likes: null,
      twitter_followers: null,
      reddit_average_posts_48h: 0,
      reddit_average_comments_48h: 0,
      reddit_subscribers: 0,
      reddit_accounts_active_48h: 0,
    },
    developer_data: {
      forks: 0,
      stars: 0,
      subscribers: 0,
      total_issues: 0,
      closed_issues: 0,
      pull_requests_merged: 0,
      pull_request_contributors: 0,
      code_additions_deletions_4_weeks: { additions: 0, deletions: 0 },
      commit_count_4_weeks: 0,
      last_4_weeks_commit_activity_series: [],
    },
    public_interest_stats: { alexa_rank: 0, bing_matches: null },
    status_updates: [],
    last_updated: '',
  };

  const mockEthereumDetail: CoinGeckoDetailResponse = {
    ...mockBitcoinDetail,
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    categories: ['Smart Contract Platform', 'Layer 1'],
    market_cap_rank: 2,
  };

  it('should fetch categories for multiple coins', async () => {
    vi.mocked(coinGeckoApiService.getCoinById)
      .mockResolvedValueOnce(mockBitcoinDetail)
      .mockResolvedValueOnce(mockEthereumDetail);

    const result = await fetchCoinCategories(['bitcoin', 'ethereum']);

    expect(result).toEqual({
      bitcoin: ['Store of Value', 'Layer 1'],
      ethereum: ['Smart Contract Platform', 'Layer 1'],
    });
    expect(coinGeckoApiService.getCoinById).toHaveBeenCalledTimes(2);
  });

  it('should use cache for subsequent calls', async () => {
    vi.mocked(coinGeckoApiService.getCoinById).mockResolvedValue(
      mockBitcoinDetail
    );

    // First call
    await fetchCoinCategories(['bitcoin']);
    expect(coinGeckoApiService.getCoinById).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    await fetchCoinCategories(['bitcoin']);
    expect(coinGeckoApiService.getCoinById).toHaveBeenCalledTimes(1);
  });

  it('should fallback to Other when API fails', async () => {
    vi.mocked(coinGeckoApiService.getCoinById).mockRejectedValueOnce(
      new Error('API Error')
    );

    const result = await fetchCoinCategories(['bitcoin']);

    expect(result).toEqual({
      bitcoin: ['Other'],
    });
  });

  it('should handle coins without categories', async () => {
    const mockNoCategories = { ...mockBitcoinDetail, categories: [] };
    vi.mocked(coinGeckoApiService.getCoinById).mockResolvedValueOnce(
      mockNoCategories
    );

    const result = await fetchCoinCategories(['bitcoin']);

    expect(result).toEqual({
      bitcoin: ['Other'],
    });
  });
});
