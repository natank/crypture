import { createContext, useContext } from "react";
import type { PortfolioState, PortfolioAsset } from "@hooks/usePortfolio";

type PortfolioContextType = {
  portfolio: PortfolioState;
  addAsset: (newAsset: PortfolioAsset) => void;
  removeAsset: (assetId: string) => void;
  resetPortfolio: () => void;
};

export const PortfolioPageContext = createContext<PortfolioContextType | null>(
  null
);

export const usePortfolioContext = (): PortfolioContextType => {
  const context = useContext(PortfolioPageContext);
  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within a PortfolioPageProvider"
    );
  }
  return context;
};
