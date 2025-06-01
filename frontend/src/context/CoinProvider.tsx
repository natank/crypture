// src/context/CoinProvider.tsx
import React, { useMemo } from "react";
import { CoinContext } from "./CoinContext";
import { useCoinSearch } from "@hooks/useCoinSearch";

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { coins, loading, error, search, setSearch, originalCoins, priceMap } =
    useCoinSearch();

  const value = useMemo(
    () => ({
      coins,
      loading,
      error,
      search,
      setSearch,
      originalCoins,
      priceMap,
    }),
    [coins, loading, error, search, setSearch, originalCoins, priceMap]
  );

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
};
