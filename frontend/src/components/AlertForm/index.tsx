/**
 * AlertForm Component - Create/Edit price alerts
 * REQ-013-notifications / Backlog Item 24
 */

import React, { useState, useEffect } from 'react';
import type { AlertCondition, CreateAlertInput, PriceAlert } from 'types/alert';
import type { MarketCoin } from 'types/market';

interface AlertFormProps {
  onSubmit: (input: CreateAlertInput) => void;
  onCancel: () => void;
  editAlert?: PriceAlert;
  availableCoins: MarketCoin[];
  portfolioCoins?: MarketCoin[];
  isLoading?: boolean;
}

export default function AlertForm({
  onSubmit,
  onCancel,
  editAlert,
  availableCoins,
  portfolioCoins = [],
  isLoading = false,
}: AlertFormProps) {
  const [selectedCoin, setSelectedCoin] = useState<MarketCoin | null>(null);
  const [condition, setCondition] = useState<AlertCondition>('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form for editing
  useEffect(() => {
    if (editAlert) {
      const coin = availableCoins.find((c) => c.id === editAlert.coinId);
      if (coin) {
        setSelectedCoin(coin);
      }
      setCondition(editAlert.condition);
      setTargetPrice(editAlert.targetPrice.toString());
    }
  }, [editAlert, availableCoins]);

  const filteredCoins = searchQuery
    ? availableCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : portfolioCoins.length > 0
      ? portfolioCoins.slice(0, 5)
      : availableCoins.slice(0, 5);

  const handleCoinSelect = (coin: MarketCoin) => {
    setSelectedCoin(coin);
    setSearchQuery('');
    setShowDropdown(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCoin) {
      setError('Please select a coin');
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    onSubmit({
      coinId: selectedCoin.id,
      coinSymbol: selectedCoin.symbol,
      coinName: selectedCoin.name,
      coinImage: selectedCoin.image,
      condition,
      targetPrice: price,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {editAlert ? 'Edit Alert' : 'Create Price Alert'}
      </h2>

      {/* Coin Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Asset
        </label>
        {selectedCoin ? (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {selectedCoin.image && (
              <img
                src={selectedCoin.image}
                alt={selectedCoin.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedCoin.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ({selectedCoin.symbol.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={() => setSelectedCoin(null)}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear selection"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              placeholder="Search or select asset..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      type="button"
                      onClick={() => handleCoinSelect(coin)}
                      className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      {coin.image && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {coin.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {coin.symbol.toUpperCase()}
                      </span>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {formatPrice(coin.current_price)}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 dark:text-gray-400 text-center">
                    No coins found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Condition Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Alert when price goes
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCondition('above')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              condition === 'above'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ↑ Above
          </button>
          <button
            type="button"
            onClick={() => setCondition('below')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              condition === 'below'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ↓ Below
          </button>
        </div>
      </div>

      {/* Target Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Target Price (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="0.00"
            step="any"
            min="0"
            className="w-full p-3 pl-7 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {selectedCoin && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Current price: {formatPrice(selectedCoin.current_price)}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : editAlert ? 'Update Alert' : 'Create Alert'}
        </button>
      </div>
    </form>
  );
}
