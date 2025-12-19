# Requirements Analysis: Backlog Item 27 - Compare Coins Side-by-Side

## Source Requirement
**REQ-014: Investment Research** - [Link](../../requirements/REQ-014-research.md)

---

## Key Functional Requirements

### FR-1: Coin Selection for Comparison
- Users shall be able to select 2-3 coins for side-by-side comparison
- Selection can be initiated from:
  - Coin Detail Page ("Compare with..." action)
  - Portfolio asset rows
  - Market listings
  - Dedicated comparison page with search/selection

### FR-2: Comparative Metrics Display
- Display key metrics side-by-side for selected coins:
  - Current price
  - Market cap
  - 24h volume
  - 24h/7d/30d price change percentages
  - ATH/ATL with dates
  - Circulating/Total/Max supply
- Visual indicators for which coin performs better in each metric

### FR-3: Overlaid Price Charts
- Display price history charts with all selected coins overlaid
- Normalize prices for meaningful visual comparison (percentage change from start)
- Configurable time ranges (7d, 30d, 90d, 1y)
- Legend identifying each coin by color

### FR-4: Comparison Management
- Add/remove coins from comparison
- Clear all selections
- Persist comparison state during session (optional: URL params for sharing)

---

## Non-Functional Requirements

### NFR-1: Performance
- Fetch coin data in parallel for selected coins
- Leverage existing `fetchCoinDetails` caching
- Progressive loading for chart data

### NFR-2: Accessibility
- Follow existing a11y patterns (sr-only, focus-ring, tap-44)
- Keyboard navigation for coin selection
- Screen reader announcements for comparison updates

### NFR-3: Responsiveness
- Mobile-friendly layout (stack metrics vertically on small screens)
- Readable comparison table on all device sizes
- Touch-friendly coin selection controls

---

## Dependencies

### Existing Components to Leverage
- `CoinMetrics` - Metric display patterns (can adapt for comparison table)
- `AssetChart` - Price chart component (extend for multi-line overlay)
- `useCoinDetails` hook - Fetches detailed coin data
- `useAssetHistory` hook - Fetches price history
- `fetchCoinDetails` service - Already has caching

### New Components Required
- `CoinComparisonPage.tsx` - Main comparison page
- `ComparisonTable.tsx` - Side-by-side metrics table
- `ComparisonChart.tsx` - Overlaid price chart
- `CoinSelector.tsx` - Coin search/selection component

### Routing
- New route: `/compare` or `/compare/:coinIds` in `App.tsx`

---

## Assumptions & Constraints

### Assumptions
1. Maximum 3 coins for comparison (keeps UI manageable)
2. CoinGecko API can handle parallel requests within rate limits
3. Existing design system (Tailwind, design tokens) will be used
4. No authentication required

### Constraints
1. API rate limits (CoinGecko free tier) - need to batch/throttle requests
2. Chart library (Recharts) supports multi-line charts
3. Must work within existing app architecture
4. No backend changes required (client-side only)

---

## Out of Scope (Deferred to Other Backlog Items)
- Educational tooltips for metrics (Backlog Item 28)
- Saving/sharing comparison links (future enhancement)
- More than 3 coins in comparison

---

## Traceability
| Requirement | Stories |
|-------------|---------|
| FR-1: Coin Selection | Story 1 |
| FR-2: Comparative Metrics | Story 2 |
| FR-3: Overlaid Charts | Story 3 |
| FR-4: Comparison Management | Story 1, Story 2 |
