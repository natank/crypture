import React from 'react';
import { useTrendingCoins } from '@hooks/useTrendingCoins';

export const TrendingSection: React.FC = () => {
  const { data, isLoading, error } = useTrendingCoins();

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🔥 Trending Coins (24h)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse h-20"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading trending coins.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        🔥 Trending Coins (24h)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.slice(0, 8).map((coin) => (
          <div
            key={coin.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <span className="text-gray-400 font-bold text-lg w-6 text-center">
              {coin.market_cap_rank || '-'}
            </span>
            <img
              src={coin.thumb}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-gray-900 truncate">
                {coin.name}
              </span>
              <span className="text-sm text-gray-500">{coin.symbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
