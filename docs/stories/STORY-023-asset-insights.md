# STORY-023: Asset-Level Insights & Metrics

## Related Requirement
- [REQ-012-analytics](../requirements/REQ-012-analytics.md)

## Related Backlog Item
- [23] Asset-Level Insights & Metrics

## Description
As a crypto investor, I want to see detailed metrics and insights for each asset in my portfolio, so that I can understand its performance, position relative to historical highs/lows, and make informed decisions about holding or selling.

## User Value
- **Investment context:** Understand if an asset is near ATH (overbought) or ATL (potential value)
- **Performance tracking:** See rank changes and supply dynamics
- **Decision support:** Data-driven insights for buy/sell decisions
- **Professional appearance:** Institutional-grade metrics in a retail app

## Acceptance Criteria

### Asset Row Enhancements
- [ ] **AC1:** Each asset row displays 24h high and low prices
- [ ] **AC2:** Current price position indicator between 24h high/low (visual bar or percentage)
- [ ] **AC3:** All-time high (ATH) price and date displayed
- [ ] **AC4:** Distance from ATH shown as percentage (e.g., "-45% from ATH")
- [ ] **AC5:** All-time low (ATL) price and date displayed
- [ ] **AC6:** Distance from ATL shown as percentage (e.g., "+1,250% from ATL")

### Market Position Metrics
- [ ] **AC7:** Market cap rank displayed with badge (e.g., "#1", "#5", "#100")
- [ ] **AC8:** Rank change indicator (↑↓) if rank changed in 24h
- [ ] **AC9:** Market cap displayed in formatted units (M, B, T)

### Supply Metrics
- [ ] **AC10:** Circulating supply displayed
- [ ] **AC11:** Max supply displayed (or "∞" if unlimited)
- [ ] **AC12:** Supply progress bar showing circulating/max ratio
- [ ] **AC13:** Inflation indicator if circulating < max (e.g., "85% minted")

### Price History Sparklines
- [ ] **AC14:** 7-day price sparkline chart displayed
- [ ] **AC15:** 30-day price change percentage badge
- [ ] **AC16:** Sparkline color-coded (green if up, red if down)

### UI/UX
- [ ] **AC17:** Metrics are displayed in expandable asset row or detail panel
- [ ] **AC18:** Toggle to show/hide advanced metrics
- [ ] **AC19:** Tooltips explain each metric (e.g., "What is ATH?")
- [ ] **AC20:** Responsive layout on mobile (stacked metrics)
- [ ] **AC21:** Loading states for metrics
- [ ] **AC22:** Graceful handling of missing data (e.g., no max supply)

### Performance
- [ ] **AC23:** Metrics use existing `/coins/markets` data (no additional API calls)
- [ ] **AC24:** Sparkline data cached for 1 hour
- [ ] **AC25:** Expanding metrics doesn't cause re-render of entire list

## Planning
- **Estimate:** 5 Story Points
- **Priority:** Medium (Phase 1)
- **Sprint:** TBD
- **Dependencies:** Existing AssetList and AssetRow components

## Architecture

### Component Structure
```
/src
├── components/
│   ├── AssetRow/
│   │   ├── index.tsx (extend existing)
│   │   ├── AssetMetrics.tsx (new)
│   │   ├── PriceRangeIndicator.tsx (new)
│   │   ├── SupplyProgress.tsx (new)
│   │   └── PriceSparkline.tsx (new)
├── hooks/
│   └── useAssetMetrics.ts (new - optional)
├── utils/
│   ├── formatters.ts (extend)
│   └── calculations.ts (new)
└── types/
    └── asset.ts (extend existing)
```

### Data Flow
```
AssetRow (existing)
  ↓
AssetMetrics (new expandable section)
  ├── PriceRangeIndicator (24h high/low)
  ├── ATH/ATL display
  ├── Market rank badge
  ├── SupplyProgress
  └── PriceSparkline
```

### Data Source
**All data from existing `/coins/markets` response:**
```typescript
{
  ath: number,
  ath_change_percentage: number,
  ath_date: string,
  atl: number,
  atl_change_percentage: number,
  atl_date: string,
  high_24h: number,
  low_24h: number,
  market_cap_rank: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number | null,
  price_change_percentage_7d_in_currency: number,
  sparkline_in_7d: { price: number[] } // if requested
}
```

### State Management
- Extend existing asset state (no new API calls)
- Add `showMetrics` boolean to toggle expanded view
- Memoize calculations (distance from ATH/ATL, supply percentage)

## Task Breakdown

### 1. Setup & Types (0.5 SP)
- [ ] **T1.1:** Extend `types/asset.ts` with new metric fields
- [ ] **T1.2:** Create `utils/calculations.ts` for metric calculations
- [ ] **T1.3:** Extend `utils/formatters.ts` with date formatting

### 2. Utility Functions (0.5 SP)
- [ ] **T2.1:** Create `calculateDistanceFromATH()` function
- [ ] **T2.2:** Create `calculateDistanceFromATL()` function
- [ ] **T2.3:** Create `calculateSupplyPercentage()` function
- [ ] **T2.4:** Create `formatDate()` for ATH/ATL dates
- [ ] **T2.5:** Write unit tests for all calculations

### 3. UI Components (2 SP)
- [ ] **T3.1:** Create `PriceRangeIndicator` component (24h high/low bar)
- [ ] **T3.2:** Create `SupplyProgress` component (progress bar)
- [ ] **T3.3:** Create `PriceSparkline` component (mini chart)
- [ ] **T3.4:** Create `AssetMetrics` container component
- [ ] **T3.5:** Add tooltips for each metric
- [ ] **T3.6:** Style with Tailwind CSS
- [ ] **T3.7:** Add loading skeletons

### 4. AssetRow Integration (1 SP)
- [ ] **T4.1:** Add expand/collapse toggle to AssetRow
- [ ] **T4.2:** Integrate AssetMetrics into expanded state
- [ ] **T4.3:** Add market cap rank badge to main row
- [ ] **T4.4:** Add 24h change sparkline to main row (optional)
- [ ] **T4.5:** Ensure no performance regression (memoization)

### 5. API Enhancement (0.5 SP)
- [ ] **T5.1:** Update `/coins/markets` call to include sparkline data
- [ ] **T5.2:** Ensure all required fields are fetched
- [ ] **T5.3:** Handle missing data gracefully (null max_supply, etc.)

### 6. Testing (0.5 SP)
- [ ] **T6.1:** Write unit tests for calculation utilities
- [ ] **T6.2:** Write component tests for PriceRangeIndicator
- [ ] **T6.3:** Write component tests for SupplyProgress
- [ ] **T6.4:** Write integration tests for AssetMetrics
- [ ] **T6.5:** Write E2E test for expand/collapse functionality
- [ ] **T6.6:** Test with various data scenarios (no max supply, etc.)

### 7. Polish & Documentation (0.5 SP)
- [ ] **T7.1:** Add accessibility labels
- [ ] **T7.2:** Test keyboard navigation (expand/collapse)
- [ ] **T7.3:** Optimize performance (React.memo if needed)
- [ ] **T7.4:** Add educational tooltips
- [ ] **T7.5:** Code review and refinements

## Technical Notes

### Distance from ATH/ATL Calculation
```typescript
const calculateDistanceFromATH = (currentPrice: number, ath: number): number => {
  return ((currentPrice - ath) / ath) * 100;
};

// Example: Current $30k, ATH $69k
// Result: -56.5% from ATH
```

### 24h Price Range Indicator
```typescript
const PriceRangeIndicator = ({ current, low, high }) => {
  const position = ((current - low) / (high - low)) * 100;
  
  return (
    <div className="relative h-2 bg-gray-200 rounded">
      <div className="absolute h-full bg-gradient-to-r from-red-500 to-green-500 rounded" 
           style={{ width: '100%' }} />
      <div className="absolute h-4 w-1 bg-blue-600 rounded" 
           style={{ left: `${position}%`, top: '-4px' }} />
    </div>
  );
};
```

### Supply Progress Bar
```typescript
const SupplyProgress = ({ circulating, max }) => {
  if (!max) return <span>Unlimited Supply</span>;
  
  const percentage = (circulating / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{formatNumber(circulating)} / {formatNumber(max)}</span>
        <span>{percentage.toFixed(1)}% minted</span>
      </div>
      <div className="h-2 bg-gray-200 rounded mt-1">
        <div className="h-full bg-blue-500 rounded" 
             style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
```

### Memoization for Performance
```typescript
const AssetRow = React.memo(({ asset }) => {
  const metrics = useMemo(() => ({
    athDistance: calculateDistanceFromATH(asset.current_price, asset.ath),
    atlDistance: calculateDistanceFromATL(asset.current_price, asset.atl),
    supplyPercentage: calculateSupplyPercentage(asset.circulating_supply, asset.max_supply)
  }), [asset.current_price, asset.ath, asset.atl, asset.circulating_supply, asset.max_supply]);
  
  // ... render
});
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] No performance regression (verified with React DevTools Profiler)
- [ ] Responsive on mobile and desktop
- [ ] Accessibility verified
- [ ] Educational tooltips added
- [ ] Documentation updated
- [ ] Merged to main branch

## Future Enhancements (Out of Scope)
- Historical ATH/ATL chart (show all-time price range)
- Alerts when approaching ATH or ATL
- Comparison to similar assets in category
- Social sentiment for each asset
- News feed integration
- On-chain metrics (active addresses, transactions)
