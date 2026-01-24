# Critical Fix: Memo Comparison Bug

## Issue Summary

**Severity:** Critical  
**Impact:** Production-breaking  
**Discovered:** During E2E testing and production verification

## Problems Identified

### 1. Continuous Blinking/Re-rendering
**Symptom:** The entire AssetList component was continuously blinking endlessly.

**Root Cause:** The `React.memo` comparison function in `AssetRow` was checking if the entire `expandedAssets` array reference changed:

```typescript
// BROKEN CODE
const expansionChanged = 
  prevProps.expansionState?.expandedAssets !== nextProps.expansionState?.expandedAssets;

if (expansionChanged) return false; // Re-render if expansion state changed
```

**Why This Broke:**
- Every time the parent component re-rendered, it passed the same `expandedAssets` array reference
- However, React's state updates create new array references
- The memo comparison saw a different reference and triggered a re-render
- This caused the parent to re-render again
- **Infinite loop → continuous blinking**

### 2. Expansion State Not Preserved After Navigation
**Symptom:** After navigating back, expanded rows were collapsed despite sessionStorage containing the correct data.

**Root Cause:** Same issue - the memo comparison was preventing proper re-renders when the expansion state was restored from sessionStorage.

## The Fix

Changed the memo comparison to check if **THIS specific asset's expansion state changed**, not if the entire array reference changed:

```typescript
// FIXED CODE
const assetId = prevProps.asset.coinInfo.id;
const wasExpanded = prevProps.expansionState?.expandedAssets.includes(assetId) ?? false;
const isExpanded = nextProps.expansionState?.expandedAssets.includes(assetId) ?? false;

if (wasExpanded !== isExpanded) return false; // Re-render only if THIS asset's state changed
```

**Why This Works:**
- Only checks if this specific asset's expansion state changed
- Doesn't care about array reference changes
- Only triggers re-render when the asset actually needs to expand/collapse
- No infinite loops
- Proper restoration after navigation

## Technical Details

### Before (Broken)
```typescript
// Checked array reference equality
prevProps.expansionState?.expandedAssets !== nextProps.expansionState?.expandedAssets

// Result: ALWAYS different on every render
// → Continuous re-renders
// → Blinking UI
// → State not properly restored
```

### After (Fixed)
```typescript
// Checks if THIS asset is in the expanded list
const wasExpanded = prevProps.expansionState?.expandedAssets.includes(assetId) ?? false;
const isExpanded = nextProps.expansionState?.expandedAssets.includes(assetId) ?? false;

// Result: Only different when THIS asset's state actually changes
// → Renders only when needed
// → No blinking
// → State properly restored
```

## Performance Implications

### Before Fix
- **Re-renders:** Every asset row on every parent render
- **Performance:** O(n) unnecessary re-renders per parent render where n = number of assets
- **User Experience:** Unusable - continuous blinking

### After Fix
- **Re-renders:** Only when an asset's expansion state actually changes
- **Performance:** O(1) - only the affected asset re-renders
- **User Experience:** Smooth, no blinking, proper state restoration

## Testing

### E2E Tests
All 4 expansion state preservation tests passing:
- ✅ Single asset expansion preservation
- ✅ Collapsed asset remains collapsed
- ✅ Multiple assets expansion preservation
- ✅ SessionStorage usage verification

### Existing Tests
- ✅ Asset chart display test passing
- ✅ No regressions in existing functionality

## Lessons Learned

### 1. Array Reference Equality is Dangerous in Memo Comparisons
When using `React.memo` with array props, **never** compare array references directly unless you're certain they're stable references (e.g., from `useMemo` with proper dependencies).

### 2. Check Specific Values, Not Container References
Instead of checking if the array changed, check if the **specific value you care about** changed:

```typescript
// ❌ BAD: Checks container reference
prevProps.array !== nextProps.array

// ✅ GOOD: Checks specific value
prevProps.array.includes(id) !== nextProps.array.includes(id)
```

### 3. Memo Comparisons Must Be Precise
The memo comparison function should only return `false` (trigger re-render) when the component **actually needs** to re-render with new data. Being too broad causes performance issues.

### 4. Test in Production-Like Conditions
The bug wasn't immediately obvious in initial testing because:
- Unit tests don't catch memo comparison issues
- E2E tests passed initially because they didn't stress the re-render cycle
- Only became apparent when the full app was running with real user interactions

## Prevention

### Code Review Checklist
When reviewing `React.memo` comparisons:
- [ ] Are we comparing array/object references?
- [ ] Should we be comparing specific values instead?
- [ ] Will this cause unnecessary re-renders?
- [ ] Will this prevent necessary re-renders?

### Testing Checklist
- [ ] Run E2E tests with debug mode to observe render behavior
- [ ] Test with React DevTools Profiler to catch excessive re-renders
- [ ] Test in production build, not just development

## Related Files

- `frontend/src/components/AssetRow/index.tsx` (lines 383-403)
- `frontend/src/e2e/specs/features/expansion-state-preservation.spec.ts`

## Status

**Fixed:** ✅  
**Tested:** ✅  
**Deployed:** Pending  
**Severity:** Resolved
