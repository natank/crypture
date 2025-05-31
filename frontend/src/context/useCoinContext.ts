// src/context/useCoinContext.ts
import { useContext } from "react";
import { CoinContext, type CoinContextType } from "./CoinContext";

export const useCoinContext = (): CoinContextType => {
  const context = useContext(CoinContext);
  if (!context) {
    return {
      coins: [],
      loading: false,
      error: null,
      search: "",
      setSearch: () => {},
      originalCoins: [],
    };
  }
  return context;
};
