# STORY-023: Asset-Level Insights & Metrics

## Related Requirement
- [REQ-023-asset-insights](../requirements/REQ-023-asset-insights.md)

## Description
As a user, I want to view detailed metrics and insights for each asset in my portfolio so that I can make informed decisions about my individual holdings.

## Acceptance Criteria
- [x] **Metrics Display**: When an asset row is expanded, detailed metrics are displayed **above** the existing price chart.
- [x] **ATH/ATL Information**: All-Time High and All-Time Low prices are displayed with their dates and percentage distance from current price.
- [x] **Market Position**: Market cap rank and current market cap value are clearly shown.
- [x] **Supply Metrics**: Circulating supply, total supply, and max supply (if available) are displayed with appropriate formatting.
- [x] **24-Hour Volume**: 24-hour trading volume is shown in the market position section.
- [x] **Compact Layout**: Metrics are organized in a 3-column grid on desktop, stacked on mobile.
- [x] **Integration with Chart**: Metrics panel and price chart coexist in the same expanded section without UX confusion.
- [x] **Loading States**: A skeleton or loading indicator is shown while fetching detailed metrics.
- [x] **Error Handling**: Missing data (e.g., max supply) is handled gracefully with appropriate labels like "N/A" or "Unlimited".
- [x] **Responsive Design**: The metrics view works well on both mobile and desktop devices.
- [x] **Real-Time Updates**: Metrics update automatically when price data refreshes.

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
1. ✅ Update `MarketCoin` type to include ATH/ATL, supply, and date fields.
2. ✅ Update `fetchMarketCoins()` to request additional data fields from CoinGecko API.
3. ✅ Create `AssetMetricsPanel` component with compact grid layout.
4. ✅ Integrate `AssetMetricsPanel` into `AssetRow`'s existing expanded section (above `AssetChart`).
5. ✅ Add visual indicators for significant metrics (near ATH/ATL, high volume).
6. ✅ Format dates, numbers, and supply metrics with appropriate units.
7. ✅ Add loading states and handle missing data (e.g., null max_supply).
8. ✅ Style component to match design system and ensure responsive layout.
9. ✅ Write unit tests for `AssetMetricsPanel` component.
10. ✅ Write E2E test for viewing asset metrics alongside the chart.

## Implementation Notes

### Files Created/Modified
- `frontend/src/types/market.ts` - Extended `MarketCoin` interface with ATH/ATL and supply fields
- `frontend/src/services/coinService.ts` - Added `fetchAssetMetrics()` function with caching
- `frontend/src/hooks/useAssetMetrics.ts` - New hook for fetching asset metrics on demand
- `frontend/src/components/AssetMetricsPanel/index.tsx` - New component for displaying metrics
- `frontend/src/components/AssetMetricsPanel/AssetMetricsPanel.test.tsx` - Unit tests (19 tests)
- `frontend/src/components/AssetRow/index.tsx` - Integrated AssetMetricsPanel above chart
- `frontend/src/e2e/mocks/coinGecko.ts` - Updated mock data with full market metrics
- `frontend/src/e2e/pom-pages/portfolio.pom.ts` - Added locators for metrics panel
- `frontend/src/e2e/specs/features/view-asset-metrics.spec.ts` - E2E tests (7 tests)

### Key Features
- **3-column responsive grid**: Price Extremes, Market Position, Supply Info
- **Visual indicators**: "Near ATH" and "Near ATL" badges when price is within threshold
- **Supply progress bar**: Shows percentage of max supply in circulation (when applicable)
- **Graceful handling**: "Unlimited" for null max_supply, "N/A" for missing data
- **Lazy loading**: Metrics only fetched when asset row is expanded
- **Caching**: 5-minute cache to minimize API calls

## Pull Request

### PR Description
**Feature: Asset-Level Insights & Metrics**

**Summary:**
Implemented detailed asset metrics panel that displays comprehensive market data when users expand an asset row in their portfolio. The panel provides ATH/ATL information, market position, and supply metrics in a responsive 3-column grid layout.

**Key Changes:**

1. **New Components:**
   - `AssetMetricsPanel`: Displays detailed metrics in a compact grid (Price Extremes, Market Position, Supply Info)
   - Visual indicators for "Near ATH" and "Near ATL" states
   - Supply progress bar showing circulating vs max supply

2. **New Hook:**
   - `useAssetMetrics`: Fetches asset metrics on-demand with 5-minute caching

3. **Service Updates:**
   - Extended `MarketCoin` type with ATH/ATL, supply, and date fields
   - Added `fetchAssetMetrics()` function with caching support

4. **Integration:**
   - Integrated `AssetMetricsPanel` into `AssetRow` expanded section (above existing chart)
   - Lazy loading: metrics only fetched when row is expanded

5. **Infrastructure Fixes:**
   - Added `@wtypes/*` path alias to `tsconfig.json` for custom type definitions
   - Added `ResizeObserver` mock in test setup for Recharts compatibility

**Testing:**
- **Unit Tests:** 19 tests for `AssetMetricsPanel` component
- **E2E Tests:** 7 tests covering metrics display, loading states, and responsive behavior
- **All Tests Passing:** 318 unit tests, 90 E2E tests

**Files Changed:**
- `frontend/tsconfig.json` - Added `@wtypes/*` path mapping
- `frontend/src/setupTests.ts` - Added `ResizeObserver` mock
- `frontend/src/wtypes/market.ts` - Extended `MarketCoin` interface
- `frontend/src/services/coinService.ts` - Added `fetchAssetMetrics()`, fixed import path
- `frontend/src/hooks/useAssetMetrics.ts` - New hook for on-demand metrics fetching
- `frontend/src/components/AssetMetricsPanel/index.tsx` - New metrics panel component
- `frontend/src/components/AssetMetricsPanel/AssetMetricsPanel.test.tsx` - Unit tests
- `frontend/src/components/AssetRow/index.tsx` - Integrated metrics panel
- `frontend/src/e2e/mocks/coinGecko.ts` - Updated mock data
- `frontend/src/e2e/pom-pages/portfolio.pom.ts` - Added metrics panel locators
- `frontend/src/e2e/specs/features/view-asset-metrics.spec.ts` - E2E tests

---
