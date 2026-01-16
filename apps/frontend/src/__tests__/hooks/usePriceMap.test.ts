// src/hooks/__tests__/usePriceMap.test.ts
import { renderHook } from "@testing-library/react";
import { usePriceMap } from "@hooks/usePriceMap";
import { CoinInfo } from "@services/coinService";

describe("usePriceMap", () => {
  it("returns a symbol-to-price map from valid coins", () => {
    const coins = [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 30000 },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 2000 },
    ];

    const { result } = renderHook(() => usePriceMap(coins));

    expect(result.current).toEqual({
      btc: 30000,
      eth: 2000,
    });
  });

  it("skips coins with missing or invalid prices", () => {
    const coins: CoinInfo[] = [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 30000 },
      { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", current_price: NaN },
      {
        id: "ripple",
        name: "Ripple",
        symbol: "XRP",
        current_price: undefined as unknown as number,
      },
    ] as unknown as CoinInfo[];

    const { result } = renderHook(() => usePriceMap(coins));

    expect(result.current).toEqual({
      btc: 30000,
    });
  });

  it("returns an empty object when given an empty list", () => {
    const { result } = renderHook(() => usePriceMap([]));
    expect(result.current).toEqual({});
  });

  it("memoizes output unless input list changes", () => {
    const coins = [
      { symbol: "BTC", current_price: 30000 },
    ] as unknown as CoinInfo[];

    const { result, rerender } = renderHook(({ coins }) => usePriceMap(coins), {
      initialProps: { coins },
    });

    const firstMap = result.current;

    rerender({ coins });

    expect(result.current).toBe(firstMap); // === identity check
  });
  it("recomputes output if coins ref changes", () => {
    const initialCoins = [
      { symbol: "BTC", current_price: 30000 },
    ] as unknown as CoinInfo[];
    const updatedCoins = [
      { symbol: "BTC", current_price: 30000 },
    ] as unknown as CoinInfo[]; // different object

    const { result, rerender } = renderHook(({ coins }) => usePriceMap(coins), {
      initialProps: { coins: initialCoins },
    });

    const firstMap = result.current;

    rerender({ coins: updatedCoins });

    expect(result.current).not.toBe(firstMap); // new object computed
    expect(result.current).toStrictEqual(firstMap); // still equal in content
  });
});
