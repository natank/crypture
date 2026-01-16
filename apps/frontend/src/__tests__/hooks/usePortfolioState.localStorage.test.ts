import { renderHook, act, waitFor } from "@testing-library/react";
import * as storage from "@services/localStorageService";
import { CoinInfo } from "@services/coinService";
import { usePortfolioState } from "@hooks/usePortfolioState";
import { Mock } from "vitest";

// Mock CoinInfo
const mockCoinMap = {
  btc: { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
  eth: { id: "ethereum", name: "Ethereum", symbol: "eth" },
} as unknown as Record<string, CoinInfo>;

vi.mock("@services/localStorageService", () => ({
  loadPortfolio: vi.fn(),
  savePortfolio: vi.fn(),
}));

const mockLoadPortfolio = vi.mocked(storage.loadPortfolio);
const mockSavePortfolio = vi.mocked(storage.savePortfolio);

describe("usePortfolioState (localStorage integration)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("initialization", () => {
    test("loads portfolio from localStorage if available", () => {
      // Arrange: mock localStorage with BTC (Bitcoin)
      mockLoadPortfolio.mockReturnValue([
        { asset: "btc", qty: 2 },
        { asset: "eth", qty: 1.5 },
      ]);

      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));

      // Assert: portfolio contains loaded assets
      expect(result.current.portfolio).toEqual([
        {
          coinInfo: mockCoinMap.btc,
          quantity: 2,
        },
        {
          coinInfo: mockCoinMap.eth,
          quantity: 1.5,
        },
      ]);
    });

    test("falls back to empty array if no stored data", () => {
      // Arrange: mock localStorage with undefined
      mockLoadPortfolio.mockReturnValue([]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      expect(result.current.portfolio).toEqual([]);
    });

    test("ignores invalid or unmatched coin symbols", () => {
      // Arrange: mock localStorage with one valid and one invalid asset
      mockLoadPortfolio.mockReturnValue([
        { asset: "btc", qty: 2 }, // valid
        { asset: "doge", qty: 5 }, // invalid (not in mockCoinMap)
      ]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      // Only the valid asset should be loaded
      expect(result.current.portfolio).toEqual([
        {
          coinInfo: mockCoinMap.btc,
          quantity: 2,
        },
      ]);
    });
  });

  describe("portfolio mutations", () => {
    test("saves to localStorage after adding an asset", () => {
      mockLoadPortfolio.mockReturnValue([]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.addAsset({ coinInfo: mockCoinMap.eth, quantity: 1 });
      });
      expect(mockSavePortfolio).toHaveBeenCalledWith([
        { asset: "eth", qty: 1 },
      ]);
    });
    test("saves to localStorage after removing an asset", () => {
      mockLoadPortfolio.mockReturnValue([
        { asset: "btc", qty: 2 },
        { asset: "eth", qty: 1 },
      ]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.removeAsset("bitcoin"); // btc's id
      });
      expect(mockSavePortfolio).toHaveBeenCalledWith([
        { asset: "eth", qty: 1 },
      ]);
    });
    test("saves to localStorage after resetting the portfolio", () => {
      mockLoadPortfolio.mockReturnValue([{ asset: "btc", qty: 2 }]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.resetPortfolio();
      });
      expect(mockSavePortfolio).toHaveBeenCalledWith([]);
    });
    test("saves to localStorage after deleting the last asset", () => {
      mockLoadPortfolio.mockReturnValue([{ asset: "btc", qty: 2 }]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.removeAsset("bitcoin"); // Remove the only asset
      });
      expect(result.current.portfolio).toEqual([]);
      expect(mockSavePortfolio).toHaveBeenCalledWith([]);
    });
    test("does NOT call savePortfolio before hydration completes (no race)", async () => {
      mockLoadPortfolio.mockReturnValue([{ asset: "btc", qty: 2 }]);
      let isLoading = true;
      let coinMap = {};
      const { result, rerender } = renderHook(
        ({ loading, map }) => usePortfolioState({}, map, loading),
        { initialProps: { loading: isLoading, map: coinMap } }
      );
      // Do NOT mutate before hydration
      // savePortfolio should NOT be called yet
      expect(mockSavePortfolio).not.toHaveBeenCalled();
      // Now finish hydration
      act(() => {
        isLoading = false;
        coinMap = mockCoinMap;
        rerender({ loading: isLoading, map: coinMap });
      });
      // Now mutate after hydration
      act(() => {
        result.current.addAsset({ coinInfo: mockCoinMap.eth, quantity: 2 });
      });
      await waitFor(() => {
        expect(mockSavePortfolio).toHaveBeenCalledWith([
          { asset: "btc", qty: 2 },
          { asset: "eth", qty: 2 },
        ]);
      });
    });

    test("resets portfolio and saves empty array", () => {
      mockLoadPortfolio.mockReturnValue([{ asset: "btc", qty: 2 }]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.resetPortfolio();
      });
      expect(mockSavePortfolio).toHaveBeenCalledWith([]);
    });
  });

  describe("data structure", () => {
    test("serializes portfolio to { asset, qty }[] format", () => {
      mockLoadPortfolio.mockReturnValue([]);
      const { result } = renderHook(() => usePortfolioState({}, mockCoinMap));
      act(() => {
        result.current.addAsset({ coinInfo: mockCoinMap.btc, quantity: 3 });
        result.current.addAsset({ coinInfo: mockCoinMap.eth, quantity: 1.5 });
      });
      // Find the last call to savePortfolio
      const calls = mockSavePortfolio.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toEqual(
        expect.arrayContaining([
          { asset: "btc", qty: 3 },
          { asset: "eth", qty: 1.5 },
        ])
      );
      // Ensure all entries have correct keys
      lastCall.forEach((entry: any) => {
        expect(entry).toHaveProperty("asset");
        expect(entry).toHaveProperty("qty");
      });
    });
  });
});
