
# Phase 1: Analysis & Discovery Report
Ref docs: ./KI-04.md

## 1. Current State Analysis

### Routing Setup

**Router Configuration** (`@/Users/nati/Projects/crypture/frontend/src/App.tsx:1-26`)
```tsx
<Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/portfolio" element={<PortfolioPage />} />
    <Route path="/market" element={<MarketPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/coin/:coinId" element={<CoinDetailPage />} />
    <Route path="/compare" element={<CoinComparisonPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</Router>
```

- **Router Type**: `BrowserRouter` (standard HTML5 history API)
- **No ScrollRestoration**: No React Router `ScrollRestoration` component found
- **No Layout Wrapper**: Routes are direct page components, no shared layout wrapper

### Components Involved in Navigation Flow

#### 1. **Portfolio Dashboard** (`@/Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx`)

**State Management:**
- **Filter Text**: Managed by [useFilterSort](cci:1://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:3:0-52:1) hook (`@/Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:10`)
  ```tsx
  const [filterText, setFilterText] = useState(initialFilter);
  ```
  - Default: `""` (empty string)
  - Local component state only

- **Sort Option**: Managed by [useFilterSort](cci:1://file:///Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:3:0-52:1) hook (`@/Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts:9`)
  ```tsx
  const [sortOption, setSortOption] = useState(initialSort);
  ```
  - Default: `"name-asc"`
  - Local component state only

- **Scroll Position**: Not explicitly managed
  - Browser default behavior (resets to top on navigation)

**Navigation to Coin Details:**
- Triggered via `Link` component in `AssetRow` (`@/Users/nati/Projects/crypture/frontend/src/components/AssetRow/index.tsx:287`)
  ```tsx
  <Link to={`/coin/${asset.coinInfo.id}`} ...>
  ```

#### 2. **Coin Details Page** (`@/Users/nati/Projects/crypture/frontend/src/pages/CoinDetailPage.tsx`)

**Navigation Back:**
- Uses `navigate(-1)` for back navigation (`@/Users/nati/Projects/crypture/frontend/src/pages/CoinDetailPage.tsx:16-18`)
  ```tsx
  const handleBack = () => {
    navigate(-1);
  };
  ```
  - This triggers browser history back
  - No state is passed during navigation

**State:**
- Local state for chart time range (`selectedTimeRange`)
- No awareness of portfolio page state

#### 3. **Supporting Components**

- **FilterSortControls**: Receives filter/sort as props, no internal state
- **AssetList**: Stateless presentation component
- **AssetRow**: Has local UI state (editing, chart visibility) but not persisted
- **PortfolioCompositionDashboard**: Stateless, receives data as props

### Current State Management Approach

**Portfolio Data** (`@/Users/nati/Projects/crypture/frontend/src/hooks/usePortfolioState.ts`):
- ✅ **Persisted**: Portfolio assets stored in `localStorage`
- ✅ **Survives navigation**: Data hydrated on mount

**Filter/Sort State** (`@/Users/nati/Projects/crypture/frontend/src/hooks/useFilterSort.ts`):
- ❌ **Not persisted**: Pure React state
- ❌ **Lost on unmount**: Component unmounts when navigating away
- ❌ **No restoration**: No mechanism to restore on return

**Scroll Position**:
- ❌ **Not managed**: Browser default behavior
- ❌ **Resets to top**: On every navigation

**Modal/UI State**:
- Local component state in `useUIState` hook
- Not relevant to navigation (modals close before navigation)

---

## 2. Problem Characterization

### What Exactly Is Being Lost?

1. **Scroll Position**
   - **Lost**: User's vertical scroll position in the asset list
   - **When**: On navigation to `/coin/:coinId` and back
   - **Impact**: User must manually scroll to find their place

2. **Filter Text**
   - **Lost**: Any text entered in the filter input
   - **When**: [PortfolioPage](cci:1://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:37:0-531:1) component unmounts
   - **Impact**: User must re-enter search terms

3. **Sort Option**
   - **Lost**: Selected sort option (e.g., "value-desc")
   - **When**: [PortfolioPage](cci:1://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:37:0-531:1) component unmounts
   - **Impact**: List returns to default "name-asc" sort

### Why Is State Being Lost?

**Root Cause: Component Lifecycle**

```
User Flow:
1. PortfolioPage mounts → useFilterSort initializes with defaults
2. User sets filter="bitcoin", sort="value-desc", scrolls to position 500px
3. User clicks coin detail link → PortfolioPage UNMOUNTS
4. CoinDetailPage mounts
5. User clicks back → CoinDetailPage unmounts, PortfolioPage RE-MOUNTS
6. useFilterSort re-initializes with defaults → state lost
7. Browser scrolls to top (default behavior)
```

**Technical Details:**

- **React Router behavior**: When navigating between routes, the previous route's component tree is completely unmounted
- **useState initialization**: `useState(initialFilter)` always uses the default value on mount
- **No persistence layer**: Filter/sort state exists only in component memory
- **Browser scroll restoration**: React Router doesn't automatically restore scroll position for SPA navigation

### At What Point Does State Loss Occur?

**Exact Lifecycle Point:**
- **Filter/Sort**: Lost during [PortfolioPage](cci:1://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:37:0-531:1) unmount (before navigation completes)
- **Scroll**: Reset when [PortfolioPage](cci:1://file:///Users/nati/Projects/crypture/frontend/src/pages/PortfolioPage.tsx:37:0-531:1) re-mounts and browser scrolls to top

### Existing Patterns for State Preservation?

**Currently in Codebase:**

✅ **localStorage pattern** (`@/Users/nati/Projects/crypture/frontend/src/hooks/usePortfolioState.ts:36-44`):
```tsx
useEffect(() => {
  if (!isLoading && isHydrated.current) {
    const toSave = portfolio.map(a => ({
      asset: a.coinInfo.symbol.toLowerCase(),
      qty: a.quantity,
    }));
    savePortfolio(toSave);
  }
}, [portfolio, isLoading]);
```
- Used for portfolio data persistence
- Service layer: [localStorageService.ts](cci:7://file:///Users/nati/Projects/crypture/frontend/src/services/localStorageService.ts:0:0-0:0)
- Pattern: Save on change, load on mount

✅ **Alert service** uses localStorage (`@/Users/nati/Projects/crypture/frontend/src/services/alertService.ts`)

❌ **No URL state pattern**: No query parameters used for UI state
❌ **No React Router location state**: No `useLocation().state` usage
❌ **No scroll restoration**: No `ScrollRestoration` component or manual scroll management

---

## Summary

**Current Architecture:**
- Simple routing with no state preservation mechanisms
- Filter/sort state is ephemeral (component-scoped)
- No scroll position management
- Existing localStorage pattern for persistent data (portfolio, alerts)

**Problem Impact:**
- Poor UX when navigating to coin details and back
- Forces users to re-establish their context (filter, sort, scroll position)
- Breaks user's mental model of "going back" to where they were

**Key Constraints:**
- No global state library (Redux, Zustand, etc.)
- Must work with existing React Router setup
- TypeScript type safety required
- Should not break existing functionality

---

## 📋 DELIVERABLE COMPLETE

**Waiting for your review before proceeding to Phase 2: Trade Study**

Please review this analysis and let me know if:
1. The analysis accurately captures the current state
2. Any additional areas need investigation
3. You're ready for me to proceed to Phase 2 (comparing solution approaches)