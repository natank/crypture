# STORY-018: Market Overview Dashboard

## Related Requirement
- [REQ-011-market-intel](../requirements/REQ-011-market-intel.md)

## Related Backlog Item
- [18] Market Overview Dashboard

## Description
As a crypto investor, I want to see a comprehensive market overview dashboard showing global crypto metrics, so that I can understand the overall market context before making portfolio decisions.

## User Value
- **Context for decisions:** Understand if portfolio gains/losses are due to individual choices or market-wide movements
- **Market awareness:** Stay informed about total market cap, volume, and dominance trends
- **Daily engagement:** Create a habit of checking market conditions before trading

## Acceptance Criteria

### Display Requirements
- [ ] **AC1:** Dashboard displays total crypto market cap in USD
- [ ] **AC2:** Dashboard displays 24h total trading volume in USD
- [ ] **AC3:** Dashboard displays BTC dominance percentage
- [ ] **AC4:** Dashboard displays ETH dominance percentage
- [ ] **AC5:** Dashboard displays market cap change (24h) with percentage and color coding (green/red)
- [ ] **AC6:** Dashboard displays active cryptocurrencies count
- [ ] **AC7:** Dashboard displays active markets count

### Data Refresh
- [ ] **AC8:** Market data refreshes automatically every 10 minutes
- [ ] **AC9:** User can manually refresh data with a refresh button
- [ ] **AC10:** Last updated timestamp is displayed
- [ ] **AC11:** Loading state is shown during data fetch

### UI/UX
- [ ] **AC12:** Dashboard is accessible from main navigation (new "Market" tab)
- [ ] **AC13:** Layout is responsive on mobile and desktop
- [ ] **AC14:** Numbers are formatted with appropriate units (K, M, B, T)
- [ ] **AC15:** Percentage changes show up/down arrows and color coding
- [ ] **AC16:** Error state is shown if API fails, with retry option

### Performance
- [ ] **AC17:** Data is cached for 10 minutes to minimize API calls
- [ ] **AC18:** Dashboard loads in under 2 seconds on initial visit
- [ ] **AC19:** Subsequent visits load from cache instantly

## Planning
- **Estimate:** 5 Story Points
- **Priority:** High (Phase 1)
- **Sprint:** TBD
- **Dependencies:** None

## Architecture

### Component Structure
```
/src
├── pages/
│   └── MarketPage.tsx (new)
├── components/
│   ├── MarketOverview/
│   │   ├── index.tsx (new)
│   │   ├── MarketMetricCard.tsx (new)
│   │   └── DominanceChart.tsx (new - optional)
├── hooks/
│   └── useGlobalMarketData.ts (new)
├── services/
│   └── coingeckoApi.ts (extend existing)
└── types/
    └── market.ts (new)
```

### Data Flow
```
MarketPage → useGlobalMarketData → CoinGecko API (/global)
           ↓
       MarketOverview component
           ↓
       MarketMetricCard (×6-7 cards)
```

### API Integration
**Endpoint:** `GET /global`

**Response Structure:**
```typescript
{
  data: {
    total_market_cap: { usd: number },
    total_volume_24h: { usd: number },
    market_cap_percentage: { btc: number, eth: number },
    market_cap_change_percentage_24h_usd: number,
    active_cryptocurrencies: number,
    markets: number,
    updated_at: number
  }
}
```

### State Management
- Use existing pattern: custom hook with `useState` + `useEffect`
- Cache in memory with timestamp
- No localStorage needed (market data changes frequently)

## Task Breakdown

### 1. Setup & Types (0.5 SP)
- [ ] **T1.1:** Create `types/market.ts` with TypeScript interfaces
- [ ] **T1.2:** Create `hooks/useGlobalMarketData.ts` skeleton
- [ ] **T1.3:** Create `pages/MarketPage.tsx` skeleton
- [ ] **T1.4:** Add route to router configuration

### 2. API Integration (1 SP)
- [ ] **T2.1:** Extend `coingeckoApi.ts` with `fetchGlobalMarketData()` function
- [ ] **T2.2:** Implement caching logic (10-minute cache)
- [ ] **T2.3:** Add error handling and retry logic
- [ ] **T2.4:** Test API integration manually

### 3. Custom Hook (1 SP)
- [ ] **T3.1:** Implement `useGlobalMarketData` hook with loading/error states
- [ ] **T3.2:** Add auto-refresh logic (10-minute interval)
- [ ] **T3.3:** Add manual refresh function
- [ ] **T3.4:** Implement cache invalidation
- [ ] **T3.5:** Write unit tests for hook

### 4. UI Components (1.5 SP)
- [ ] **T4.1:** Create `MarketMetricCard` component (reusable card)
- [ ] **T4.2:** Create `MarketOverview` component (grid layout)
- [ ] **T4.3:** Implement number formatting utilities (K, M, B, T)
- [ ] **T4.4:** Add loading skeleton states
- [ ] **T4.5:** Add error state UI with retry button
- [ ] **T4.6:** Style with Tailwind CSS following design system

### 5. Page Integration (0.5 SP)
- [ ] **T5.1:** Implement `MarketPage` with hook integration
- [ ] **T5.2:** Add navigation link to header/sidebar
- [ ] **T5.3:** Add last updated timestamp display
- [ ] **T5.4:** Add manual refresh button

### 6. Testing (0.5 SP)
- [ ] **T6.1:** Write unit tests for `useGlobalMarketData` hook
- [ ] **T6.2:** Write component tests for `MarketMetricCard`
- [ ] **T6.3:** Write integration tests for `MarketOverview`
- [ ] **T6.4:** Write E2E test for market page navigation and data display
- [ ] **T6.5:** Test responsive layout on mobile/desktop

### 7. Polish & Documentation (0.5 SP)
- [ ] **T7.1:** Add accessibility labels (ARIA)
- [ ] **T7.2:** Test keyboard navigation
- [ ] **T7.3:** Optimize performance (memoization if needed)
- [ ] **T7.4:** Update documentation (if needed)
- [ ] **T7.5:** Code review and refinements

## Technical Notes

### Caching Strategy
```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let cachedData: GlobalMarketData | null = null;
let cacheTimestamp: number = 0;

const isCacheValid = () => {
  return cachedData && (Date.now() - cacheTimestamp) < CACHE_DURATION;
};
```

### Number Formatting
```typescript
const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};
```

### Auto-Refresh Pattern
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      refetch();
    }
  }, 10 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] Responsive on mobile and desktop
- [ ] Accessibility verified (keyboard nav, screen readers)
- [ ] Performance verified (loads <2s)
- [ ] Documentation updated
- [ ] Merged to main branch

## Future Enhancements (Out of Scope)
- Historical market cap chart (7D, 30D trends)
- Fear & Greed Index integration
- Market sentiment indicators
- Dominance chart visualization
