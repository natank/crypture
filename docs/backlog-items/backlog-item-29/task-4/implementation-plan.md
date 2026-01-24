# Implementation Plan: Task 4 - KI-04

**Backlog Item:** 29 - UI Polish & Accessibility Improvements  
**Task:** KI-04 - Page State Not Preserved on Navigation  
**Priority:** Must Have  
**Estimated Effort:** High (4-6 hours)

---

## Problem Statement

**Current Behavior:**
- Navigating from portfolio to coin details and back loses:
  - Scroll position
  - Filter/sort state
  - Any form input state
- User must re-find their place in the asset list
- Poor user experience when browsing multiple coin details

**Root Cause Analysis:**

After analyzing the codebase:

1. **Navigation Pattern:**
   - `AssetRow/index.tsx` line 287: Uses `<Link to={`/coin/${asset.coinInfo.id}`}>`
   - `CoinDetailPage.tsx` line 17: Uses `navigate(-1)` for back navigation
   - React Router doesn't preserve scroll position by default

2. **State Management:**
   - `PortfolioPage.tsx` uses local state for filter/sort via `useFilterSort` hook
   - Filter text: `const { search, setSearch, filteredCoins } = useCoinSearch(allCoins)` (line 57)
   - Sort option: Managed by `useFilterSort` hook (lines 150-156)
   - All state is component-local, not persisted

3. **Scroll Position:**
   - No scroll restoration mechanism in place
   - Browser default behavior varies across browsers
   - React Router's `ScrollRestoration` not implemented

**Expected Behavior:**
- Scroll position restored when navigating back
- Filter text preserved
- Sort option preserved
- Modal states handled correctly (no ghost modals)
- Smooth user experience when browsing coin details

---

## Acceptance Criteria

- [ ] Scroll position restored when navigating back from coin details
- [ ] Filter text preserved across navigation
- [ ] Sort option preserved across navigation
- [ ] Expanded chart states handled gracefully (can collapse on return)
- [ ] Modal states don't persist incorrectly
- [ ] Works consistently across browsers (Chrome, Firefox, Safari)
- [ ] No performance degradation
- [ ] No regression in existing functionality
- [ ] Unit tests pass
- [ ] E2E tests pass

---

## Technical Approach

### Option 1: URL Search Params + Session Storage (Recommended)

**Pros:**
- Shareable URLs with filter/sort state
- Browser back/forward works naturally
- Scroll restoration via browser + React Router
- State survives page refresh
- Clean, standard approach

**Cons:**
- Slightly more complex implementation
- URL changes on filter/sort

**Implementation:**
1. Move filter/sort state to URL search params
2. Use `sessionStorage` for scroll position
3. Implement scroll restoration on mount
4. Use React Router's location state for navigation context

### Option 2: React Router Location State Only

**Pros:**
- Simpler implementation
- No URL pollution

**Cons:**
- State lost on page refresh
- Not shareable
- Doesn't work with browser back/forward to external pages

### Option 3: Global State (Context/Redux)

**Pros:**
- Centralized state management

**Cons:**
- Over-engineering for this use case
- Adds complexity
- Still needs scroll restoration logic

**Decision:** Use Option 1 (URL Search Params + Session Storage) for best UX and maintainability.

---

## Implementation Steps

### Step 1: Create Scroll Restoration Hook

**File:** `frontend/src/hooks/useScrollRestoration.ts` (new file)

**Purpose:**
- Save scroll position before navigation
- Restore scroll position on return
- Use sessionStorage for persistence

**Implementation:**
```typescript
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration(key: string) {
  const location = useLocation();
  const scrollPositions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Restore scroll position on mount
    const savedPosition = sessionStorage.getItem(`scroll-${key}`);
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      window.scrollTo(0, position);
      sessionStorage.removeItem(`scroll-${key}`);
    }
  }, [key]);

  useEffect(() => {
    // Save scroll position before unmount
    return () => {
      const currentScroll = window.scrollY;
      sessionStorage.setItem(`scroll-${key}`, currentScroll.toString());
    };
  }, [key]);
}
```

**Estimated Time:** 30 minutes

---

### Step 2: Update useFilterSort Hook to Support URL Params

**File:** `frontend/src/hooks/useFilterSort.ts`

**Current Implementation:**
- Uses local state: `useState(initialSort)`, `useState(initialFilter)`
- State is lost on unmount

**Proposed Changes:**
1. Accept `useSearchParams` integration
2. Read initial state from URL params
3. Update URL params when state changes
4. Maintain backward compatibility

**New Implementation:**
```typescript
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PortfolioAsset } from "@hooks/usePortfolioState";

export function useFilterSort(
  assets: PortfolioAsset[],
  initialSort: string = "name-asc",
  initialFilter: string = "",
  useUrlParams: boolean = false
) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read from URL params if enabled, otherwise use initial values
  const urlSort = searchParams.get('sort') || initialSort;
  const urlFilter = searchParams.get('filter') || initialFilter;
  
  const [sortOption, setSortOption] = useState(useUrlParams ? urlSort : initialSort);
  const [filterText, setFilterText] = useState(useUrlParams ? urlFilter : initialFilter);

  // Sync URL params when state changes (only if useUrlParams is true)
  useEffect(() => {
    if (useUrlParams) {
      const params = new URLSearchParams(searchParams);
      
      if (sortOption !== initialSort) {
        params.set('sort', sortOption);
      } else {
        params.delete('sort');
      }
      
      if (filterText) {
        params.set('filter', filterText);
      } else {
        params.delete('filter');
      }
      
      setSearchParams(params, { replace: true });
    }
  }, [sortOption, filterText, useUrlParams, initialSort, searchParams, setSearchParams]);

  const sortedFilteredAssets = useMemo(() => {
    // ... existing logic unchanged
  }, [assets, sortOption, filterText]);

  return {
    sortedFilteredAssets,
    sortOption,
    setSortOption,
    setFilterText,
    filterText,
  };
}
```

**Estimated Time:** 45 minutes

---

### Step 3: Update PortfolioPage to Use URL Params

**File:** `frontend/src/pages/PortfolioPage.tsx`

**Changes:**

1. Import `useSearchParams`:
```typescript
import { useSearchParams } from 'react-router-dom';
```

2. Add scroll restoration hook:
```typescript
import { useScrollRestoration } from '@hooks/useScrollRestoration';
```

3. Use scroll restoration (add after line 38):
```typescript
useScrollRestoration('portfolio');
```

4. Update `useFilterSort` call to enable URL params (around line 150):
```typescript
const { sortedFilteredAssets, sortOption, setSortOption, setFilterText, filterText } =
  useFilterSort(portfolio, "name-asc", "", true); // Enable URL params
```

**Estimated Time:** 15 minutes

---

### Step 4: Update AssetRow Navigation to Preserve State

**File:** `frontend/src/components/AssetRow/index.tsx`

**Current Code (line 286-294):**
```tsx
<Link
  to={`/coin/${asset.coinInfo.id}`}
  className="..."
  aria-label={`View ${asset.coinInfo.name} details`}
  title={`View ${asset.coinInfo.name} details`}
  onClick={(e) => e.stopPropagation()}
>
  <Icon glyph="🔍" />
</Link>
```

**Proposed Change:**
No changes needed - Link component already works with URL params.
The state is now in the URL, so it will be preserved automatically.

**Estimated Time:** 5 minutes (verification only)

---

### Step 5: Update CoinDetailPage Back Navigation

**File:** `frontend/src/pages/CoinDetailPage.tsx`

**Current Code (line 16-18):**
```typescript
const handleBack = () => {
  navigate(-1);
};
```

**Analysis:**
- `navigate(-1)` already preserves URL params
- Scroll restoration hook in PortfolioPage will handle scroll position
- No changes needed

**Estimated Time:** 5 minutes (verification only)

---

### Step 6: Handle Edge Cases

**Tasks:**

1. **Expanded Chart States:**
   - Charts are controlled by `useAssetChartController` hook
   - State is in localStorage (persistent across sessions)
   - Consider: Should charts collapse on return? Or stay expanded?
   - **Decision:** Keep current behavior (charts stay expanded if user left them expanded)

2. **Modal States:**
   - Modals are local state in PortfolioPage
   - They will naturally close on navigation (component unmounts)
   - No changes needed

3. **Filter Input Focus:**
   - Don't auto-focus filter input on return (would be jarring)
   - Current behavior is correct

4. **Scroll Position Timing:**
   - Ensure scroll restoration happens after DOM is fully rendered
   - Use `requestAnimationFrame` if needed

**Estimated Time:** 30 minutes

---

### Step 7: Testing

**Manual Testing:**

1. **Scroll Position Test:**
   - Open portfolio page
   - Scroll down to middle of asset list
   - Click on an asset to view details
   - Click back button
   - Verify scroll position is restored

2. **Filter Preservation Test:**
   - Open portfolio page
   - Enter filter text (e.g., "bit")
   - Click on filtered asset
   - Click back
   - Verify filter text is still "bit"
   - Verify filtered results are shown

3. **Sort Preservation Test:**
   - Open portfolio page
   - Change sort to "Value (High to Low)"
   - Click on an asset
   - Click back
   - Verify sort is still "Value (High to Low)"

4. **Combined State Test:**
   - Apply filter + sort + scroll
   - Navigate to coin details
   - Navigate back
   - Verify all three states preserved

5. **Browser Back/Forward Test:**
   - Navigate: Portfolio → Coin → Back (browser button)
   - Verify state preserved
   - Navigate forward (browser button)
   - Verify coin details loads correctly

6. **Page Refresh Test:**
   - Apply filter + sort
   - Refresh page
   - Verify filter + sort preserved (from URL)

7. **Modal State Test:**
   - Open a modal (e.g., Add Asset)
   - Navigate to coin details (shouldn't be possible, but test)
   - Verify no ghost modals

**Automated Testing:**

1. Run existing unit tests: `npm test`
2. Run E2E tests: `npm run test:e2e`
3. Add new E2E test for navigation state preservation:

**File:** `frontend/src/e2e/specs/features/navigation-state.spec.ts` (new file)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation State Preservation', () => {
  test('preserves scroll position on back navigation', async ({ page }) => {
    await page.goto('/portfolio');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    
    // Navigate to coin details
    await page.click('[data-testid="asset-row-btc"] a[href*="/coin/"]');
    await page.waitForURL(/\/coin\/.+/);
    
    // Navigate back
    await page.goBack();
    await page.waitForURL('/portfolio');
    
    // Check scroll position restored
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeCloseTo(scrollBefore, 50); // 50px tolerance
  });

  test('preserves filter and sort on back navigation', async ({ page }) => {
    await page.goto('/portfolio');
    
    // Apply filter
    await page.fill('input[placeholder*="filter"]', 'bitcoin');
    
    // Apply sort
    await page.selectOption('select[aria-label*="sort"]', 'value-desc');
    
    // Verify URL params
    expect(page.url()).toContain('filter=bitcoin');
    expect(page.url()).toContain('sort=value-desc');
    
    // Navigate to coin details
    await page.click('[data-testid="asset-row-btc"] a[href*="/coin/"]');
    await page.waitForURL(/\/coin\/.+/);
    
    // Navigate back
    await page.goBack();
    await page.waitForURL('/portfolio');
    
    // Verify filter and sort preserved
    expect(page.url()).toContain('filter=bitcoin');
    expect(page.url()).toContain('sort=value-desc');
    
    const filterValue = await page.inputValue('input[placeholder*="filter"]');
    expect(filterValue).toBe('bitcoin');
  });
});
```

**Estimated Time:** 2 hours

---

### Step 8: Documentation and Code Review

**Tasks:**
1. Add JSDoc comments to new hook
2. Update component documentation
3. Add inline comments for scroll restoration logic
4. Document URL param structure
5. Update README if needed

**Estimated Time:** 30 minutes

---

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/hooks/useScrollRestoration.ts` | Scroll position save/restore hook |
| `frontend/src/e2e/specs/features/navigation-state.spec.ts` | E2E tests for navigation state |

## Files to Modify

| File | Purpose | Lines Affected |
|------|---------|----------------|
| `frontend/src/hooks/useFilterSort.ts` | Add URL params support | ~1-54 (full rewrite) |
| `frontend/src/pages/PortfolioPage.tsx` | Enable URL params, add scroll restoration | ~1-10, ~150-156 |

## Files to Review (No Changes Expected)

| File | Purpose |
|------|---------|
| `frontend/src/components/AssetRow/index.tsx` | Verify Link navigation works with URL params |
| `frontend/src/pages/CoinDetailPage.tsx` | Verify back navigation works |
| `frontend/src/App.tsx` | Verify routing configuration |

---

## Technical Design Details

### URL Structure

**Portfolio Page with State:**
```
/portfolio?filter=bitcoin&sort=value-desc
```

**Parameters:**
- `filter`: Filter text (optional, removed if empty)
- `sort`: Sort option (optional, removed if default "name-asc")

### Session Storage Keys

- `scroll-portfolio`: Scroll position for portfolio page
- Format: Integer string (e.g., "450")
- Cleared after restoration to avoid stale data

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ PortfolioPage                                           │
│                                                         │
│ 1. Mount → Read URL params → Initialize filter/sort    │
│ 2. Read sessionStorage → Restore scroll position       │
│ 3. User changes filter/sort → Update URL params        │
│ 4. User scrolls → (no action, scroll tracked by hook)  │
│ 5. User clicks coin link → Navigate to /coin/:id       │
│ 6. Unmount → Save scroll position to sessionStorage    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ CoinDetailPage                                  │   │
│ │                                                 │   │
│ │ User clicks back → navigate(-1)                │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 7. Mount → Read URL params (preserved from step 3)     │
│ 8. Read sessionStorage → Restore scroll (from step 6)  │
│ 9. User sees same filter/sort/scroll as before         │
└─────────────────────────────────────────────────────────┘
```

---

## Risk Assessment

### Medium Risk

**URL Param Conflicts:**
- If other features use same param names
- Mitigation: Use descriptive names (`filter`, `sort`)

**Browser Compatibility:**
- sessionStorage support (IE11+)
- URLSearchParams support (modern browsers)
- Mitigation: App already requires modern browsers

**Scroll Restoration Timing:**
- DOM may not be ready when scroll restoration runs
- Mitigation: Use `requestAnimationFrame` or `setTimeout`

### Low Risk

**Performance:**
- URL updates on every filter keystroke
- Mitigation: Use `replace: true` to avoid history pollution
- Consider debouncing if needed

**State Synchronization:**
- URL and component state could get out of sync
- Mitigation: URL is source of truth, read on mount

---

## Rollback Plan

If issues arise:
1. Revert `useFilterSort.ts` to original version
2. Remove `useScrollRestoration.ts` hook
3. Remove URL params from PortfolioPage
4. Git revert if needed

---

## Success Metrics

- [ ] Scroll position restored within 50px of original position
- [ ] Filter text preserved exactly
- [ ] Sort option preserved exactly
- [ ] No console errors or warnings
- [ ] All existing tests pass
- [ ] New E2E tests pass
- [ ] Manual testing checklist completed
- [ ] Works in Chrome, Firefox, Safari

---

## Timeline

| Step | Duration | Cumulative |
|------|----------|------------|
| 1. Create scroll restoration hook | 30 min | 30 min |
| 2. Update useFilterSort for URL params | 45 min | 75 min |
| 3. Update PortfolioPage | 15 min | 90 min |
| 4. Verify AssetRow navigation | 5 min | 95 min |
| 5. Verify CoinDetailPage back nav | 5 min | 100 min |
| 6. Handle edge cases | 30 min | 130 min |
| 7. Testing (manual + E2E) | 120 min | 250 min |
| 8. Documentation & code review | 30 min | 280 min |

**Total Estimated Time:** ~4.5 hours (within 4-6 hour estimate)

---

## Alternative Approaches Considered

### 1. React Router ScrollRestoration Component
- **Pros:** Built-in solution
- **Cons:** Doesn't handle filter/sort state, limited customization
- **Decision:** Use custom hook for full control

### 2. localStorage Instead of sessionStorage
- **Pros:** Persists across browser sessions
- **Cons:** Pollutes storage, stale data issues
- **Decision:** Use sessionStorage for temporary state

### 3. History State API
- **Pros:** Native browser API
- **Cons:** Complex, harder to debug, not shareable
- **Decision:** Use URL params for transparency

---

## Next Steps

1. **Review this plan** with team/stakeholder
2. **Get approval** to proceed
3. **Implement** changes in order
4. **Test** thoroughly
5. **Commit** with clear message: `feat(navigation): Preserve page state on navigation (KI-04)`
6. **Update** task documentation with implementation notes

---

## Related Documentation

- Requirement: `docs/requirements/REQ-024-tech-debt.md` (lines 115-139)
- Backlog Item: `docs/product-backlog.md` (line 58)
- SDP Process: `docs/software-development-plan.md` (Phase 7)
- React Router Docs: https://reactrouter.com/en/main/hooks/use-search-params

---

## Dependencies

- **Depends on:** None (independent task)
- **Blocks:** None
- **Related to:** General UX improvements

---

**Status:** Ready for Review  
**Created:** January 4, 2025  
**Author:** Developer + AI (Cascade)
