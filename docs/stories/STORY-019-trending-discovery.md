# STORY-019: Trending & Discovery Feed

## Related Requirement
- [REQ-011-market-intel](../requirements/REQ-011-market-intel.md)

## Related Backlog Item
- [19] Trending & Discovery Feed

## Description
As a crypto investor, I want to see what coins are trending and which are the top movers, so that I can discover new investment opportunities and stay informed about market activity.

## User Value
- **Opportunity discovery:** Find coins gaining attention before they peak
- **FOMO mitigation:** See what others are researching and buying
- **Market pulse:** Understand which sectors/coins are hot
- **Daily engagement:** Compelling reason to check the app daily

## Acceptance Criteria

### Trending Coins Section
- [ ] **AC1:** Display top 7 trending coins (most searched in 24h)
- [ ] **AC2:** Each trending coin shows: name, symbol, rank, price, 24h change
- [ ] **AC3:** Trending coins refresh every 15 minutes
- [ ] **AC4:** Clicking a trending coin navigates to coin details (future) or adds to portfolio

### Top Gainers Section
- [ ] **AC5:** Display top 10 gainers by 24h price change percentage
- [ ] **AC6:** Each gainer shows: name, symbol, price, 24h change %, market cap
- [ ] **AC7:** Gainers are sorted by highest percentage gain
- [ ] **AC8:** Percentage changes are color-coded green with up arrow

### Top Losers Section
- [ ] **AC9:** Display top 10 losers by 24h price change percentage
- [ ] **AC10:** Each loser shows: name, symbol, price, 24h change %, market cap
- [ ] **AC11:** Losers are sorted by highest percentage loss
- [ ] **AC12:** Percentage changes are color-coded red with down arrow

### Highest Volume Section
- [ ] **AC13:** Display top 10 coins by 24h trading volume
- [ ] **AC14:** Each coin shows: name, symbol, price, 24h volume, market cap
- [ ] **AC15:** Volume is formatted with appropriate units (M, B)

### UI/UX
- [ ] **AC16:** Discovery feed is accessible from main navigation (new "Discover" tab)
- [ ] **AC17:** Sections are clearly labeled with icons
- [ ] **AC18:** Layout uses cards or table format (responsive)
- [ ] **AC19:** Loading states shown for each section independently
- [ ] **AC20:** Error states shown with retry option per section
- [ ] **AC21:** User can refresh all sections with one button
- [ ] **AC22:** Last updated timestamp displayed

### Performance
- [ ] **AC23:** Data cached for 15 minutes per section
- [ ] **AC24:** Sections load independently (don't block each other)
- [ ] **AC25:** Page loads in under 3 seconds total

### Interactions
- [ ] **AC26:** Clicking a coin shows quick actions: "Add to Portfolio" or "View Details"
- [ ] **AC27:** Hover/tap shows additional info (market cap rank, volume)
- [ ] **AC28:** Mobile: swipe to see more coins in each section

## Planning
- **Estimate:** 8 Story Points
- **Priority:** High (Phase 1)
- **Sprint:** TBD
- **Dependencies:** None

## Architecture

### Component Structure
```
/src
├── pages/
│   └── DiscoverPage.tsx (new)
├── components/
│   ├── Discovery/
│   │   ├── index.tsx (new)
│   │   ├── TrendingCoins.tsx (new)
│   │   ├── TopMovers.tsx (new)
│   │   ├── HighestVolume.tsx (new)
│   │   └── CoinListItem.tsx (new - reusable)
├── hooks/
│   ├── useTrendingCoins.ts (new)
│   ├── useTopMovers.ts (new)
│   └── useHighestVolume.ts (new)
├── services/
│   └── coingeckoApi.ts (extend)
└── types/
    └── discovery.ts (new)
```

### Data Flow
```
DiscoverPage
  ├── TrendingCoins → useTrendingCoins → /search/trending
  ├── TopMovers → useTopMovers → /coins/markets?order=...
  └── HighestVolume → useHighestVolume → /coins/markets?order=volume_desc
```

### API Integration

**Trending Coins:**
- Endpoint: `GET /search/trending`
- Returns: Top 7 trending coins

**Top Gainers:**
- Endpoint: `GET /coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&page=1`

**Top Losers:**
- Endpoint: `GET /coins/markets?vs_currency=usd&order=price_change_percentage_24h_asc&per_page=10&page=1`

**Highest Volume:**
- Endpoint: `GET /coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1`

### State Management
- Each section has independent loading/error state
- Cache per section (15 minutes)
- Parallel data fetching (Promise.all or independent hooks)

## Task Breakdown

### 1. Setup & Types (0.5 SP)
- [ ] **T1.1:** Create `types/discovery.ts` with interfaces
- [ ] **T1.2:** Create hook skeletons (useTrendingCoins, useTopMovers, useHighestVolume)
- [ ] **T1.3:** Create `pages/DiscoverPage.tsx` skeleton
- [ ] **T1.4:** Add route to router

### 2. API Integration (1.5 SP)
- [ ] **T2.1:** Extend `coingeckoApi.ts` with `fetchTrendingCoins()`
- [ ] **T2.2:** Add `fetchTopGainers()` function
- [ ] **T2.3:** Add `fetchTopLosers()` function
- [ ] **T2.4:** Add `fetchHighestVolume()` function
- [ ] **T2.5:** Implement caching per endpoint (15-minute cache)
- [ ] **T2.6:** Add error handling and retry logic
- [ ] **T2.7:** Test all API functions manually

### 3. Custom Hooks (2 SP)
- [ ] **T3.1:** Implement `useTrendingCoins` with loading/error states
- [ ] **T3.2:** Implement `useTopMovers` (gainers + losers logic)
- [ ] **T3.3:** Implement `useHighestVolume`
- [ ] **T3.4:** Add auto-refresh logic (15-minute interval)
- [ ] **T3.5:** Add manual refresh functions
- [ ] **T3.6:** Write unit tests for all hooks

### 4. UI Components (2.5 SP)
- [ ] **T4.1:** Create `CoinListItem` component (reusable row/card)
- [ ] **T4.2:** Create `TrendingCoins` section component
- [ ] **T4.3:** Create `TopMovers` section (gainers + losers tabs or split)
- [ ] **T4.4:** Create `HighestVolume` section component
- [ ] **T4.5:** Create `Discovery` container component (layout)
- [ ] **T4.6:** Add loading skeleton for each section
- [ ] **T4.7:** Add error states with retry buttons
- [ ] **T4.8:** Style with Tailwind CSS (cards/table layout)
- [ ] **T4.9:** Add icons for sections (trending, up/down arrows, volume)

### 5. Interactions (1 SP)
- [ ] **T5.1:** Implement "Add to Portfolio" quick action
- [ ] **T5.2:** Add hover/tap tooltips for additional info
- [ ] **T5.3:** Implement mobile swipe/scroll for horizontal lists
- [ ] **T5.4:** Add click handlers for coin navigation (placeholder for future)

### 6. Page Integration (0.5 SP)
- [ ] **T6.1:** Implement `DiscoverPage` with all sections
- [ ] **T6.2:** Add navigation link to header/sidebar
- [ ] **T6.3:** Add global refresh button
- [ ] **T6.4:** Add last updated timestamps per section

### 7. Testing (1 SP)
- [ ] **T7.1:** Write unit tests for all hooks
- [ ] **T7.2:** Write component tests for CoinListItem
- [ ] **T7.3:** Write integration tests for each section
- [ ] **T7.4:** Write E2E test for discover page and interactions
- [ ] **T7.5:** Test responsive layout and mobile swipe
- [ ] **T7.6:** Test error scenarios and retry

### 8. Polish & Documentation (0.5 SP)
- [ ] **T8.1:** Add accessibility labels (ARIA)
- [ ] **T8.2:** Test keyboard navigation
- [ ] **T8.3:** Optimize performance (memoization, virtualization if needed)
- [ ] **T8.4:** Add empty states (if no data)
- [ ] **T8.5:** Code review and refinements

## Technical Notes

### Parallel Data Fetching
```typescript
const DiscoverPage = () => {
  const trending = useTrendingCoins();
  const gainers = useTopMovers('gainers');
  const losers = useTopMovers('losers');
  const volume = useHighestVolume();
  
  // Each hook fetches independently
  // No blocking between sections
};
```

### Caching Strategy
```typescript
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};
```

### Responsive Layout
- **Desktop:** 4 sections in 2x2 grid
- **Tablet:** 2 sections per row
- **Mobile:** Stacked sections, horizontal scroll within each

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility verified
- [ ] Performance verified (loads <3s)
- [ ] Documentation updated
- [ ] Merged to main branch

## Future Enhancements (Out of Scope)
- Personalized recommendations based on portfolio
- Filter by category (DeFi, NFT, Gaming, etc.)
- Watchlist functionality
- Price alerts from discovery feed
- Social sentiment indicators
