import {
  fetchTopCoins,
  fetchAssetHistory,
  fetchGlobalMarketData,
  clearGlobalMarketCache,
} from '@services/coinService';
import { coinGeckoApiService } from '@services/coinGeckoApiService';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

const mockCoins = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 50000 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3000 },
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
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 3000 },
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
    const mockHistory = {
      prices: [
        [1672531200000, 16500],
        [1672617600000, 16600],
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

  const mockGlobalResponse = {
    data: {
      total_market_cap: { usd: 2500000000000 },
      total_volume: { usd: 120000000000 },
      market_cap_percentage: { btc: 45.234, eth: 18.756 },
      market_cap_change_percentage_24h_usd: 2.34,
      active_cryptocurrencies: 12345,
      markets: 45678,
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
