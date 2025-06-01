// src/context/useCoinContext.ts
import { useContext } from "react";
import { CoinContext, type CoinContextType } from "@context/CoinContext";

export const useCoinContext = (): CoinContextType => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error("useCoinContext must be used within a <CoinProvider>");
  }

  return context;
};
