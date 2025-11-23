# Story 21: Portfolio Composition Visualizations
![Status](https://img.shields.io/badge/Status-Completed-green)

## 1. Background
**Related Requirement:** [REQ-012-analytics](../requirements/REQ-012-analytics.md)

As a crypto investor, I want to visualize my portfolio allocation through interactive charts so that I can understand my diversification, risk exposure, and investment distribution at a glance.

## 2. Story
**As a** crypto investor  
**I want to** visualize my portfolio allocation through various chart perspectives  
**So that** I can understand my diversification, identify concentration risks, and make informed rebalancing decisions

## 3. Acceptance Criteria

### 3.1 Portfolio Allocation by Asset
- [x] The Portfolio page displays a pie/donut chart showing allocation breakdown by individual assets.
- [x] Each asset slice shows the coin name, percentage of total portfolio, and current value.
- [x] Hovering over a slice highlights it and displays detailed information.
- [x] The chart is interactive (hover states, tooltips with precise values).
- [x] Small allocations (< 1%) are grouped into an "Others" category with expandable detail.

### 3.2 Allocation by Category
- [x] Users can view allocation breakdown by crypto category (e.g., DeFi, Layer 1, Meme, etc.).
- [x] Categories are derived from CoinGecko API data for each coin in the portfolio.
- [x] The chart updates dynamically based on current portfolio composition.
- [x] Uncategorized or unknown categories are grouped under "Other".

### 3.3 Allocation by Market Cap Tier
- [x] Users can view allocation breakdown by market cap tier:
  - Large Cap (Top 10)
  - Mid Cap (Top 11-50)
  - Small Cap (Top 51-250)
  - Micro Cap (Below 250)
- [x] Market cap rankings are fetched from CoinGecko API (`market_cap_rank` field).
- [x] The chart shows both percentage and absolute value for each tier.

### 3.4 Allocation by Risk Level
- [x] Users can view allocation breakdown by risk level based on volatility/market cap:
  - Conservative (Large Cap, Low Volatility)
  - Moderate (Mid Cap)
  - Aggressive (Small/Micro Cap, High Volatility)
- [x] Risk classification is calculated using market cap data and price volatility (24h, 7d changes).
- [x] The chart includes a legend explaining the risk categorization logic.

### 3.5 Chart Interactivity
- [x] Users can switch between different allocation views (Asset, Category, Market Cap, Risk).
- [x] Charts are responsive and adapt to mobile/tablet screen sizes.
- [x] Charts are touch-optimized with tap interactions on mobile.
- [x] Loading states are shown while calculating allocation data.
- [x] Empty state is shown when portfolio has no assets.

### 3.6 Data Accuracy
- [x] Allocations are calculated based on real-time price data from CoinGecko.
- [x] Percentages always sum to 100% (with proper rounding).
- [x] Values are formatted with proper currency symbols and decimal precision.

## 4. Technical Notes

### 4.1 API Integration
- **Market Data:** Will use existing CoinGecko `/coins/markets` endpoint
  - Provides: `market_cap_rank`, price change percentages for volatility calculation
  - **Note:** Needs verification that `categories` field is available
- **No new endpoints required** - leverage existing portfolio data + market data

### 4.2 Charting Library
- Will use Recharts (already installed in the project)
- Provides pie chart components with built-in responsiveness


## 5. Preliminary Design

### 5.1 Architecture Analysis

#### 5.1.1 Integration Point
- **Current Structure:** The `PortfolioPage.tsx` serves as the main container for portfolio management features
- **Integration Strategy:** Add the composition visualization as a new section within the Portfolio page, positioned above the asset list
- **Rationale:** Keep all portfolio-related features in a single page to maintain cohesive UX and avoid navigation complexity

#### 5.1.2 Component Architecture
```
PortfolioPage.tsx (Existing)
├── PortfolioHeader (Existing)
├── HelpBanner (Existing)
├── FilterSortControls (Existing)
├── PortfolioCompositionDashboard (NEW)
│   ├── CompositionHeader
│   │   └── AllocationViewSelector (Tab controls)
│   ├── CompositionChartContainer
│   │   ├── AllocationPieChart
│   │   └── EmptyState (when portfolio is empty)
│   └── CompositionLegend
│       └── AllocationItem[] (list with color, name, value, %)
└── AssetList (Existing)
```

#### 5.1.3 Service Layer Architecture
```
frontend/src/services/
├── coinService.ts (Existing - provides market data)
├── portfolioAnalyticsService.ts (NEW)
│   ├── calculateAssetAllocation()
│   ├── calculateCategoryAllocation()
│   ├── calculateMarketCapAllocation()
│   └── calculateRiskAllocation()
└── utils/
    └── riskClassifier.ts (NEW)
        ├── classifyRiskLevel()
        ├── getMarketCapTier()
        └── calculateVolatility()
```

#### 5.1.4 Data Dependencies
**Required Data:**
- Portfolio assets (from `usePortfolioState` hook - already available)
- Real-time prices (from `priceMap` - already available)
- Coin metadata: `market_cap_rank`, `categories`, `price_change_percentage_24h`, `price_change_percentage_7d`
  - Source: Enhanced `useCoinList` or new `useCoinMetadata` hook
  - **Validation needed:** Confirm CoinGecko `/coins/markets` returns all required fields

**Data Flow:**
1. `PortfolioPage` provides portfolio + priceMap (existing)
2. `PortfolioCompositionDashboard` fetches coin metadata
3. `portfolioAnalyticsService` processes raw data → allocation objects
4. `AllocationPieChart` renders processed data

---

### 5.2 UX Design Considerations

#### 5.2.1 Information Hierarchy
**Primary Goal:** Help users quickly understand portfolio diversification

**Visual Priority:**
1. **Primary:** Pie chart showing allocation (immediate visual comprehension)
2. **Secondary:** View selector (allows exploration of different perspectives)
3. **Tertiary:** Legend with detailed values (for precise information)
4. **Contextual:** Tooltips on hover/tap (additional detail on demand)

#### 5.2.2 Navigation Patterns
**Consistency with Existing App:**
- The current app uses **inline controls** (e.g., time range buttons in `AssetChart.tsx`)
- **Decision:** Use inline tab controls (similar to time range buttons) rather than dropdown
- **Rationale:** Maintains consistency, reduces clicks, improves discoverability

**Tab Design Pattern:**
```tsx
// Similar to existing time range selector in AssetChart.tsx
<div className="flex gap-2">
  {views.map(view => (
    <button
      className={selectedView === view 
        ? 'bg-brand-primary text-white' 
        : 'bg-surface-soft hover:bg-surface-medium'}
    />
  ))}
</div>
```

#### 5.2.3 Visual Design System Alignment
**Color Palette:**
- Use CSS custom properties from `index.css`:
  - Primary brand: `--brand-primary` (#5a31f4)
  - Accent: `--brand-accent` (#00bfa5)
  - Surface: `--color-surface`, `--color-bg`
- For pie chart slices: Generate a colorblind-friendly palette
  - Use Tableau 10 or similar accessible palette
  - Ensure contrast ratios meet WCAG AA standards

**Component Styling:**
- Card container: Use existing `.card` utility class
- Buttons: Align with existing button styles (see `AssetChart` time range buttons)
- Typography: Use existing heading hierarchy (h2 for section title, h4 for subsections)

**Spacing:**
- Follow existing spacing tokens: `--space-md`, `--space-lg`
- Maintain consistent padding with other dashboard sections

#### 5.2.4 Responsive Behavior
**Breakpoints (Tailwind defaults):**
- **Mobile (< 640px):** 
  - Chart: Full width, height: 250px
  - Legend: Below chart, vertical list
  - View selector: Horizontal scroll if needed
- **Tablet (640px - 768px):**
  - Chart: Full width, height: 300px
  - Legend: Below chart, 2-column grid
- **Desktop (> 768px):**
  - Chart + Legend: Side-by-side (2:1 ratio)
  - Chart: height: 400px

**Touch Optimization:**
- All interactive elements meet 44px minimum tap target (use `.tap-44` utility)
- Pie chart segments respond to both hover and tap
- Tooltips adapt to touch (show on tap, dismiss on outside tap)

---

### 5.3 Technical Design Decisions

#### 5.3.1 Charting Library
**Decision:** Use **Recharts** (already installed: `^3.1.2`)

**Rationale:**
- ✅ Already used in `AssetChart.tsx` (consistency)
- ✅ Supports `PieChart`, `Pie`, and `Cell` components
- ✅ Built-in responsive container
- ✅ Customizable tooltips
- ⚠️ Limitation: Less flexible than Chart.js, but sufficient for our needs

**Alternative Considered:** Chart.js
- Pros: More customization, better pie chart aesthetics
- Cons: Additional dependency, different API, inconsistent with codebase
- **Verdict:** Stick with Recharts unless specific limitations discovered during implementation

#### 5.3.2 State Management Strategy
**Approach:** Local state with React hooks (consistent with existing patterns)

**State Structure:**
```typescript
// In PortfolioCompositionDashboard.tsx
const [selectedView, setSelectedView] = useState<AllocationView>('asset');
const [isCalculating, setIsCalculating] = useState(false);

// Derived state (memoized)
const allocationData = useMemo(() => {
  return calculateAllocation(selectedView, portfolio, priceMap, coinMetadata);
}, [selectedView, portfolio, priceMap, coinMetadata]);
```

**Rationale:**
- No global state needed (composition data is derived from portfolio)
- Memoization prevents expensive recalculations
- Follows existing patterns in `PortfolioPage.tsx`

#### 5.3.3 Data Fetching Strategy
**Challenge:** Need coin metadata (categories, market_cap_rank) for allocation calculations

**Options:**
1. **Extend `useCoinList`** to fetch from `/coins/markets` with additional fields
2. **Create new `useCoinMetadata`** hook specifically for analytics
3. **Fetch on-demand** in PortfolioCompositionDashboard

**Decision:** **Option 1** - Extend `useCoinList`
**Rationale:**
- `/coins/markets` already returns most needed fields
- Avoids duplicate API calls
- Centralizes coin data fetching
- **Action Item:** Verify `/coins/markets` response includes `categories` field

#### 5.3.4 Performance Optimization
**Strategies:**
1. **Memoization:** Use `useMemo` for allocation calculations
2. **Lazy Loading:** Only render chart when dashboard is visible (Intersection Observer)
3. **Debouncing:** If portfolio updates frequently, debounce allocation recalculation
4. **Chart Optimization:** Limit pie slices (group small allocations < 1% into "Others")

#### 5.3.5 Accessibility Considerations
**WCAG 2.1 AA Compliance:**
- **Color Contrast:** Ensure all text/colors meet 4.5:1 ratio
- **Keyboard Navigation:** Tab controls and pie segments must be keyboard-accessible
- **Screen Readers:** 
  - Add ARIA labels to chart: `aria-label="Portfolio allocation pie chart"`
  - Provide text alternative: Table of allocation data (visually hidden, screen-reader accessible)
- **Focus Management:** Clear focus indicators (use `.focus-ring` utility)

**Implementation:**
```tsx
<div role="img" aria-label="Portfolio allocation by asset">
  <PieChart>...</PieChart>
</div>
<table className="sr-only">
  {/* Text alternative for screen readers */}
  <caption>Portfolio Allocation Breakdown</caption>
  <tbody>
    {allocationData.map(item => (
      <tr><td>{item.name}</td><td>{item.percentage}%</td></tr>
    ))}
  </tbody>
</table>
```

---

### 5.4 Risk Assessment & Mitigation

#### 5.4.1 Risk: CoinGecko API may not return `categories` field
**Mitigation:**
- Verify API response during implementation
- If unavailable, use mapping file or fetch categories separately
- Provide graceful degradation: "Category data unavailable"

#### 5.4.2 Risk: Recharts customization limitations
**Mitigation:**
- Prototype pie chart early in implementation
- If blockers found, evaluate Chart.js as fallback
- Document any workarounds

#### 5.4.3 Risk: Performance with large portfolios (100+ assets)
**Mitigation:**
- Implement "Others" grouping for small allocations
- Add pagination or virtualization if needed
- Monitor performance in E2E tests

---

### 5.5 Open Questions & Validations Needed

1. **API Validation:** Does `/coins/markets` return `categories` field? If not, what's the alternative endpoint?
2. **Empty State UX:** Should we hide the composition chart entirely when portfolio is empty, or show a visual placeholder?
3. **Default View:** Should the default view be "Asset" or something more strategic (e.g., "Risk")?
4. **Mobile Chart Size:** Is 250px height sufficient for readability on mobile?
5. **Diversity Score:** Is this feature in scope for this story, or deferred to future enhancement?

**Next Steps:**
- Review this design with stakeholders
- Validate API assumptions
- Prototype pie chart to confirm Recharts viability

## 6. Implementation Plan

### 6.1 E2E Testing (TDD Red Phase)
- [x] Create E2E test file `e2e/portfolio-composition-viz.spec.ts`.
- [x] Define test cases:
  - User can see portfolio allocation by asset.
  - User can switch to category view and see category breakdown.
  - User can switch to market cap tier view.
  - User can switch to risk level view.
  - Tooltips display on hover/tap.
  - Empty state is shown for empty portfolio.
- [x] Run tests to confirm they fail (Red state).

### 6.2 Analytics Service Layer
- [x] Create `services/portfolioAnalyticsService.ts`.
- [x] Implement allocation calculation functions:
  - `calculateAssetAllocation(portfolio, prices)`
  - `calculateCategoryAllocation(portfolio, coinMetadata)`
  - `calculateMarketCapAllocation(portfolio, coinMetadata)`
  - `calculateRiskAllocation(portfolio, coinMetadata)`
- [x] Create `utils/riskClassifier.ts` for risk level logic. (Integrated into service)
- [x] Add unit tests for calculation functions.

### 6.3 Component Development
- [x] Create `components/portfolio/AllocationPieChart.tsx`.
  - [x] Implement using Recharts `PieChart` and `Pie`.
  - [x] Add tooltip customization.
  - [x] Add hover effects and interactions.
  - [x] Add unit tests.
- [x] Create `components/portfolio/AllocationViewSelector.tsx`.
  - [x] Implement tab/segmented control UI.
  - [x] Add unit tests. (Covered in Dashboard tests)
- [x] Create `components/portfolio/AllocationLegend.tsx`.
  - [x] Display allocation items with colors and values.
  - [x] Add unit tests. (Covered in Dashboard tests)
- [x] Create `components/portfolio/PortfolioCompositionDashboard.tsx`.
  - [x] Integrate all sub-components.
  - [x] Manage view state.
  - [x] Fetch and process data.
  - [x] Add unit tests.

### 6.4 Integration (Green Phase)
- [x] Integrate `PortfolioCompositionDashboard` into Portfolio page.
- [x] Connect real portfolio data and market data.
- [x] Verify E2E tests pass.
- [x] Manual testing on different screen sizes.

### 6.5 Refactoring (Blue Phase)
- [x] Optimize performance (memoization, avoid unnecessary re-renders).
- [x] Ensure accessibility (ARIA labels, keyboard navigation).
- [x] Add loading skeletons for better UX.
- [x] Code review and cleanup.

### 6.6 Documentation
- [x] Update Portfolio page documentation.
- [x] Document allocation calculation logic.
- [x] Add screenshots/examples to story.

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

## 10. Pull Request

### PR Description
**Feature: Portfolio Composition Visualizations**

**Summary:**
Implemented comprehensive portfolio visualization dashboard allowing users to analyze their holdings through multiple perspectives: Asset, Category, Market Cap, and Risk Level.

**Key Changes:**
1. **New Components:**
   - `PortfolioCompositionDashboard`: Main container with view management
   - `AllocationPieChart`: Interactive Recharts-based visualization
   - `AllocationViewSelector`: Tab-based control for switching views
   - `AllocationLegend`: Detailed breakdown with values and percentages

2. **New Service:**
   - `portfolioAnalyticsService`: Handles all allocation calculations and risk classification logic

3. **Integration:**
   - Integrated into `PortfolioPage` above the asset list
   - Enhanced data mapping to support analytics requirements

**Testing:**
- **E2E Tests:** Full coverage of user flows (view switching, empty states, responsiveness)
- **Unit Tests:** Comprehensive testing of calculation logic and component rendering
- **Manual Testing:** Verified on mobile and desktop viewports

**Screenshots:**
(See attached artifacts in story history)
