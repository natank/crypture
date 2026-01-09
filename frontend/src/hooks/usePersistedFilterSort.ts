import { useEffect, useRef } from "react";
import { useFilterSort } from "@hooks/useFilterSort";
import { PortfolioAsset } from "@hooks/usePortfolioState";

const FILTER_SORT_STORAGE_KEY = 'portfolio_filter_sort';

interface FilterSortState {
  filter: string;
  sort: string;
}

/**
 * Enhanced version of useFilterSort that persists state to sessionStorage.
 * Wraps the original useFilterSort hook and adds persistence layer.
 * 
 * This follows the DRY principle by reusing all filter/sort logic from useFilterSort
 * and only adding the persistence concern as a separate layer.
 */
export function usePersistedFilterSort(
  assets: PortfolioAsset[],
  defaultSort: string = "name-asc",
  defaultFilter: string = ""
) {
  const isHydrated = useRef(false);
  
  // Load initial state from sessionStorage
  const loadInitialState = (): FilterSortState => {
    if (typeof window === 'undefined') {
      return { filter: defaultFilter, sort: defaultSort };
    }
    
    try {
      const saved = sessionStorage.getItem(FILTER_SORT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FilterSortState;
        
        // Validate sort option
        const validSorts = ['name-asc', 'name-desc', 'value-asc', 'value-desc'];
        const sort = validSorts.includes(parsed.sort) ? parsed.sort : defaultSort;
        const filter = typeof parsed.filter === 'string' ? parsed.filter : defaultFilter;
        
        return { filter, sort };
      }
    } catch (error) {
      console.error('Failed to load filter/sort state:', error);
    }
    
    return { filter: defaultFilter, sort: defaultSort };
  };

  const initialState = loadInitialState();
  
  // Use the original useFilterSort hook with loaded initial values
  const filterSortResult = useFilterSort(
    assets,
    initialState.sort,
    initialState.filter
  );

  // Persist state changes to sessionStorage
  useEffect(() => {
    // Skip first render (hydration)
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }

    try {
      const state: FilterSortState = {
        filter: filterSortResult.filterText,
        sort: filterSortResult.sortOption,
      };
      sessionStorage.setItem(FILTER_SORT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save filter/sort state:', error);
      // Fail silently - app continues to work without persistence
    }
  }, [filterSortResult.filterText, filterSortResult.sortOption]);

  // Return the same interface as useFilterSort
  return filterSortResult;
}
