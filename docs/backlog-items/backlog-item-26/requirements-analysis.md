# Requirements Analysis: Backlog Item 26 - Coin Deep Dive Pages

## Source Requirement
**REQ-014: Investment Research** - [Link](../../requirements/REQ-014-research.md)

---

## Key Functional Requirements

### FR-1: Detailed Coin Page
The application shall provide a dedicated page for each coin with:
- Coin description and overview
- Key metrics (market cap, volume, supply data, ATH/ATL)
- Price chart with configurable time ranges
- External links (website, whitepaper, social channels)

### FR-2: Navigation & Discovery
- Users shall be able to navigate to coin pages from portfolio assets and market listings
- The page shall show related or similar coins for discovery
- Back navigation to previous context (portfolio/market)

### FR-3: External Resources
- Coin pages shall link to external resources (website, whitepaper, social channels)
- All external links shall open in new tabs and be clearly marked

---

## Non-Functional Requirements

### NFR-1: Performance
- Coin pages should load quickly with progressive enhancement
- Use existing caching patterns from `coinService.ts`

### NFR-2: Accessibility
- Follow existing a11y patterns (sr-only, focus-ring, tap-44)
- Keyboard navigation support

### NFR-3: Responsiveness
- Mobile-friendly layout
- Readable on all device sizes

---

## Dependencies

### Existing Components to Leverage
- `AssetMetricsPanel` - Already displays key metrics (can be reused/extended)
- `AssetChart` - Price history chart component
- `useAssetMetrics` hook - Fetches market data for a coin
- `useAssetHistory` hook - Fetches price history

### New API Endpoint Required
- `/coins/{id}` - CoinGecko detailed coin info (description, links, categories)
  - Currently only using `/coins/markets` which lacks description and links

### Routing
- New route: `/coin/:coinId` in `App.tsx`
- New page component: `CoinDetailPage.tsx`

---

## Assumptions & Constraints

### Assumptions
1. CoinGecko free tier API provides sufficient data for coin details
2. Existing design system (Tailwind, design tokens) will be used
3. No authentication required for viewing coin details

### Constraints
1. API rate limits (CoinGecko free tier)
2. Must work within existing app architecture
3. No backend changes required (client-side only)

---

## Out of Scope (Deferred to Other Backlog Items)
- Side-by-side coin comparison (Backlog Item 27)
- Educational tooltips (Backlog Item 28)

---

## Traceability
| Requirement | Stories |
|-------------|---------|
| FR-1: Detailed Coin Page | Story 1, Story 2 |
| FR-2: Navigation & Discovery | Story 3 |
| FR-3: External Resources | Story 2 |
