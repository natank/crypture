// src/hooks/useCoinSearch.ts
import { useState, useMemo } from "react";
import { type CoinInfo } from "@services/coinService";

export function useCoinSearch(coins: CoinInfo[]) {
  const [search, setSearch] = useState("");

  const filteredCoins = useMemo(() => {
    const term = search.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  }, [search, coins]);

  return {
    search,
    setSearch,
    filteredCoins,
  };
}
