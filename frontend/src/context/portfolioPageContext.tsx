import React, { createContext, useContext } from "react";
import { usePortfolio } from "@hooks/usePortfolio";

const PortfolioPageContext = createContext<ReturnType<
  typeof usePortfolio
> | null>(null);

export const PortfolioPageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const portfolio = usePortfolio();
  return (
    <PortfolioPageContext.Provider value={portfolio}>
      {children}
    </PortfolioPageContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioPageContext);
  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within a PortfolioPageProvider"
    );
  }
  return context;
};
