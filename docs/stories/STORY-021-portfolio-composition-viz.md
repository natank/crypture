# Story 21: Portfolio Composition Visualizations
![Status](https://img.shields.io/badge/Status-Pending-yellow)

## 1. Background
**Related Requirement:** [REQ-012-analytics](../requirements/REQ-012-analytics.md)

As a crypto investor, I want to visualize my portfolio allocation through interactive charts so that I can understand my diversification, risk exposure, and investment distribution at a glance.

## 2. Story
**As a** crypto investor  
**I want to** visualize my portfolio allocation through various chart perspectives  
**So that** I can understand my diversification, identify concentration risks, and make informed rebalancing decisions

## 3. Acceptance Criteria

### 3.1 Portfolio Allocation by Asset
- [ ] The Portfolio page displays a pie/donut chart showing allocation breakdown by individual assets.
- [ ] Each asset slice shows the coin name, percentage of total portfolio, and current value.
- [ ] Hovering over a slice highlights it and displays detailed information.
- [ ] The chart is interactive (hover states, tooltips with precise values).
- [ ] Small allocations (< 1%) are grouped into an "Others" category with expandable detail.

### 3.2 Allocation by Category
- [ ] Users can view allocation breakdown by crypto category (e.g., DeFi, Layer 1, Meme, etc.).
- [ ] Categories are derived from CoinGecko API data for each coin in the portfolio.
- [ ] The chart updates dynamically based on current portfolio composition.
- [ ] Uncategorized or unknown categories are grouped under "Other".

### 3.3 Allocation by Market Cap Tier
- [ ] Users can view allocation breakdown by market cap tier:
  - Large Cap (Top 10)
  - Mid Cap (Top 11-50)
  - Small Cap (Top 51-250)
  - Micro Cap (Below 250)
- [ ] Market cap rankings are fetched from CoinGecko API (`market_cap_rank` field).
- [ ] The chart shows both percentage and absolute value for each tier.

### 3.4 Allocation by Risk Level
- [ ] Users can view allocation breakdown by risk level based on volatility/market cap:
  - Conservative (Large Cap, Low Volatility)
  - Moderate (Mid Cap)
  - Aggressive (Small/Micro Cap, High Volatility)
- [ ] Risk classification is calculated using market cap data and price volatility (24h, 7d changes).
- [ ] The chart includes a legend explaining the risk categorization logic.

### 3.5 Chart Interactivity
- [ ] Users can switch between different allocation views (Asset, Category, Market Cap, Risk).
- [ ] Charts are responsive and adapt to mobile/tablet screen sizes.
- [ ] Charts are touch-optimized with tap interactions on mobile.
- [ ] Loading states are shown while calculating allocation data.
- [ ] Empty state is shown when portfolio has no assets.

### 3.6 Data Accuracy
- [ ] Allocations are calculated based on real-time price data from CoinGecko.
- [ ] Percentages always sum to 100% (with proper rounding).
- [ ] Values are formatted with proper currency symbols and decimal precision.

## 4. Technical Notes

### 4.1 API Integration
- **Market Data:** Use existing `/coins/markets` endpoint to fetch:
  - `market_cap_rank` for market cap tier classification
  - `categories` for category allocation
  - `price_change_percentage_24h` and `price_change_percentage_7d` for volatility/risk calculation
- **No new endpoints needed** - leverage existing portfolio data + market data

### 4.2 Charting Library
- **Option 1:** Recharts (already in use for price history charts)
  - Pros: Consistent with existing implementation, React-friendly
  - Cons: Limited pie chart customization
- **Option 2:** Chart.js with react-chartjs-2
  - Pros: Excellent pie/donut chart support, highly customizable
  - Cons: Additional dependency
- **Recommendation:** Start with Recharts for consistency, evaluate Chart.js if customization is needed

### 4.3 Components Architecture
- **New Components:**
  - `PortfolioCompositionDashboard` - Main container component
  - `AllocationPieChart` - Reusable pie/donut chart component
  - `AllocationViewSelector` - Tab/toggle for switching between views
  - `AllocationLegend` - Custom legend with detailed information
- **Services:**
  - `portfolioAnalyticsService.ts` - Allocation calculation logic
  - `riskClassifier.ts` - Risk level calculation utilities

### 4.4 State Management
- Local state in `PortfolioCompositionDashboard` for:
  - `selectedView`: "asset" | "category" | "marketCap" | "risk"
  - Derived allocation data based on portfolio + market data
- Leverage existing `usePortfolio` hook for portfolio data
- Leverage existing `useCoinData` or market hooks for coin metadata

### 4.5 Calculations
- **Allocation %** = (Asset Value / Total Portfolio Value) × 100
- **Market Cap Tier** = Derived from `market_cap_rank`:
  - Large: rank 1-10
  - Mid: rank 11-50
  - Small: rank 51-250
  - Micro: rank > 250
- **Risk Level** = Function of market cap tier + volatility:
  ```
  if (tier === 'large' && volatility < threshold) => 'Conservative'
  if (tier === 'mid') => 'Moderate'
  if (tier === 'small' || tier === 'micro' || volatility > highThreshold) => 'Aggressive'
  ```

## 5. Preliminary Design

### 5.1 Layout Structure
```
PortfolioPage
└── PortfolioCompositionDashboard
    ├── AllocationViewSelector (Tabs: Asset | Category | Market Cap | Risk)
    ├── AllocationPieChart (Dynamic based on selectedView)
    ├── AllocationLegend (List of items with colors, values, percentages)
    └── AllocationSummary (Key insights: diversity score, top allocation, etc.)
```

### 5.2 Data Flow
1. User navigates to Portfolio page (or Composition tab).
2. `PortfolioCompositionDashboard` fetches portfolio data + market metadata.
3. Calculate allocation data for all views (memoized).
4. Render pie chart for default view (Asset).
5. User switches view via tabs.
6. Chart updates with new allocation data.

### 5.3 UX/UI Design
- **Chart:** Large, centered pie/donut chart (donut preferred for modern look).
- **View Selector:** Horizontal tab bar or segmented control above chart.
- **Legend:** Positioned to the right on desktop, below on mobile.
- **Color Palette:** Use distinct, accessible colors (consider colorblind-friendly palette).
- **Tooltips:** Rich tooltips showing coin name, value (USD), percentage, 24h change.
- **Empty State:** Friendly message with CTA to add assets when portfolio is empty.

### 5.4 Responsive Behavior
- **Desktop:** Chart and legend side-by-side.
- **Tablet:** Chart and legend stacked vertically.
- **Mobile:** Compact chart, legend below, touch-optimized tooltips.

## 6. Implementation Plan

### 6.1 E2E Testing (TDD Red Phase)
- [ ] Create E2E test file `e2e/portfolio-composition-viz.spec.ts`.
- [ ] Define test cases:
  - User can see portfolio allocation by asset.
  - User can switch to category view and see category breakdown.
  - User can switch to market cap tier view.
  - User can switch to risk level view.
  - Tooltips display on hover/tap.
  - Empty state is shown for empty portfolio.
- [ ] Run tests to confirm they fail (Red state).

### 6.2 Analytics Service Layer
- [ ] Create `services/portfolioAnalyticsService.ts`.
- [ ] Implement allocation calculation functions:
  - `calculateAssetAllocation(portfolio, prices)`
  - `calculateCategoryAllocation(portfolio, coinMetadata)`
  - `calculateMarketCapAllocation(portfolio, coinMetadata)`
  - `calculateRiskAllocation(portfolio, coinMetadata)`
- [ ] Create `utils/riskClassifier.ts` for risk level logic.
- [ ] Add unit tests for calculation functions.

### 6.3 Component Development
- [ ] Create `components/portfolio/AllocationPieChart.tsx`.
  - [ ] Implement using Recharts `PieChart` and `Pie`.
  - [ ] Add tooltip customization.
  - [ ] Add hover effects and interactions.
  - [ ] Add unit tests.
- [ ] Create `components/portfolio/AllocationViewSelector.tsx`.
  - [ ] Implement tab/segmented control UI.
  - [ ] Add unit tests.
- [ ] Create `components/portfolio/AllocationLegend.tsx`.
  - [ ] Display allocation items with colors and values.
  - [ ] Add unit tests.
- [ ] Create `components/portfolio/PortfolioCompositionDashboard.tsx`.
  - [ ] Integrate all sub-components.
  - [ ] Manage view state.
  - [ ] Fetch and process data.
  - [ ] Add unit tests.

### 6.4 Integration (Green Phase)
- [ ] Integrate `PortfolioCompositionDashboard` into Portfolio page.
- [ ] Connect real portfolio data and market data.
- [ ] Verify E2E tests pass.
- [ ] Manual testing on different screen sizes.

### 6.5 Refactoring (Blue Phase)
- [ ] Optimize performance (memoization, avoid unnecessary re-renders).
- [ ] Ensure accessibility (ARIA labels, keyboard navigation).
- [ ] Add loading skeletons for better UX.
- [ ] Code review and cleanup.

### 6.6 Documentation
- [ ] Update Portfolio page documentation.
- [ ] Document allocation calculation logic.
- [ ] Add screenshots/examples to story.

## 7. Estimation
- **Story Points:** 8 SP
- **Estimated Time:** 2-3 days
- **Risk Factors:**
  - Chart library customization complexity: Medium
  - Risk calculation logic accuracy: Medium
  - Mobile responsiveness for charts: Low

## 8. Dependencies
- Existing portfolio data hooks
- CoinGecko market data
- Recharts library (already installed)

## 9. Notes
- Consider adding a "Diversity Score" metric in the future (separate story).
- Future enhancement: Export chart as image/PDF.
- Future enhancement: Historical allocation tracking (show how composition changed over time).
