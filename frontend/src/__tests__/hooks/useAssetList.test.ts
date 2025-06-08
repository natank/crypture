import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCoinSearch } from "@hooks/useCoinSearch";

const mockCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 2000 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 2000 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", current_price: 2000 },
];

describe("useCoinSearch", () => {
  it("filters coins by search term (case-insensitive)", () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    act(() => {
      result.current.setSearch("bit");
    });

    expect(result.current.filteredCoins).toEqual([
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 2000 },
    ]);
  });

  it("returns all coins when search is empty", () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    expect(result.current.filteredCoins).toEqual(mockCoins);
  });

  it("returns no coins if nothing matches", () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    act(() => {
      result.current.setSearch("zzz");
    });

    expect(result.current.filteredCoins).toEqual([]);
  });
});
