import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistedFilterSort } from '@hooks/usePersistedFilterSort';
import { PortfolioAsset } from '@hooks/usePortfolioState';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const STORAGE_KEY = 'portfolio_filter_sort';

const mockAssets: PortfolioAsset[] = [
  {
    coinInfo: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 50000,
    },
    quantity: 1,
  },
  {
    coinInfo: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3000,
    },
    quantity: 10,
  },
  {
    coinInfo: {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      current_price: 0.5,
    },
    quantity: 1000,
  },
];

describe('usePersistedFilterSort', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('uses default values when no saved state exists', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      expect(result.current.filterText).toBe('');
      expect(result.current.sortOption).toBe('name-asc');
    });

    it('loads saved state from sessionStorage', () => {
      mockSessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filter: 'bit', sort: 'value-desc' })
      );

      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      expect(result.current.filterText).toBe('bit');
      expect(result.current.sortOption).toBe('value-desc');
    });

    it('validates sort option and falls back to default for invalid values', () => {
      mockSessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filter: 'test', sort: 'invalid-sort' })
      );

      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      expect(result.current.filterText).toBe('test');
      expect(result.current.sortOption).toBe('name-asc'); // Falls back to default
    });

    it('handles corrupted JSON gracefully', () => {
      mockSessionStorage.setItem(STORAGE_KEY, 'not-valid-json');

      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      expect(result.current.filterText).toBe('');
      expect(result.current.sortOption).toBe('name-asc');
    });
  });

  describe('State Persistence', () => {
    it('saves filter changes to sessionStorage', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setFilterText('ethereum');
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ filter: 'ethereum', sort: 'name-asc' })
      );
    });

    it('saves sort changes to sessionStorage', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setSortOption('value-desc');
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ filter: '', sort: 'value-desc' })
      );
    });

    it('does not save on initial render (hydration)', () => {
      mockSessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filter: 'test', sort: 'value-asc' })
      );

      renderHook(() => usePersistedFilterSort(mockAssets));

      // Should only have the initial setItem call, not a save from the hook
      expect(mockSessionStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Filter/Sort Functionality', () => {
    it('filters assets by name', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setFilterText('bit');
      });

      expect(result.current.sortedFilteredAssets).toHaveLength(1);
      expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
        'Bitcoin'
      );
    });

    it('sorts assets by name ascending', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setSortOption('name-asc');
      });

      expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
        'Bitcoin'
      );
      expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
        'Cardano'
      );
      expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
        'Ethereum'
      );
    });

    it('sorts assets by name descending', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setSortOption('name-desc');
      });

      expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
        'Ethereum'
      );
      expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
        'Cardano'
      );
      expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
        'Bitcoin'
      );
    });

    it('sorts assets by value descending', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setSortOption('value-desc');
      });

      // Bitcoin: 1 * 50000 = 50000
      // Ethereum: 10 * 3000 = 30000
      // Cardano: 1000 * 0.5 = 500
      expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
        'Bitcoin'
      );
      expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
        'Ethereum'
      );
      expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
        'Cardano'
      );
    });

    it('sorts assets by value ascending', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      act(() => {
        result.current.setSortOption('value-asc');
      });

      expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
        'Cardano'
      );
      expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
        'Ethereum'
      );
      expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
        'Bitcoin'
      );
    });
  });

  describe('API Compatibility', () => {
    it('returns the same interface as useFilterSort', () => {
      const { result } = renderHook(() => usePersistedFilterSort(mockAssets));

      expect(result.current).toHaveProperty('sortedFilteredAssets');
      expect(result.current).toHaveProperty('sortOption');
      expect(result.current).toHaveProperty('setSortOption');
      expect(result.current).toHaveProperty('filterText');
      expect(result.current).toHaveProperty('setFilterText');
    });
  });
});
