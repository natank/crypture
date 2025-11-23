# STORY-023: Asset-Level Insights & Metrics

## Related Requirement
- [REQ-023-asset-insights](../requirements/REQ-023-asset-insights.md)

## Description
As a user, I want to view detailed metrics and insights for each asset in my portfolio so that I can make informed decisions about my individual holdings.

## Acceptance Criteria
- [ ] **Metrics Display**: When an asset row is expanded, detailed metrics are displayed **above** the existing price chart.
- [ ] **ATH/ATL Information**: All-Time High and All-Time Low prices are displayed with their dates and percentage distance from current price.
- [ ] **Market Position**: Market cap rank and current market cap value are clearly shown.
- [ ] **Supply Metrics**: Circulating supply, total supply, and max supply (if available) are displayed with appropriate formatting.
- [ ] **24-Hour Volume**: 24-hour trading volume is shown in the market position section.
- [ ] **Compact Layout**: Metrics are organized in a 3-column grid on desktop, stacked on mobile.
- [ ] **Integration with Chart**: Metrics panel and price chart coexist in the same expanded section without UX confusion.
- [ ] **Loading States**: A skeleton or loading indicator is shown while fetching detailed metrics.
- [ ] **Error Handling**: Missing data (e.g., max supply) is handled gracefully with appropriate labels like "N/A" or "Unlimited".
- [ ] **Responsive Design**: The metrics view works well on both mobile and desktop devices.
- [ ] **Real-Time Updates**: Metrics update automatically when price data refreshes.

## Planning
- Estimate: 5 SP
- Priority: Medium

## Preliminary Design

### UX/UI Design

> **Integration with Existing Chart**: The asset metrics will be displayed **alongside** the existing `AssetChart` component (REQ-007) in the same expandable panel. This avoids UX confusion and provides a comprehensive asset detail view.

- **Asset List Enhancement**:
  - Each asset row already has expand/collapse functionality (clicking the row toggles the chart).
  - When expanded, the panel shows **both** the price chart (existing) and the new metrics panel.
  
- **Expanded Panel Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │ Asset Metrics (NEW)                     │
  │ ┌─────────────┬─────────────┬─────────┐ │
  │ │ Price       │ Market      │ Supply  │ │
  │ │ Extremes    │ Position    │ Info    │ │
  │ └─────────────┴─────────────┴─────────┘ │
  ├─────────────────────────────────────────┤
  │ Price History Chart (EXISTING)          │
  │ [Chart with time range selector]        │
  └─────────────────────────────────────────┘
  ```

- **Metrics Layout** (Top Section of Expanded Panel):
  - **Compact Grid**: 3 columns on desktop, stacked on mobile
  - **Column 1: Price Extremes**
    - ATH: $XX,XXX (Date) | -XX% from ATH
    - ATL: $XXX (Date) | +XXX% from ATL
  - **Column 2: Market Position**
    - Rank: #XX
    - Market Cap: $XX.XXB
    - 24h Volume: $XX.XXM
  - **Column 3: Supply**
    - Circulating: XX.XXM
    - Total: XX.XXM
    - Max: XX.XXM (or "Unlimited")

- **Visual Indicators**:
  - Green highlight if price is within 10% of ATH
  - Red highlight if price is within 20% of ATL
  - Badge for high volume (if 24h volume > 2x average)

### Technical Considerations
- **Data Fetching**:
  - Enhance `fetchMarketCoins()` to include additional fields (ath, atl, ath_date, atl_date, circulating_supply, total_supply, max_supply, total_volume).
  - These fields are already available in the `/coins/markets` endpoint, so no additional API calls needed.
  - Update `MarketCoin` type to include these fields.
  
- **Component Integration**:
  - The existing `AssetRow` component already handles expand/collapse state.
  - Add the new `AssetMetricsPanel` component **above** the existing `AssetChart` in the expanded section.
  - Both components will be visible when the row is expanded.
  
- **State Management**:
  - Leverage existing expand/collapse state in `AssetRow`.
  - Use existing React Query cache for market data.
  
- **Performance**:
  - Only render metrics panel when user expands an asset (lazy rendering).
  - Use CSS transitions for smooth expand/collapse animations.
  - Metrics data is already fetched for the asset list, so no additional API calls.

## Architecture
- **New Component**: `AssetMetricsPanel`
  - Displays detailed metrics for a single asset in a compact grid layout.
  - Receives asset market data as props.
  - Organized into three columns: Price Extremes, Market Position, Supply.
  - Includes visual indicators for significant metrics (near ATH/ATL, high volume).
  
- **Enhanced Component**: `AssetRow`
  - **No state changes needed** - already has expand/collapse functionality.
  - Update the expanded section to render **both**:
    1. `AssetMetricsPanel` (new) - at the top
    2. `AssetChart` (existing) - below the metrics
  - Both components share the same expanded panel container.
  
- **Service Updates**: `coinService.ts`
  - Update `MarketCoin` type to include additional fields.
  - Ensure `fetchMarketCoins()` requests include all necessary data.
  - **Note**: The `/coins/markets` endpoint already supports these fields via query parameters.
  
- **Types**: `market.ts`
  - Extend `MarketCoin` interface with:
    - `ath: number`
    - `ath_date: string`
    - `atl: number`
    - `atl_date: string`
    - `circulating_supply: number`
    - `total_supply: number | null`
    - `max_supply: number | null`
    - `total_volume: number` (already exists)

- **Data Flow**:
  1. `fetchMarketCoins()` fetches enhanced market data
  2. `AssetRow` receives asset with full market data
  3. When expanded, `AssetRow` renders:
     - `AssetMetricsPanel` with market data props
     - `AssetChart` with existing chart props (unchanged)

## Task Breakdown
1. Update `MarketCoin` type to include ATH/ATL, supply, and date fields.
2. Update `fetchMarketCoins()` to request additional data fields from CoinGecko API.
3. Create `AssetMetricsPanel` component with compact grid layout.
4. Integrate `AssetMetricsPanel` into `AssetRow`'s existing expanded section (above `AssetChart`).
5. Add visual indicators for significant metrics (near ATH/ATL, high volume).
6. Format dates, numbers, and supply metrics with appropriate units.
7. Add loading states and handle missing data (e.g., null max_supply).
8. Style component to match design system and ensure responsive layout.
9. Write unit tests for `AssetMetricsPanel` component.
10. Write E2E test for viewing asset metrics alongside the chart.

---
