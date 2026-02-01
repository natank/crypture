import { useState, useEffect } from 'react';
import { fetchCoinCategories } from '@services/coinService';

export type CoinCategoriesState = {
  categories: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to fetch categories for portfolio coins.
 * Fetches categories from /coins/{id} endpoint when coin IDs change.
 * Used by PortfolioPage for category allocation analysis.
 */
export function useCoinCategories(coinIds: string[]): CoinCategoriesState {
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCoinIds = [...new Set(coinIds)];
    if (uniqueCoinIds.length === 0) {
      setCategories({});
      return;
    }

    let cancelled = false;

    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchCoinCategories(uniqueCoinIds);
        if (!cancelled) {
          setCategories(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load coin categories'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [coinIds.join(',')]);

  return { categories, isLoading, error };
}
