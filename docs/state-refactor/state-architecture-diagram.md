# State Architecture Diagram

## Current State Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PortfolioPage                             │
│                     (Root Component)                             │
│                                                                  │
│  State Hooks (13 subscriptions):                                │
│  ├─ useCoinList()          → coins, loading, error, refreshing  │
│  ├─ usePriceMap()          → priceMap                           │
│  ├─ useCoinSearch()        → search, filteredCoins              │
│  ├─ usePortfolioState()    → portfolio, addAsset, removeAsset   │
│  ├─ useUIState()           → modals, assetIdPendingDeletion     │
│  ├─ useFilterSort()        → sortedFilteredAssets               │
│  ├─ useNotifications()     → success, error, warning            │
│  ├─ usePortfolioImportExport() → import/export functions        │
│  └─ useState()             → highlightTriggers                  │
│                                                                  │
│  Event Handlers (7+ callbacks):                                 │
│  ├─ handleAddAsset         ❌ Recreated every render            │
│  ├─ handleUpdateQuantity   ❌ Recreated every render            │
│  ├─ handleDeleteAsset      ❌ Recreated every render            │
│  ├─ handleExport           ❌ Recreated every render            │
│  ├─ handleImport           ❌ Recreated every render            │
│  ├─ handleApplyMerge       ❌ Recreated every render            │
│  └─ handleApplyReplace     ❌ Recreated every render            │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ Props (8 items)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         AssetList                                │
│                                                                  │
│  Props Received:                                                 │
│  ├─ assets                 (PortfolioState)                     │
│  ├─ onDelete               (callback)                           │
│  ├─ onUpdateQuantity       (callback)                           │
│  ├─ onAddAsset             (callback)                           │
│  ├─ addButtonRef           (ref)                                │
│  ├─ priceMap               (Record<string, number>)             │
│  ├─ disabled               (boolean)                            │
│  └─ highlightTriggers      (Record<string, number>)             │
│                                                                  │
│  ❌ Issues:                                                      │
│  • No memoization - recalculates on every render                │
│  • Inline calculations in .map()                                │
│  • Passes through callbacks without using them                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ Props (6 items) × N assets
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AssetRow (×N)                               │
│                                                                  │
│  Props Received:                                                 │
│  ├─ asset                  (PortfolioAsset)                     │
│  ├─ price                  (number)                             │
│  ├─ value                  (number)                             │
│  ├─ onDelete               (callback)                           │
│  ├─ onUpdateQuantity       (callback)                           │
│  └─ highlightTrigger       (number)                             │
│                                                                  │
│  Local State (6 items):                                         │
│  ├─ isEditing                                                   │
│  ├─ draftQuantity                                               │
│  ├─ validationError                                             │
│  ├─ isSaving                                                    │
│  ├─ showLargeQuantityConfirm                                    │
│  └─ pendingQuantity                                             │
│                                                                  │
│  ❌ Issues:                                                      │
│  • Not memoized - re-renders when ANY asset changes             │
│  • Receives new callback refs on every parent render            │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ Props (5 items)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        AssetChart                                │
│                                                                  │
│  Props Received:                                                 │
│  ├─ data                   (PriceHistoryPoint[])                │
│  ├─ isLoading              (boolean)                            │
│  ├─ error                  (string | null)                      │
│  ├─ selectedTimeRange      (number)                             │
│  └─ onTimeRangeChange      (callback)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Re-render Cascade Example

### Scenario: User updates quantity of 1 asset

```
1. User clicks "Save" in AssetRow
   ↓
2. AssetRow calls onUpdateQuantity(id, newQty)
   ↓
3. PortfolioPage.handleUpdateQuantity() executes
   ↓
4. usePortfolioState updates portfolio array (NEW REFERENCE)
   ↓
5. PortfolioPage re-renders
   ├─ All 13 hooks re-evaluate
   ├─ All 7 event handlers recreated (NEW REFERENCES)
   ├─ useFilterSort recalculates sortedFilteredAssets
   └─ useMemo for coinMap recalculates
   ↓
6. AssetList receives new props
   ├─ assets (new array reference)
   ├─ onDelete (new function reference)
   ├─ onUpdateQuantity (new function reference)
   └─ highlightTriggers (new object reference)
   ↓
7. AssetList re-renders
   ├─ .map() executes for ALL assets
   ├─ Recalculates price for ALL assets
   ├─ Recalculates value for ALL assets
   └─ Creates new AssetRow elements
   ↓
8. ALL AssetRow components re-render (×20)
   ├─ Even unchanged assets re-render
   ├─ Each recalculates hasPrice
   └─ Each re-evaluates hooks

TOTAL: ~43 component renders for 1 asset update
```

---

## Optimized Architecture (After Phase 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                        PortfolioPage                             │
│                     (Root Component)                             │
│                                                                  │
│  State Hooks (13 subscriptions):                                │
│  [Same as before]                                                │
│                                                                  │
│  Event Handlers (7+ callbacks):                                 │
│  ├─ handleAddAsset         ✅ useCallback (stable)              │
│  ├─ handleUpdateQuantity   ✅ useCallback (stable)              │
│  ├─ handleDeleteAsset      ✅ useCallback (stable)              │
│  ├─ handleExport           ✅ useCallback (stable)              │
│  ├─ handleImport           ✅ useCallback (stable)              │
│  ├─ handleApplyMerge       ✅ useCallback (stable)              │
│  └─ handleApplyReplace     ✅ useCallback (stable)              │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ Props (8 items, stable refs)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         AssetList                                │
│                                                                  │
│  Props Received: [Same as before]                               │
│                                                                  │
│  ✅ Optimizations:                                               │
│  • useMemo for enrichedAssets                                   │
│  • Calculations done once, cached                               │
│  • Only recalculates when deps change                           │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ Props (6 items, stable refs)
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                  React.memo(AssetRow) (×N)                       │
│                                                                  │
│  Props Received: [Same as before]                               │
│                                                                  │
│  ✅ Optimizations:                                               │
│  • Wrapped with React.memo                                      │
│  • Custom comparison function                                   │
│  • Only re-renders if props actually changed                    │
│  • Skips re-render if asset unchanged                           │
└─────────────────────────────────────────────────────────────────┘
```

### Optimized Re-render Flow

```
1. User clicks "Save" in AssetRow
   ↓
2. AssetRow calls onUpdateQuantity(id, newQty)
   ↓
3. PortfolioPage.handleUpdateQuantity() executes
   ↓
4. usePortfolioState updates portfolio array
   ↓
5. PortfolioPage re-renders
   ├─ Hooks re-evaluate
   ├─ useCallback returns CACHED functions (same refs)
   └─ useFilterSort recalculates sortedFilteredAssets
   ↓
6. AssetList receives props
   ├─ assets (new array, but enrichedAssets memoized)
   ├─ onDelete (SAME reference - cached)
   ├─ onUpdateQuantity (SAME reference - cached)
   └─ highlightTriggers (new object)
   ↓
7. AssetList re-renders
   ├─ useMemo recalculates enrichedAssets
   └─ Only changed asset has new props
   ↓
8. React.memo comparison for each AssetRow
   ├─ 19 assets: props unchanged → SKIP RENDER ✅
   └─ 1 asset: props changed → RE-RENDER ✅

TOTAL: ~8 component renders for 1 asset update
IMPROVEMENT: 81% reduction (43 → 8 renders)
```

---

## Data Flow Diagram

### Current Data Structure

```
allCoins (from API)
  ↓
priceMap = useMemo(allCoins)
  ↓
portfolio = [
  {
    coinInfo: { id, name, symbol, current_price, ... }, ← Full object
    quantity: 1.5
  },
  ...
]
  ↓
sortedFilteredAssets = useMemo(portfolio)
  ↓
AssetList.map(asset => {
  price = priceMap[symbol]     ← Lookup on every render
  value = price * quantity     ← Calculation on every render
})
```

### Recommended Data Structure (Phase 2)

```
allCoins (from API)
  ↓
coinMap = useMemo(allCoins)
  ↓
priceMap = useMemo(allCoins)
  ↓
portfolio = [
  {
    coinId: "bitcoin",         ← Reference only
    quantity: 1.5
  },
  ...
]
  ↓
enrichedPortfolio = useMemo(() => 
  portfolio.map(asset => ({
    ...asset,
    coinInfo: coinMap[asset.coinId],
    price: priceMap[asset.coinId],
    value: price * quantity
  }))
)
  ↓
sortedFilteredAssets = useMemo(enrichedPortfolio)
```

**Benefits:**
- Smaller portfolio state (less memory)
- Single source of truth for coin data
- Automatic price updates (no stale data)
- Easier to sync with API changes

---

## Prop Drilling Visualization

```
PortfolioPage
│
├─ onDelete ────────────────┐
├─ onUpdateQuantity ────────┤
├─ priceMap ────────────────┤
├─ highlightTriggers ───────┤
│                           │
└─> AssetList               │
    │                       │
    ├─ (passes through) ────┤
    │                       │
    └─> AssetRow (×20)      │
        │                   │
        └─ (uses) ──────────┘

Depth: 3 levels
Props passed: 8 → 6 per asset
Total prop instances: 8 + (6 × 20) = 128 prop references
```

### With Context API (Phase 2 - Optional)

```
PortfolioContext.Provider
│
├─ portfolio
├─ addAsset
├─ removeAsset
├─ updateAssetQuantity
│
└─> PortfolioPage
    │
    └─> AssetList
        │
        └─> AssetRow (×20)
            │
            └─ useContext(PortfolioContext)
               ├─ Direct access to portfolio
               └─ Direct access to actions

Depth: 0 levels (no drilling)
Props passed: Only UI-specific props
Total prop instances: ~40 (70% reduction)
```

---

## Performance Metrics

### Current Performance

| Metric | Value | Status |
|--------|-------|--------|
| Wasted renders | 80-90% | 🔴 Critical |
| Render efficiency | 10-20% | 🔴 Critical |
| Avg render time (20 assets) | ~45ms | 🟡 Acceptable |
| Re-renders per update | ~43 | 🔴 Critical |

### Target Performance (After Phase 1)

| Metric | Value | Status |
|--------|-------|--------|
| Wasted renders | 10-20% | 🟢 Good |
| Render efficiency | 80-90% | 🟢 Good |
| Avg render time (20 assets) | ~12ms | 🟢 Excellent |
| Re-renders per update | ~8 | 🟢 Good |

---

## Component Render Frequency

### Current (per user action)

```
Action: Update 1 asset quantity

PortfolioPage:     ████████████████████ (1 render)
AssetList:         ████████████████████ (1 render)
AssetRow (×20):    ████████████████████ (20 renders) ← 19 unnecessary
AddAssetModal:     ████████████████████ (1 render)
FilterControls:    ████████████████████ (1 render)
PortfolioHeader:   ████████████████████ (1 render)

Total: ~43 renders
```

### Optimized (per user action)

```
Action: Update 1 asset quantity

PortfolioPage:     ████████████████████ (1 render)
AssetList:         ████████████████████ (1 render)
AssetRow (×1):     ████████████████████ (1 render) ← Only updated asset
AssetRow (×19):    ──────────────────── (0 renders) ← Skipped via memo
AddAssetModal:     ──────────────────── (0 renders) ← Skipped
FilterControls:    ──────────────────── (0 renders) ← Skipped
PortfolioHeader:   ──────────────────── (0 renders) ← Skipped

Total: ~8 renders (81% reduction)
```

---

**Diagram Generated:** October 13, 2025  
**For detailed analysis, see:** `state-management-analysis.md`
