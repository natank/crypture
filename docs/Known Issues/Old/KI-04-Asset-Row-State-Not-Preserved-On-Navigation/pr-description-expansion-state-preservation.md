# PR: Asset Row Expansion State Preservation (KI-04 Follow-up)

## Summary

Extends the existing KI-04 navigation state preservation solution to include asset row expansion state. Users can now expand asset rows to view charts and metrics, navigate to coin details, and return to find their expansion state preserved exactly as they left it.

## Changes

### New Files

- **`frontend/src/hooks/usePersistedExpansionState.ts`** (~105 LOC)
  - Custom hook for managing asset row expansion state with sessionStorage persistence
  - Stores array of expanded asset IDs in sessionStorage
  - Filters out stale asset IDs on load (handles portfolio changes)
  - Provides `toggleExpansion`, `isExpanded`, and `clearExpansion` functions
  - Follows same pattern as `usePersistedFilterSort` for architectural consistency

- **`frontend/src/__tests__/hooks/usePersistedExpansionState.test.ts`** (~120 LOC)
  - Comprehensive unit test suite with 8 test cases
  - Tests initialization, toggle functionality, persistence, loading, filtering, error handling

- **`frontend/src/e2e/specs/features/expansion-state-preservation.spec.ts`** (~170 LOC)
  - E2E test suite with 4 test scenarios
  - Tests single/multiple asset expansion preservation, collapsed state, sessionStorage usage

### Modified Files

- **`frontend/src/hooks/useAssetChartController.ts`**
  - Added support for external expansion state via `ExternalExpansionState` interface
  - Maintains backward compatibility with local state fallback
  - Handles chart data fetching when expanding

- **`frontend/src/components/AssetRow/index.tsx`**
  - Added `expansionState` prop to component interface
  - Passes expansion state to `useAssetChartController`
  - **Critical Fix**: Updated memo comparison to check individual asset state changes, preventing infinite re-renders

- **`frontend/src/components/AssetList/index.tsx`**
  - Added `expansionState` prop and passed it through to `AssetRow` components

- **`frontend/src/pages/PortfolioPage.tsx`**
  - Integrated `usePersistedExpansionState` hook
  - Created `validAssetIds` memo to pass current asset IDs
  - Passed `expansionState` to `AssetList` component

## Technical Implementation

### Architecture

Maintains perfect architectural consistency with KI-04:
- **SessionStorage** for ephemeral state persistence
- **Custom hook** wrapping state management
- **Validation on load** with stale data filtering
- **Graceful error handling** for storage operations
- **TypeScript type safety** throughout
- **Hydration skip** pattern for SSR compatibility

### Key Technical Solutions

#### 1. Memo Comparison Fix
```typescript
// Before (caused infinite re-renders)
const expansionChanged = 
  prevProps.expansionState?.expandedAssets !== nextProps.expansionState?.expandedAssets;

// After (checks individual asset state)
const assetId = prevProps.asset.coinInfo.id;
const wasExpanded = prevProps.expansionState?.expandedAssets.includes(assetId) ?? false;
const isExpanded = nextProps.expansionState?.expandedAssets.includes(assetId) ?? false;

if (wasExpanded !== isExpanded) return false;
```

#### 2. Timing Issue Fix
```typescript
// Load all saved assets initially (no filtering by validAssetIds)
const loadInitialState = (): string[] => {
  return parsed.expandedAssets.filter(id => typeof id === 'string');
};

// Filter when portfolio loads via useEffect
useEffect(() => {
  if (validAssetIds.length === 0) return;
  
  setExpandedAssets(prev => {
    const filtered = prev.filter(id => validAssetIds.includes(id));
    return JSON.stringify(filtered) !== JSON.stringify(prev) ? filtered : prev;
  });
}, [validAssetIds]);
```

### Storage Format

```json
{
  "expandedAssets": ["bitcoin", "ethereum", "cardano"]
}
```

**Storage Key:** `portfolio_expansion_state`

## Testing

### Unit Tests (8/8 passing)
- Hook initialization
- Toggle functionality
- SessionStorage persistence
- Loading from sessionStorage
- Stale ID filtering
- Error handling
- Clear functionality
- Multiple assets

### E2E Tests (4/4 passing)
- Single asset expansion preservation
- Collapsed asset remains collapsed
- Multiple assets expansion preservation
- SessionStorage usage verification

### Test Commands
```bash
# Unit tests
npm run test:unit -- usePersistedExpansionState

# E2E tests
npx playwright test expansion-state-preservation.spec.ts
```

## Edge Cases Handled

- **Asset List Changes**: Stale IDs filtered out on load
- **Multiple Expanded Assets**: No limit enforced, handles any number
- **SessionStorage Unavailable**: Graceful degradation, app continues working
- **Invalid Data**: Validation on load, falls back to empty array
- **Filtered Assets**: State persists in memory, re-expands if filter cleared

## Performance Impact

- **Storage Size**: ~10-50 bytes per expanded asset (typical: 100-200 bytes total)
- **Lookup Complexity**: O(n) where n = number of assets (< 100)
- **Re-render Impact**: Minimal - only affected AssetRow components re-render
- **Memory Usage**: Negligible - single array of strings

## Breaking Changes

**None.** This is a pure additive feature that enhances UX without affecting existing functionality.

## User Impact

**Before:** Users lose expansion state when navigating to coin details and back. Must re-expand rows to view charts.

**After:** Complete expansion state preservation - users return to exactly the same view they left, with all previously expanded rows still expanded.

## Critical Bugs Fixed

1. **Continuous Blinking**: Fixed memo comparison causing infinite re-renders
2. **State Not Restoring**: Fixed timing issue where `validAssetIds` was empty on initial load

## Related Issues

- **KI-04**: Original navigation state preservation (scroll, filter, sort)
- **PR Description**: `pr-description-navigation-state-preservation.md`

## Checklist

- [x] Implementation complete
- [x] Unit tests passing (8/8)
- [x] E2E tests passing (4/4)
- [x] TypeScript compilation passing
- [x] No regressions in existing functionality
- [x] Production testing verified
- [x] Documentation updated
- [x] Critical bugs fixed

## Review Focus Areas

1. **Memo Comparison Logic**: Verify the fix prevents infinite re-renders
2. **Timing Issue Resolution**: Confirm expansion state loads correctly after navigation
3. **Architecture Consistency**: Ensure alignment with KI-04 patterns
4. **Test Coverage**: Review edge cases and error handling
5. **Performance**: Verify minimal impact on render performance

## Files Changed

- `frontend/src/hooks/usePersistedExpansionState.ts` (new)
- `frontend/src/__tests__/hooks/usePersistedExpansionState.test.ts` (new)
- `frontend/src/e2e/specs/features/expansion-state-preservation.spec.ts` (new)
- `frontend/src/hooks/useAssetChartController.ts` (modified)
- `frontend/src/components/AssetRow/index.tsx` (modified)
- `frontend/src/components/AssetList/index.tsx` (modified)
- `frontend/src/pages/PortfolioPage.tsx` (modified)

## Documentation

- `implementation-summary.md` - Complete implementation details
- `critical-fix-memo-comparison.md` - Memo comparison bug analysis
- `final-fix-timing-issue.md` - Timing issue bug analysis
