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
