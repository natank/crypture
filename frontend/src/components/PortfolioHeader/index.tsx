import React from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to the root path (landing page)
    navigate('/');
  };

  return (
    <header
      role="banner"
      className={`bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md rounded-b-lg mb-6 ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            onClick={scrollToTop}
            className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
          >
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <img
                className="h-8 w-auto"
                src="/logo/svg/crypture-logo-negative-space-monochrome.svg"
                alt="Crypture"
              />
            </div>
            <span className="text-xl font-bold text-white">
              Crypture
            </span>
          </a>
          <span className="hidden md:inline-block text-sm text-white/80 font-medium">
            Track your crypto clearly
          </span>
        </div>

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
