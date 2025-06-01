// src/__tests__/hooks/useCoinSearch.test.ts

import { renderHook, waitFor } from "@testing-library/react";
import { useCoinSearch } from "@hooks/useCoinSearch"; // Adjust path as needed
import * as coinService from "@services/coinService"; // Adjust path if needed

describe("useCoinSearch – priceMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns empty price map when no coins are loaded", async () => {
    // Arrange: mock fetchTopCoins to return an empty array
    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValue([]);

    // Act: render the hook
    const { result } = renderHook(() => useCoinSearch());

    // Wait until loading is false
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert: priceMap is an empty object
    expect(result.current.priceMap).toEqual({});
  });

  test("maps each coin's id to its current price", async () => {
    // Arrange: mock fetchTopCoins with predefined coin list
    const mockCoins = [
      { id: "btc", name: "Bitcoin", symbol: "BTC", current_price: 30000 },
      { id: "eth", name: "Ethereum", symbol: "ETH", current_price: 2000 },
    ];

    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValue(mockCoins);

    // Act: render the hook
    const { result } = renderHook(() => useCoinSearch());

    // Wait until loading is false
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert: priceMap contains correct values
    expect(result.current.priceMap).toEqual({
      btc: 30000,
      eth: 2000,
    });
  });

  test("updates price map when coin list changes", async () => {
    const mockFirstList = [
      { id: "btc", name: "Bitcoin", symbol: "BTC", current_price: 30000 },
    ];

    const mockSecondList = [
      { id: "eth", name: "Ethereum", symbol: "ETH", current_price: 2000 },
    ];

    // First render with BTC
    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValueOnce(mockFirstList);
    const { result, unmount } = renderHook(() => useCoinSearch());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.priceMap).toEqual({ btc: 30000 });

    // Unmount and re-mount with ETH
    unmount();
    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValueOnce(
      mockSecondList
    );
    const { result: result2 } = renderHook(() => useCoinSearch());
    await waitFor(() => expect(result2.current.loading).toBe(false));
    expect(result2.current.priceMap).toEqual({ eth: 2000 });
  });

  test("returns undefined for missing prices", async () => {
    const mockCoins: Partial<coinService.CoinInfo>[] = [
      {
        id: "btc",
        name: "Bitcoin",
        symbol: "BTC",
        // current_price intentionally omitted
      },
    ];

    // Cast as CoinInfo[] since the hook expects it
    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValue(
      mockCoins as coinService.CoinInfo[]
    );

    const { result } = renderHook(() => useCoinSearch());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.priceMap).toEqual({ btc: undefined });
  });
});
