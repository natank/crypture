// src/context/CoinProvider.tsx
import React, { useMemo } from "react";
import { CoinContext } from "./CoinContext";
import { useCoinList } from "@hooks/useCoinList";
import { usePriceMap } from "@hooks/usePriceMap";
import { useCoinSearch } from "@hooks/useCoinSearch";

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { coins: originalCoins, loading, error } = useCoinList(); // fetch + polling
  const priceMap = usePriceMap(originalCoins); // stable price mapping
  const { search, setSearch, filteredCoins } = useCoinSearch(originalCoins); // search logic

  const value = useMemo(
    () => ({
      coins: filteredCoins,
      originalCoins,
      priceMap,
      search,
      setSearch,
      loading,
      error,
    }),
    [filteredCoins, originalCoins, priceMap, search, setSearch, loading, error]
  );

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
};
