// src/hooks/__tests__/useCoinList.test.ts
import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useCoinList } from "@hooks/useCoinList";
import * as coinService from "@services/coinService";

describe("useCoinList", () => {
  const mockCoins = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 30000 },
    { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 2000 },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(coinService, "fetchTopCoins").mockResolvedValue(mockCoins);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("fetches coin data on mount", async () => {
    const { result } = renderHook(() => useCoinList());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(0); // only trigger immediate timeout (initial fetch)
      await Promise.resolve(); // let microtasks complete
    });

    expect(result.current.coins).toEqual(mockCoins);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("polls for new data every interval", async () => {
    renderHook(() => useCoinList(60000));

    expect(coinService.fetchTopCoins).toHaveBeenCalledTimes(1);

    await act(() => {
      vi.advanceTimersByTime(60000); // simulate 1 interval
      return Promise.resolve();
    });

    expect(coinService.fetchTopCoins).toHaveBeenCalledTimes(2);
  });

  it("handles fetch errors", async () => {
    vi.spyOn(coinService, "fetchTopCoins").mockRejectedValueOnce(
      new Error("API down")
    );

    const { result } = renderHook(() => useCoinList());

    await act(async () => {
      vi.advanceTimersByTime(0); // only trigger immediate timeout (initial fetch)
      await Promise.resolve(); // let microtasks complete
    });

    expect(result.current.error).toBe("API down");
    expect(result.current.coins).toEqual([]);
  });

  it("does not update coins if data is unchanged", async () => {
    const { result } = renderHook(() => useCoinList(60000));

    await act(async () => {
      vi.advanceTimersByTime(0); // only trigger immediate timeout (initial fetch)
      await Promise.resolve(); // let microtasks complete
    });

    const prevCoins = result.current.coins;

    await act(() => {
      vi.advanceTimersByTime(60000);
      return Promise.resolve();
    });

    expect(result.current.coins).toBe(prevCoins); // === identity check
  });
});
