import React from "react";
import { Link } from "react-router-dom";

type PortfolioHeaderProps = {
  totalValue?: string | number | null;
  lastUpdatedAt?: number | null;
  className?: string;
};

export default function PortfolioHeader({
  totalValue = null,
  lastUpdatedAt = null,
  className,
}: PortfolioHeaderProps) {
  const formattedValue =
    totalValue != null && !isNaN(Number(totalValue))
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(totalValue))
      : "—";

  const relativeTime = lastUpdatedAt
    ? `${Math.floor((Date.now() - lastUpdatedAt) / 1000)}s ago`
    : null;

  return (
    <header
      role="banner"
      className={`bg-brand-gradient text-white shadow-md rounded-b-lg mb-6 ${className}`}
    >
      <div className="w-full max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-brand flex items-center gap-3 text-2xl">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-3xl">🔐</span>
            <span>Crypture</span>
            <span className="text-sm text-white/80 font-subtle ml-2">
              Track your crypto clearly
            </span>
          </Link>
        </h1>

        <div className="text-right">
          <div
            className="text-xl font-brand text-white flex items-center gap-2"
            data-testid="total-value"
            aria-live="polite"
          >
            💰 <span>Total Portfolio Value: {formattedValue}</span>
          </div>

          {relativeTime && (
            <p
              className="text-sm text-white/70 font-medium mt-1"
              aria-label={`Last updated ${relativeTime}`}
            >
              Last updated: {relativeTime}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
