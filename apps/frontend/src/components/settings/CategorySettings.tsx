import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface CategorySettingsProps {
  className?: string;
}

export function CategorySettings({ className = '' }: CategorySettingsProps) {
  const { settings, updateSettings } = useSettings();

  const handleToggleChange = (showAll: boolean) => {
    updateSettings({ showAllCategories: showAll });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Category Display
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose how categories are displayed in portfolio composition
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="categoryDisplay"
            id="filtered-categories"
            data-testid="filtered-categories"
            checked={!settings.showAllCategories}
            onChange={() => handleToggleChange(false)}
            className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Core Categories Only
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Show only coin characteristics (recommended)
            </p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="categoryDisplay"
            id="all-categories"
            data-testid="all-categories"
            checked={settings.showAllCategories}
            onChange={() => handleToggleChange(true)}
            className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              All Categories
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Include index funds and investment categories
            </p>
          </div>
        </label>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          <span className="font-medium">Core Categories:</span> Layer 1, Proof
          of Work, Smart Contract Platform, etc.
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          <span className="font-medium">Index Categories:</span> GMCI Index,
          Coinbase 50, FTX Holdings, etc.
        </p>
      </div>
    </div>
  );
}
