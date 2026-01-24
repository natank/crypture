
# Phase 2: Trade Study - Solution Approach Comparison

## Approach Comparison Matrix

I'll analyze 6 different approaches for preserving navigation state:

### Approach 1: React Router Location State

**Description**: Pass state through React Router's `navigate()` and `Link` component using the `state` prop, accessible via `useLocation().state`.

**Implementation Details:**
```tsx
// Navigate with state
<Link to="/coin/bitcoin" state={{ filter: "btc", sort: "value-desc", scrollY: 500 }}>

// Restore state
const location = useLocation();
const savedState = location.state as NavigationState;
```

**Files to Modify:**
- [frontend/src/components/AssetRow/index.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/components/AssetRow/index.tsx:0:0-0:0) (Link component)
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (state restoration logic)
- [frontend/src/pages/CoinDetailPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/CoinDetailPage.tsx:0:0-0:0) (back navigation with state)

**LOC Estimate:** ~80-100 lines

**Pros:**
- ✅ Native React Router solution
- ✅ No external dependencies
- ✅ Type-safe with TypeScript
- ✅ State automatically cleared on refresh (ephemeral by design)
- ✅ Works with browser back/forward buttons
- ✅ No storage quota concerns

**Cons:**
- ❌ State lost on page refresh
- ❌ State lost on direct URL navigation
- ❌ Requires passing state through all navigation points
- ❌ Doesn't handle scroll restoration automatically
- ❌ State only available when navigating via React Router

**Performance:** Excellent - in-memory only, no I/O

**Future Scalability:** 
- ⚠️ Moderate - works well for simple navigation state
- ⚠️ May become cumbersome if we add global state library (duplicate state management)
- ⚠️ Requires manual coordination with future state management

**Testing Requirements:**
- E2E: Navigate forward/back, verify state restoration
- Unit: Mock `useLocation` hook
- Edge cases: Direct URL access, page refresh

---

### Approach 2: Session Storage

**Description**: Persist filter/sort/scroll state to `sessionStorage` with a key like `portfolio_nav_state`. Restore on mount.

**Implementation Details:**
```tsx
// Save state
useEffect(() => {
  sessionStorage.setItem('portfolio_nav_state', JSON.stringify({
    filter: filterText,
    sort: sortOption,
    scrollY: window.scrollY
  }));
}, [filterText, sortOption]);

// Restore state
useEffect(() => {
  const saved = sessionStorage.getItem('portfolio_nav_state');
  if (saved) {
    const state = JSON.parse(saved);
    setFilterText(state.filter);
    setSortOption(state.sort);
    window.scrollTo(0, state.scrollY);
  }
}, []);
```

**Files to Modify:**
- [frontend/src/hooks/useFilterSort.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:0:0-0:0) (add persistence)
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (scroll restoration)
- Potentially create `frontend/src/hooks/useNavigationState.ts` (new hook)

**LOC Estimate:** ~120-150 lines

**Pros:**
- ✅ Survives navigation (persists across route changes)
- ✅ Automatically cleared on tab close
- ✅ Follows existing localStorage pattern in codebase
- ✅ Simple to implement
- ✅ Works with browser back/forward
- ✅ No React Router coupling

**Cons:**
- ❌ State lost on page refresh (sessionStorage clears)
- ❌ Requires manual scroll management
- ❌ Potential for stale state if not carefully managed
- ❌ Storage I/O overhead (minimal but present)
- ❌ Need to handle JSON serialization errors

**Performance:** Very Good - localStorage I/O is fast, but adds overhead

**Future Scalability:**
- ✅ Good - can coexist with global state library
- ✅ Easy to migrate to global state later (just read from store instead)
- ✅ Pattern already established in codebase

**Testing Requirements:**
- E2E: Full navigation flow with state checks
- Unit: Mock sessionStorage
- Edge cases: Storage quota, JSON parse errors, corrupted data

---

### Approach 3: URL Query Parameters

**Description**: Encode filter/sort state in URL query params (e.g., `/portfolio?filter=bitcoin&sort=value-desc`). Scroll position in sessionStorage.

**Implementation Details:**
```tsx
// Read from URL
const [searchParams, setSearchParams] = useSearchParams();
const filter = searchParams.get('filter') || '';
const sort = searchParams.get('sort') || 'name-asc';

// Update URL
setSearchParams({ filter, sort });

// Scroll in sessionStorage (can't put in URL)
sessionStorage.setItem('portfolio_scroll', scrollY.toString());
```

**Files to Modify:**
- [frontend/src/hooks/useFilterSort.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:0:0-0:0) (read from URL params)
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (URL param management)
- `frontend/src/components/FilterSortControls/index.tsx` (update URL on change)

**LOC Estimate:** ~100-130 lines

**Pros:**
- ✅ State survives page refresh
- ✅ Shareable URLs with filter/sort state
- ✅ Browser back/forward works automatically
- ✅ Visible state in URL (debugging friendly)
- ✅ No storage needed for filter/sort

**Cons:**
- ❌ URL pollution (aesthetically unpleasing)
- ❌ Scroll position still needs separate storage
- ❌ URL encoding complexity for special characters
- ❌ Potential URL length limits (unlikely but possible)
- ❌ Exposes internal state in URL (may not be desired)
- ❌ More complex state synchronization

**Performance:** Excellent - no I/O for filter/sort, minimal for scroll

**Future Scalability:**
- ⚠️ Moderate - URL params may conflict with future features
- ⚠️ Harder to migrate to global state (URL is source of truth)
- ⚠️ May complicate analytics/routing logic

**Testing Requirements:**
- E2E: URL param navigation, refresh, back/forward
- Unit: URL parsing/encoding logic
- Edge cases: Invalid params, URL length, special characters

---

### Approach 4: React Context (Navigation State)

**Description**: Create a lightweight React Context specifically for navigation state (filter, sort, scroll). Provider wraps routes.

**Implementation Details:**
```tsx
// Context
const NavigationStateContext = createContext<NavigationState>({});

// Provider in App.tsx
<NavigationStateProvider>
  <Routes>...</Routes>
</NavigationStateProvider>

// Usage
const { filter, sort, scrollY, setFilter, setSort, setScrollY } = useNavigationState();
```

**Files to Modify:**
- [frontend/src/App.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/App.tsx:0:0-0:0) (add provider)
- `frontend/src/contexts/NavigationStateContext.tsx` (new file)
- `frontend/src/hooks/useNavigationState.ts` (new hook)
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (use context)
- [frontend/src/hooks/useFilterSort.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:0:0-0:0) (integrate with context)

**LOC Estimate:** ~180-220 lines

**Pros:**
- ✅ Centralized state management
- ✅ Survives route changes (provider persists)
- ✅ Type-safe with TypeScript
- ✅ Easy to extend with more state
- ✅ No storage I/O overhead
- ✅ Clean separation of concerns

**Cons:**
- ❌ State lost on page refresh
- ❌ More boilerplate code
- ❌ Introduces global state (violates "no global state" constraint)
- ❌ Potential for unnecessary re-renders if not optimized
- ❌ Requires provider setup
- ❌ May complicate future global state migration

**Performance:** Excellent - in-memory, but watch for re-renders

**Future Scalability:**
- ⚠️ Moderate - may conflict with future global state library
- ⚠️ Could become redundant when Redux/Zustand is added
- ⚠️ Need to migrate context state to global store later

**Testing Requirements:**
- E2E: Full navigation flow
- Unit: Context provider/consumer logic, mock context
- Edge cases: Provider unmount, multiple consumers

---

### Approach 5: History State API

**Description**: Use browser's `history.state` API to store navigation state directly in browser history entries.

**Implementation Details:**
```tsx
// Save state
window.history.replaceState(
  { filter, sort, scrollY },
  '',
  window.location.pathname
);

// Restore state
useEffect(() => {
  const handlePopState = (e: PopStateEvent) => {
    if (e.state) {
      setFilter(e.state.filter);
      setSort(e.state.sort);
      window.scrollTo(0, e.state.scrollY);
    }
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

**Files to Modify:**
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (history state management)
- [frontend/src/hooks/useFilterSort.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:0:0-0:0) (integrate with history)
- Potentially create `frontend/src/hooks/useHistoryState.ts`

**LOC Estimate:** ~90-120 lines

**Pros:**
- ✅ Native browser API
- ✅ Works with back/forward buttons automatically
- ✅ No storage needed
- ✅ State tied to history entry (conceptually clean)
- ✅ No React Router coupling

**Cons:**
- ❌ State lost on page refresh
- ❌ Complex interaction with React Router
- ❌ Potential conflicts with React Router's history management
- ❌ Manual event listener management
- ❌ Less common pattern (harder to maintain)
- ❌ Requires careful synchronization with React state

**Performance:** Excellent - in-memory, browser-native

**Future Scalability:**
- ⚠️ Moderate - may conflict with React Router internals
- ⚠️ Harder to integrate with global state library
- ⚠️ Less predictable behavior with SPA routing

**Testing Requirements:**
- E2E: Back/forward navigation, history manipulation
- Unit: Mock history API, popstate events
- Edge cases: History limits, state serialization

---

### Approach 6: Hybrid - SessionStorage + ScrollRestoration Component

**Description**: Use sessionStorage for filter/sort state + custom ScrollRestoration component for scroll position management.

**Implementation Details:**
```tsx
// ScrollRestoration component
function ScrollRestoration() {
  const location = useLocation();
  
  useEffect(() => {
    const key = `scroll_${location.pathname}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      window.scrollTo(0, parseInt(saved));
    }
    
    return () => {
      sessionStorage.setItem(key, window.scrollY.toString());
    };
  }, [location.pathname]);
  
  return null;
}

// Filter/sort in sessionStorage (Approach 2)
```

**Files to Modify:**
- [frontend/src/App.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/App.tsx:0:0-0:0) (add ScrollRestoration component)
- `frontend/src/components/ScrollRestoration.tsx` (new file)
- [frontend/src/hooks/useFilterSort.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:0:0-0:0) (add sessionStorage)
- [frontend/src/pages/PortfolioPage.tsx](cci:7://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:0:0-0:0) (integrate)

**LOC Estimate:** ~140-180 lines

**Pros:**
- ✅ Dedicated scroll management (separation of concerns)
- ✅ Reusable across all routes
- ✅ Follows existing localStorage pattern
- ✅ Clean, maintainable code structure
- ✅ Works with browser back/forward
- ✅ Easy to extend per-route

**Cons:**
- ❌ State lost on page refresh
- ❌ More files/components to maintain
- ❌ SessionStorage I/O overhead
- ❌ Requires careful key management for scroll positions

**Performance:** Very Good - minimal I/O, well-optimized

**Future Scalability:**
- ✅ Excellent - scroll restoration is independent
- ✅ Filter/sort can easily migrate to global state
- ✅ Modular design supports future changes

**Testing Requirements:**
- E2E: Multi-route scroll restoration
- Unit: ScrollRestoration component, sessionStorage mocking
- Edge cases: Rapid navigation, storage errors

---

## Trade Study Matrix

| Criteria | Approach 1: Router State | Approach 2: SessionStorage | Approach 3: URL Params | Approach 4: Context | Approach 5: History API | Approach 6: Hybrid |
|----------|-------------------------|---------------------------|------------------------|---------------------|------------------------|-------------------|
| **LOC Estimate** | 80-100 | 120-150 | 100-130 | 180-220 | 90-120 | 140-180 |
| **Implementation Complexity** | Low | Low-Medium | Medium | Medium-High | Medium | Medium |
| **Survives Refresh** | ❌ | ❌ | ✅ (filter/sort) | ❌ | ❌ | ❌ |
| **Scroll Restoration** | Manual | Manual | Manual | Manual | Built-in | Built-in |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Future Scalability** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Testing Complexity** | Low | Low | Medium | Medium | High | Medium |
| **Follows Codebase Patterns** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Migration Path** | Easy | Easy | Hard | Medium | Hard | Easy |
| **Violates Constraints** | No | No | No | Yes (adds global state) | No | No |

---

## Recommendation

### 🏆 **Recommended Approach: Approach 6 - Hybrid (SessionStorage + ScrollRestoration)**

**Rationale:**

1. **Best Scalability**: Modular design allows easy migration to global state library later
2. **Follows Existing Patterns**: Matches the localStorage pattern already used for portfolio data
3. **Separation of Concerns**: Scroll restoration is independent from filter/sort state
4. **Maintainability**: Clean, well-structured code that's easy to understand and extend
5. **No Constraint Violations**: Doesn't introduce global state (Context would violate this)
6. **Reusability**: ScrollRestoration component can be used across all routes
7. **Testing**: Moderate complexity, well-defined boundaries

**Why Not Others:**

- **Approach 1 (Router State)**: Too limited, state lost on refresh, manual scroll management
- **Approach 2 (SessionStorage only)**: Good, but less organized than hybrid approach
- **Approach 3 (URL Params)**: URL pollution, doesn't feel right for ephemeral UI state
- **Approach 4 (Context)**: Violates "no global state" constraint, may conflict with future state library
- **Approach 5 (History API)**: Too complex, potential React Router conflicts, uncommon pattern

**Trade-offs Accepted:**

- State lost on page refresh (acceptable for navigation UX state)
- SessionStorage I/O overhead (minimal, worth the benefits)
- Slightly more LOC than simplest approach (worth it for maintainability)

---

## 📋 DELIVERABLE COMPLETE

**Phase 2 Trade Study delivered. Waiting for your review.**

Please review and let me know:
1. Do you agree with the recommended approach (Hybrid)?
2. Any concerns about the trade-offs?
3. Should I proceed to Phase 3 (Detailed Design)?