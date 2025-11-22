import { fetchTopCoins, fetchAssetHistory, fetchGlobalMarketData, clearGlobalMarketCache } from "@services/coinService";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockedFetch = vi.fn();
global.fetch = mockedFetch;

const mockCoins = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
  { id: "ethereum", symbol: "eth", name: "Ethereum" },
];

describe("fetchTopCoins", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("returns formatted coin list on success", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCoins,
    });

    const coins = await fetchTopCoins();

    expect(coins).toEqual([
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    ]);
    expect(mockedFetch).toHaveBeenCalledOnce();
  });

  it("throws an error on failed response", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchTopCoins()).rejects.toThrow("CoinGecko API error: 500");
  });

  it("throws an error on fetch failure", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchTopCoins()).rejects.toThrow("Unable to fetch coin list");
  });
});

describe("fetchAssetHistory", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("returns price history on success", async () => {
    const mockHistory = {
      prices: [
        [1672531200000, 16500],
        [1672617600000, 16600],
      ],
    };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistory,
    });

    const history = await fetchAssetHistory("bitcoin", 7);

    expect(history).toEqual(mockHistory.prices);
    expect(mockedFetch).toHaveBeenCalledOnce();
    expect(mockedFetch).toHaveBeenCalledWith(expect.stringContaining("/api/v3/coins/bitcoin/market_chart"));
  });

  it("throws an error on failed response", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchAssetHistory("nonexistent", 7)).rejects.toThrow("CoinGecko API error: 404");
  });

  it("throws an error on fetch failure", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchAssetHistory("bitcoin", 7)).rejects.toThrow("Unable to fetch asset history");
  });
});

describe("fetchGlobalMarketData", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
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

  it("returns formatted global market data on success", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockGlobalResponse,
    });

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
    expect(mockedFetch).toHaveBeenCalledOnce();
  });

  it("uses cached data if within 10 minutes", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockGlobalResponse,
    });

    // First call - fetches from API
    await fetchGlobalMarketData();
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    // Advance time by 9 minutes
    vi.advanceTimersByTime(9 * 60 * 1000);

    // Second call - should use cache
    await fetchGlobalMarketData();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it("refetches data if cache expired (> 10 minutes)", async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => mockGlobalResponse,
    });

    // First call
    await fetchGlobalMarketData();
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    // Advance time by 11 minutes
    vi.advanceTimersByTime(11 * 60 * 1000);

    // Second call - should refetch
    await fetchGlobalMarketData();
    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });

  it("throws an error on failed response", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchGlobalMarketData()).rejects.toThrow("CoinGecko API error: 500");
  });
});
