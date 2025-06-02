import { CoinContext, CoinContextType } from "@context/CoinContext";
import React from "react";
import { mockCoinContextValue } from "./fixtures";

type Props = {
  children: React.ReactNode;
  value?: Partial<CoinContextType>;
};

export const MockCoinProvider = ({ children, value }: Props) => {
  return (
    <CoinContext.Provider value={{ ...mockCoinContextValue, ...value }}>
      {children}
    </CoinContext.Provider>
  );
};
