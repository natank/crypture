# Refactoring Guide 3: Stabilize Callbacks in PortfolioPage

**Priority:** 🔴 CRITICAL  
**Impact:** High  
**Effort:** Medium  
**Files to Modify:** 1

---

## Problem

Event handlers in `PortfolioPage` are recreated on every render, causing:
1. Child components to receive new callback references
2. React.memo optimizations to fail
3. Unnecessary re-renders throughout the component tree

---

## Current Code

**File:** `/frontend/src/pages/PortfolioPage.tsx`

```tsx
export default function PortfolioPage() {
  const { coins: allCoins, loading, error, lastUpdatedAt, refreshing, retry } = useCoinList();
  const priceMap = usePriceMap(allCoins);
  // ... other hooks ...

  // ❌ New function created on EVERY render
  const triggerHighlight = (assetId: string) => {
    setHighlightTriggers(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + 1,
    }));
  };

  // ❌ New function created on EVERY render
  const handleAddAsset = (asset: { coinInfo: CoinInfo; quantity: number }) => {
    addAsset(asset);
    triggerHighlight(asset.coinInfo.id);
  };

  // ❌ New function created on EVERY render
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateAssetQuantity(id, newQuantity);
    triggerHighlight(id);
  };

  // ... more handlers ...
}
```

---

## Optimized Code

**File:** `/frontend/src/pages/PortfolioPage.tsx`

```tsx
import { useMemo, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
// ... other imports ...

export default function PortfolioPage() {
  const { coins: allCoins, loading, error, lastUpdatedAt, refreshing, retry } = useCoinList();
  const priceMap = usePriceMap(allCoins);
  const { search, setSearch, filteredCoins } = useCoinSearch(allCoins);

  const coinMap = useMemo(() => {
    const map: Record<string, CoinInfo> = {};
    for (const coin of allCoins) {
      map[coin.symbol.toLowerCase()] = coin;
    }
    return map;
  }, [allCoins]);

  const { portfolio, addAsset, removeAsset, updateAssetQuantity, getAssetById, totalValue, resetPortfolio } =
    usePortfolioState(priceMap, coinMap, loading);
  
  const {
    shouldShowAddAssetModal,
    shouldShowDeleteConfirmationModal,
    cancelDeleteAsset,
    assetIdPendingDeletion,
    openAddAssetModal,
    closeAddAssetModal,
    addButtonRef,
    requestDeleteAsset,
  } = useUIState();

  const {
    sortedFilteredAssets,
    setSortOption,
    setFilterText,
    filterText,
    sortOption,
  } = useFilterSort(portfolio);

  const notifications = useNotifications();

  // Track highlight triggers for visual feedback
  const [highlightTriggers, setHighlightTriggers] = useState<Record<string, number>>({});

  // ✅ Memoize triggerHighlight to prevent recreating on every render
  const triggerHighlight = useCallback((assetId: string) => {
    setHighlightTriggers(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + 1,
    }));
  }, []); // No dependencies - setHighlightTriggers is stable

  // Import/Export logic via custom hook
  const {
    importPreview,
    importError,
    onFileSelected,
    applyMerge,
    applyReplace,
    dismissPreview,
    exportPortfolio,
  } = usePortfolioImportExport({
    coinMap,
    addAsset,
    resetPortfolio,
    portfolio,
    priceMap: priceMap as Record<string, number>,
  });

  const e2eMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("e2e") === "1";

  // ✅ Stabilize all event handlers with useCallback
  const handleAddAsset = useCallback((asset: { coinInfo: CoinInfo; quantity: number }) => {
    addAsset(asset);
    triggerHighlight(asset.coinInfo.id);
  }, [addAsset, triggerHighlight]);

  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    updateAssetQuantity(id, newQuantity);
    triggerHighlight(id);
  }, [updateAssetQuantity, triggerHighlight]);

  const handleDeleteAsset = useCallback((id: string) => {
    requestDeleteAsset(id);
  }, [requestDeleteAsset]);

  const handleExport = useCallback((format: "csv" | "json") => {
    try {
      if (portfolio.length === 0) {
        notifications.warning("⚠️ Your portfolio is empty. Add assets before exporting.");
        return;
      }
      
      const result = exportPortfolio(format);
      notifications.success(
        `✓ Exported ${result.count} asset${result.count !== 1 ? 's' : ''} to ${result.filename}`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  }, [portfolio.length, exportPortfolio, notifications]);

  const handleImport = useCallback((file: File) => {
    onFileSelected(file);
  }, [onFileSelected]);

  const handleApplyMerge = useCallback(() => {
    try {
      const result = applyMerge();
      
      // Trigger highlights for all imported/updated assets
      portfolio.forEach(asset => {
        triggerHighlight(asset.coinInfo.id);
      });
      
      if (result.skipped > 0) {
        notifications.warning(
          `⚠️ Imported ${result.added} new, updated ${result.updated} existing. Skipped ${result.skipped} unknown asset${result.skipped !== 1 ? 's' : ''}.`
        );
      } else {
        notifications.success(
          `✓ Successfully imported ${result.added} new and updated ${result.updated} existing asset${result.added + result.updated !== 1 ? 's' : ''}`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to merge portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  }, [applyMerge, portfolio, triggerHighlight, notifications]);

  const handleApplyReplace = useCallback(() => {
    try {
      const result = applyReplace();
      
      // Trigger highlights for all replaced assets
      portfolio.forEach(asset => {
        triggerHighlight(asset.coinInfo.id);
      });
      
      if (result.skipped > 0) {
        notifications.warning(
          `⚠️ Replaced portfolio with ${result.added} asset${result.added !== 1 ? 's' : ''}. Skipped ${result.skipped} unknown asset${result.skipped !== 1 ? 's' : ''}.`
        );
      } else {
        notifications.success(
          `✓ Successfully replaced portfolio with ${result.added} asset${result.added !== 1 ? 's' : ''}`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to replace portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  }, [applyReplace, portfolio, triggerHighlight, notifications]);

  // ... rest of component (loading state, JSX, etc.)
}
```

---

## Key Changes

1. **Import `useCallback`**
   ```tsx
   import { useMemo, useState, useCallback } from "react";
   ```

2. **Wrap `triggerHighlight` in `useCallback`**
   ```tsx
   const triggerHighlight = useCallback((assetId: string) => {
     setHighlightTriggers(prev => ({ ...prev, [assetId]: (prev[assetId] || 0) + 1 }));
   }, []); // Empty deps - setHighlightTriggers is stable
   ```

3. **Wrap all event handlers in `useCallback`**
   - `handleAddAsset`
   - `handleUpdateQuantity`
   - `handleDeleteAsset`
   - `handleExport`
   - `handleImport`
   - `handleApplyMerge`
   - `handleApplyReplace`

4. **Specify dependencies correctly**
   - Include all external values used inside the callback
   - Omit stable functions (like `setState`, `notifications`)

---

## Expected Impact

### Before Optimization
- **Scenario:** PortfolioPage re-renders (e.g., modal opens)
- **Result:**
  - All 7+ event handlers recreated
  - New function references passed to children
  - AssetList receives new `onDelete` and `onUpdateQuantity`
  - All AssetRow components re-render (even with memo)

### After Optimization
- **Scenario:** PortfolioPage re-renders with same dependencies
- **Result:**
  - `useCallback` returns cached function references
  - Children receive same callback references
  - React.memo prevents unnecessary re-renders
  - Only components with changed props re-render

### Performance Improvement
- **Reduction:** 50-70% fewer re-renders when combined with memo
- **Stability:** Callbacks maintain referential equality across renders
- **Predictability:** React.memo optimizations work correctly

---

## Dependency Array Guidelines

### ✅ **Include in dependencies:**
- Props
- State variables
- Other callbacks (if they're also memoized)
- Context values

### ❌ **Exclude from dependencies:**
- `setState` functions (always stable)
- `useRef` values (stable references)
- Functions from custom hooks that are already memoized

### Example:
```tsx
const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
  updateAssetQuantity(id, newQuantity); // ✅ Include updateAssetQuantity
  triggerHighlight(id);                 // ✅ Include triggerHighlight
  setLoading(false);                    // ❌ Don't include setLoading (stable)
}, [updateAssetQuantity, triggerHighlight]);
```

---

## Common Pitfalls

### ❌ **Pitfall 1: Missing dependencies**
```tsx
// BAD - portfolio is used but not in deps
const handleExport = useCallback((format: "csv" | "json") => {
  if (portfolio.length === 0) { /* ... */ }
}, []); // ❌ Missing portfolio.length
```

**Fix:**
```tsx
const handleExport = useCallback((format: "csv" | "json") => {
  if (portfolio.length === 0) { /* ... */ }
}, [portfolio.length]); // ✅ Include portfolio.length
```

### ❌ **Pitfall 2: Including unstable dependencies**
```tsx
// BAD - notifications object recreated every render
const handleError = useCallback(() => {
  notifications.error("Error!");
}, [notifications]); // ❌ notifications is unstable
```

**Fix:** First stabilize `notifications` in its hook (see Refactor 2.3), then:
```tsx
const handleError = useCallback(() => {
  notifications.error("Error!");
}, [notifications]); // ✅ Now stable
```

---

## Testing Checklist

- [ ] All event handlers still work correctly
- [ ] Asset add/update/delete functions properly
- [ ] Import/export still works
- [ ] Notifications display correctly
- [ ] No console warnings about missing dependencies
- [ ] React DevTools Profiler shows reduced re-renders

---

## Verification

### Manual Testing
1. Add an asset → verify highlight works
2. Update quantity → verify highlight works
3. Delete asset → verify confirmation modal works
4. Export portfolio → verify download works
5. Import portfolio → verify preview modal works

### Profiler Testing
1. Open React DevTools Profiler
2. Record: Open and close a modal
3. Check AssetList and AssetRow render counts
4. Should see ~50-70% reduction in re-renders

### Dependency Validation
Run ESLint with `react-hooks/exhaustive-deps` rule:
```bash
npm run lint
```

---

## Dependencies

**This optimization enables:**
- Refactor 1: Memoize AssetRow (memo works correctly with stable callbacks)
- Refactor 2: Optimize AssetList (memoization not invalidated by callback changes)

---

## Rollback Plan

If issues arise, remove `useCallback` wrappers:

```tsx
// Revert to:
const handleAddAsset = (asset: { coinInfo: CoinInfo; quantity: number }) => {
  addAsset(asset);
  triggerHighlight(asset.coinInfo.id);
};
```

---

## Notes

- This is a **non-breaking change** - API remains identical
- No changes needed in child components
- Callbacks remain stable across renders unless dependencies change
- Consider enabling ESLint rule `react-hooks/exhaustive-deps` to catch missing dependencies
