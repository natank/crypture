import React from "react";
import { usePortfolio } from "@hooks/usePortfolio";
import { PortfolioPageContext } from "./usePortfolioContext";

const PortfolioPageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { portfolio, addAsset, removeAsset, resetPortfolio } = usePortfolio();

  return (
    <PortfolioPageContext.Provider
      value={{ portfolio, addAsset, removeAsset, resetPortfolio }}
    >
      {children}
    </PortfolioPageContext.Provider>
  );
};

export default PortfolioPageProvider;
