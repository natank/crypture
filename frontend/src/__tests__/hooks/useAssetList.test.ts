import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAssetList } from "@hooks/useAssetList";
import * as coinGecko from "@services/coinGecko";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
];

describe("useAssetList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and returns filtered coins", async () => {
    vi.spyOn(coinGecko, "fetchTopCoins").mockResolvedValue(mockCoins);

    const { result } = renderHook(() => useAssetList());

    expect(result.current.loading).toBe(true);

    // wait for useEffect to complete
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.coins).toHaveLength(3);

    act(() => {
      result.current.setSearch("bit");
    });

    expect(result.current.coins).toEqual([
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    ]);
  });

  it("handles API error gracefully", async () => {
    vi.spyOn(coinGecko, "fetchTopCoins").mockRejectedValue(
      new Error("API failure")
    );

    const { result } = renderHook(() => useAssetList());

    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("API failure");
    expect(result.current.coins).toEqual([]);
  });
});
