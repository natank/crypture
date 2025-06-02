import { CoinContext, CoinContextType } from "@context/CoinContext";
import React from "react";
// import { CoinContext, CoinContextValue } from "@/context/useCoinContext"; // Adjust import path as needed

type Props = {
  children: React.ReactNode;
  value?: Partial<CoinContextType>;
};

const defaultCoins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 30000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 2000 },
];

const defaultValue: CoinContextType = {
  coins: defaultCoins,
  originalCoins: defaultCoins,
  priceMap: {
    bitcoin: 30000,
    ethereum: 2000,
  },
  loading: false,
  error: null,
  search: "",
  setSearch: () => {},
};

export const MockCoinProvider = ({ children, value }: Props) => {
  return (
    <CoinContext.Provider value={{ ...defaultValue, ...value }}>
      {children}
    </CoinContext.Provider>
  );
};
