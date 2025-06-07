// src/context/useCoinContext.ts
import { useContext } from "react";
import { CoinContext, type CoinContextType } from "@context/CoinContext";

export const useCoinContext = (): CoinContextType & {
  getPriceBySymbol: (symbol: string) => number | undefined;
} => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoinContext must be used within a <CoinProvider>");
  }

  const getPriceBySymbol = (symbol: string): number | undefined => {
    return context.priceMap[symbol.toLowerCase()];
  };

  return {
    ...context,
    getPriceBySymbol,
  };
};
