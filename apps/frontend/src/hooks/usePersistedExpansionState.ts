import { useState, useEffect, useRef, useCallback } from "react";

const EXPANSION_STORAGE_KEY = 'portfolio_expansion_state';

interface ExpansionState {
  expandedAssets: string[];
}

export interface UsePersistedExpansionStateResult {
  expandedAssets: string[];
  toggleExpansion: (assetId: string) => void;
  isExpanded: (assetId: string) => boolean;
  clearExpansion: () => void;
}

/**
 * Hook for persisting asset row expansion state to sessionStorage.
 * Follows the same pattern as usePersistedFilterSort for consistency.
 * 
 * Strategy:
 * 1. Load initial state from sessionStorage on mount
 * 2. Filter out stale asset IDs that no longer exist
 * 3. Save state changes to sessionStorage (after hydration)
 * 4. Provide toggle, check, and clear functions
 * 
 * @param validAssetIds - Array of currently valid asset IDs to filter stale entries
 */
export function usePersistedExpansionState(
  validAssetIds: string[]
): UsePersistedExpansionStateResult {
  const isHydrated = useRef(false);
  
  // Load initial state from sessionStorage
  // Note: Don't filter by validAssetIds here because it might be empty on first render
  // The useEffect below will filter once validAssetIds is populated
  const loadInitialState = (): string[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const saved = sessionStorage.getItem(EXPANSION_STORAGE_KEY);
      
      if (saved) {
        const parsed = JSON.parse(saved) as ExpansionState;
        
        // Validate: must be array of strings
        if (Array.isArray(parsed.expandedAssets)) {
          // Return all saved assets - filtering will happen in useEffect
          return parsed.expandedAssets.filter(id => typeof id === 'string');
        }
      }
    } catch (error) {
      console.error('Failed to load expansion state:', error);
    }
    
    return [];
  };

  const [expandedAssets, setExpandedAssets] = useState<string[]>(loadInitialState);

  // Re-validate expansion state when validAssetIds changes
  // This handles the case where portfolio loads after the hook initializes
  useEffect(() => {
    // Skip if validAssetIds is empty (portfolio not loaded yet)
    if (validAssetIds.length === 0) return;
    
    setExpandedAssets(prev => {
      // Filter out any asset IDs that are no longer valid
      const filtered = prev.filter(id => validAssetIds.includes(id));
      // Return filtered array only if it changed
      return JSON.stringify(filtered) !== JSON.stringify(prev) ? filtered : prev;
    });
  }, [validAssetIds]);

  // Persist state changes to sessionStorage
  useEffect(() => {
    // Skip first render (hydration)
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }

    try {
      const state: ExpansionState = {
        expandedAssets,
      };
      sessionStorage.setItem(EXPANSION_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save expansion state:', error);
    }
  }, [expandedAssets]);

  const toggleExpansion = useCallback((assetId: string) => {
    setExpandedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  }, []);

  const isExpanded = useCallback((assetId: string) => {
    return expandedAssets.includes(assetId);
  }, [expandedAssets]);

  const clearExpansion = useCallback(() => {
    setExpandedAssets([]);
  }, []);

  return {
    expandedAssets,
    toggleExpansion,
    isExpanded,
    clearExpansion,
  };
}
