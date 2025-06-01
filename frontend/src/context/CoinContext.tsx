// src/context/CoinContext.tsx
import { CoinInfo } from "@services/coinService";
import { createContext } from "react";

export type CoinContextType = {
  coins: CoinInfo[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  originalCoins: CoinInfo[];
  priceMap: Record<string, number | undefined>;
};

export const CoinContext = createContext<CoinContextType | undefined>(
  undefined
);
