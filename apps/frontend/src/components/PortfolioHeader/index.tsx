import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AlertButton from '@components/AlertButton';

type PortfolioHeaderProps = {
  totalValue?: string | number | null;
  lastUpdatedAt?: number | null;
  className?: string;
  alertCount?: { active: number; triggered: number };
  onAlertsClick?: () => void;
};

export default function PortfolioHeader({
  totalValue = null,
  lastUpdatedAt = null,
  className,
  alertCount = { active: 0, triggered: 0 },
  onAlertsClick,
}: PortfolioHeaderProps) {
  const formattedValue =
    totalValue != null && !isNaN(Number(totalValue))
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(Number(totalValue))
      : null;

  const relativeTime = lastUpdatedAt
    ? `${Math.floor((Date.now() - lastUpdatedAt) / 1000)}s ago`
    : null;

  const navigate = useNavigate();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header
      role="banner"
      className={`bg-gradient-to-r from-[#00bfa5] to-[#5a31f4] text-white shadow-md rounded-b-lg mb-6 ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-8">
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
            <span className="text-xl font-bold text-white">Crypture</span>
          </a>

          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/market"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              Market
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Alert Button */}
          {onAlertsClick && (
            <AlertButton
              activeCount={alertCount.active}
              triggeredCount={alertCount.triggered}
              onClick={onAlertsClick}
            />
          )}

          <div className="text-right">
            {formattedValue ? (
              <div
                className="text-xl font-brand text-white flex items-center gap-2"
                data-testid="total-value"
                aria-live="polite"
              >
                💰 <span>Total Portfolio Value: {formattedValue}</span>
              </div>
            ) : (
              <div className="h-7"></div> // Spacer
            )}

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
      </div>
    </header>
  );
}
