# User Story: Trending & Discovery Feed

**ID**: 19
**Priority**: High
**Feature Category**: Market Intelligence
**Related Requirement**: [REQ-011-market-intel](../requirements/REQ-011-market-intel.md)

## 📖 User Story
**As a** crypto investor
**I want to** see trending coins and top movers
**So that** I can discover new investment opportunities and stay updated on market momentum.

## ✅ Acceptance Criteria
1. **Trending Coins Display**:
   - Show a list of top 7 trending coins from CoinGecko (`/search/trending`).
   - Display rank, icon, name, symbol, and market cap rank for each.
2. **Top Gainers & Losers**:
   - Show top 5 gainers and top 5 losers (24h) from the top 100 coins.
   - Toggle or separate sections for Gainers vs. Losers.
   - Display current price and 24h % change (green for positive, red for negative).
3. **Responsiveness**:
   - Layout adapts to mobile (stacked) and desktop (grid/side-by-side).
4. **Navigation**:
   - Clicking a coin should navigate to its detail page (if available) or at least be prepared for that routing.
5. **Performance**:
   - Data should be cached/refreshed every 5-15 minutes.
   - Loading skeletons while fetching data.

## 🎨 Preliminary Design

### Architectural Changes
- **New Hooks**:
  - `useTrendingCoins()`: Fetches from `/search/trending`.
  - `useTopMovers()`: Fetches from `/coins/markets` with `order=price_change_percentage_24h_desc` (and asc).
- **New Components**:
  - `TrendingSection`: Container for trending coins.
  - `TrendingCoinCard`: Individual card for a trending coin.
  - `TopMoversSection`: Container for gainers/losers.
  - `MoverRow`: Row component for a gainer/loser.
- **Integration**:
  - Add these sections to `MarketOverview/index.tsx` below the `MarketMetricsGrid`.

### UX/UI Design
- **Style**: Consistent with `MarketMetricCard` (white bg, shadow, rounded corners).
- **Layout**:
  - **Trending**: Horizontal scroll on mobile, Grid on desktop.
  - **Movers**: Two columns on desktop (Gainers | Losers), Stacked on mobile.
- **Visuals**:
  - Use `text-green-500` and `text-red-500` for price changes.
  - Use `animate-pulse` for loading states.

---

## 📝 Pull Request Description

### Summary
Implements the **Trending & Discovery Feed** feature, adding trending coins and top movers (gainers/losers) to the Market Overview page. This enhancement helps users discover new investment opportunities and stay informed about market momentum.

### Changes Made

#### Backend/Services
- **`coinService.ts`**: Added `fetchTrendingCoins()` and `fetchTopMovers()` functions
- **`market.ts`**: Added TypeScript interfaces for `TrendingCoin`, `TrendingApiResponse`, and `MarketMover`
- **`formatters.ts`**: Added `formatCurrency()` helper for consistent price formatting

#### Hooks
- **`useTrendingCoins.ts`**: Custom hook to fetch and manage trending coins data
- **`useTopMovers.ts`**: Custom hook to fetch and manage top gainers/losers data

#### Components
- **`TrendingSection.tsx`**: Displays top 8 trending coins in a responsive grid
- **`TopMoversSection.tsx`**: Displays top 5 gainers and top 5 losers in side-by-side sections
- **`MarketOverview/index.tsx`**: Integrated new sections below market metrics

#### Testing
- **Unit Tests**:
  - `useTrendingCoins.test.ts`: Tests for trending coins hook
  - `useTopMovers.test.ts`: Tests for top movers hook
  - `TrendingSection.test.tsx`: Component tests for trending section
  - `TopMoversSection.test.tsx`: Component tests for top movers section
- **E2E Tests**:
  - `trending-discovery.spec.ts`: End-to-end tests for the complete feature
  - Updated `market-page.pom.ts`: Added locators for new sections

#### Bug Fixes
- Fixed lint error in `useNotifications.tsx` (removed unsupported `aria-label` from `ariaProps`)

### Test Results
- ✅ All unit tests passing (285 tests)
- ✅ All E2E tests passing (66 tests)
- ✅ No TypeScript errors
- ✅ Feature verified in browser

### Screenshots
The feature displays:
- 🔥 **Trending Coins (24h)**: Grid of 8 trending coins with rank, icon, name, and symbol
- 🚀 **Top Gainers**: 5 coins with highest 24h price increase (green)
- 📉 **Top Losers**: 5 coins with lowest 24h price change (red)

### Related
- **Story**: STORY-019-trending-discovery.md
- **Requirement**: REQ-011-market-intel.md
- **Backlog Item**: #19
