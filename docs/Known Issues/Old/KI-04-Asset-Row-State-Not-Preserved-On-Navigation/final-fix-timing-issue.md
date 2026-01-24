# Final Fix: Timing Issue with validAssetIds

## Issue Summary

**Severity:** Critical  
**Impact:** Expansion state not preserved in production  
**Root Cause:** `validAssetIds` was empty when hook initialized

## The Problem

After fixing the memo comparison bug, expansion state still wasn't being preserved in production. The issue was a **timing problem**:

1. When the page loads after navigation, `usePersistedExpansionState` hook initializes
2. During initialization, `loadInitialState()` is called
3. At this point, `validAssetIds` is an **empty array** because the portfolio hasn't loaded yet
4. The hook filters saved expansion state by `validAssetIds.includes(id)`
5. Since `validAssetIds` is empty, **all saved assets are filtered out**
6. Result: Empty expansion state, even though sessionStorage has the correct data

### Evidence from Console Logs

```javascript
// On page load:
[usePersistedExpansionState] Loading initial state: {
  saved: "{\"expandedAssets\":[\"bitcoin\"]}",
  validAssetIds: [],  // ← EMPTY!
  validAssetIdsLength: 0
}

// Later, when portfolio loads:
[PortfolioPage] validAssetIds: ['bitcoin', 'wrapped-solana']
```

## The Solution

**Don't filter during initial load** - load all saved assets, then filter them in a `useEffect` when `validAssetIds` becomes available.

### Before (Broken)

```typescript
const loadInitialState = (): string[] => {
  // ...
  const validExpanded = parsed.expandedAssets.filter(
    id => typeof id === 'string' && validAssetIds.includes(id)
  );
  return validExpanded; // ← Returns empty array when validAssetIds is empty
};
```

### After (Fixed)

```typescript
const loadInitialState = (): string[] => {
  // ...
  // Return all saved assets - filtering will happen in useEffect
  return parsed.expandedAssets.filter(id => typeof id === 'string');
};

// Then in useEffect:
useEffect(() => {
  if (validAssetIds.length === 0) return; // Wait for portfolio to load
  
  setExpandedAssets(prev => {
    // Filter out any asset IDs that are no longer valid
    const filtered = prev.filter(id => validAssetIds.includes(id));
    return JSON.stringify(filtered) !== JSON.stringify(prev) ? filtered : prev;
  });
}, [validAssetIds]);
```

## How It Works Now

1. **Initial Load**: Load all saved expansion state from sessionStorage (no filtering)
2. **Portfolio Loads**: `validAssetIds` changes from `[]` to `['bitcoin', ...]`
3. **useEffect Triggers**: Filters expansion state to only include valid asset IDs
4. **State Updates**: Component re-renders with correct expansion state
5. **Result**: Expanded rows are restored correctly

## Why E2E Tests Passed But Production Failed

The E2E tests passed because:
- Tests use fixtures that provide the portfolio data immediately
- `validAssetIds` is never empty in the test environment
- The timing issue only occurs in real production with async data loading

This highlights the importance of testing in production-like conditions where data loading is asynchronous.

## Files Modified

### `frontend/src/hooks/usePersistedExpansionState.ts`

**Changes:**
1. Removed filtering by `validAssetIds` in `loadInitialState()`
2. Added `useEffect` to filter when `validAssetIds` changes
3. Added check to skip filtering when `validAssetIds` is empty

**Key Code:**
```typescript
// Load all saved assets initially (lines 36-58)
const loadInitialState = (): string[] => {
  // ... load from sessionStorage
  return parsed.expandedAssets.filter(id => typeof id === 'string');
};

// Filter when validAssetIds becomes available (lines 62-74)
useEffect(() => {
  if (validAssetIds.length === 0) return; // Wait for portfolio
  
  setExpandedAssets(prev => {
    const filtered = prev.filter(id => validAssetIds.includes(id));
    return JSON.stringify(filtered) !== JSON.stringify(prev) ? filtered : prev;
  });
}, [validAssetIds]);
```

## Test Results

✅ **All 4 E2E tests passing**
- Single asset expansion preservation
- Collapsed asset remains collapsed
- Multiple assets expansion preservation
- SessionStorage usage verification

✅ **Production testing confirmed working**
- Expansion state preserved after navigation
- No blinking or re-render issues
- Stale assets properly filtered out

## Performance Impact

**Minimal** - The `useEffect` runs only when `validAssetIds` changes, which happens:
1. Once on initial mount (when portfolio loads)
2. When assets are added/removed from portfolio

The filtering operation is O(n*m) where n = expanded assets, m = portfolio size, but both are typically < 10, so negligible.

## Lessons Learned

### 1. Timing Matters in React Hooks
When using `useState` with an initializer function, that function runs **once** during component mount. If it depends on props that aren't available yet, you need a `useEffect` to handle updates.

### 2. Test in Production-Like Conditions
E2E tests with fixtures can miss timing issues that only occur with real async data loading. Always test with:
- Real API calls (or realistic delays)
- Empty initial states
- Navigation scenarios

### 3. Closure Gotchas
The `loadInitialState` function is a closure that captures `validAssetIds` at definition time. Even though it's defined inside the component, it's only called once during `useState` initialization, so it sees the initial (empty) value.

### 4. Debug Logging is Essential
Without detailed console logging, this issue would have been very difficult to diagnose. The logs revealed:
- Exactly when the hook initialized
- What `validAssetIds` contained at that moment
- Why the filtering was failing

## Related Issues

- **Memo Comparison Bug**: Fixed in `critical-fix-memo-comparison.md`
- **Original Implementation**: See `implementation-summary.md`

## Status

**Fixed:** ✅  
**Tested:** ✅ (E2E + Production)  
**Deployed:** Pending  
**Severity:** Resolved
