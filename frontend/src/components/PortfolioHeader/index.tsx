import React from "react";

type PortfolioHeaderProps = {
  totalValue?: string | null; // string formatted like "$12,345.67"
};

export default function PortfolioHeader({ totalValue }: PortfolioHeaderProps) {
  return (
    <header role="banner">
      <h1 className="text-xl font-semibold text-gray-900">
        💰 Total Portfolio Value:{" "}
        {totalValue != null && !isNaN(Number(totalValue))
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(totalValue))
          : "—"}
      </h1>
    </header>
  );
}
