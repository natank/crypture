// src/context/CoinProvider.tsx
import React, { useMemo } from "react";
import { CoinContext } from "./CoinContext";
import { useCoinSearch } from "@hooks/useCoinSearch";

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { coins, loading, error, search, setSearch, originalCoins } =
    useCoinSearch();

  const value = useMemo(
    () => ({ coins, loading, error, search, setSearch, originalCoins }),
    [coins, loading, error, search, setSearch, originalCoins]
  );

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
};
