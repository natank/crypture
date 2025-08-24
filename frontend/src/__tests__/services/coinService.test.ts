import { fetchTopCoins, fetchAssetHistory } from "@services/coinService";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
