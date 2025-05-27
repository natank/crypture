import React, { createContext } from "react";
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
