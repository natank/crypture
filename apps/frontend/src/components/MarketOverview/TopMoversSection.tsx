import React from 'react';
import { useTopMovers } from '@hooks/useTopMovers';
import { formatCurrency, formatPercentage } from '@utils/formatters';
import { MarketMover } from 'types/market';

export const TopMoversSection: React.FC = () => {
  const { gainers, losers, isLoading, error } = useTopMovers();

  if (isLoading) {
    return (
      <div
        data-testid="top-movers-loading"
        className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse"
      >
        <div className="h-64 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) return null;

  const renderList = (
    title: string,
    items: MarketMover[],
    isGainer: boolean
  ) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3
        className={`text-lg font-bold mb-4 ${isGainer ? 'text-green-600' : 'text-red-600'}`}
      >
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-2 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div>
                <div
                  data-testid="coin-symbol"
                  className="font-bold text-gray-900"
                >
                  {coin.symbol.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 hidden sm:inline">
                  {coin.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {formatCurrency(coin.current_price)}
              </div>
              <div
                data-testid="price-change"
                className={`text-sm font-bold ${isGainer ? 'text-green-600' : 'text-red-600'}`}
              >
                {isGainer ? '+' : ''}
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      data-testid="top-movers-section"
      className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {renderList('🚀 Top Gainers', gainers, true)}
      {renderList('📉 Top Losers', losers, false)}
    </div>
  );
};
