# STORY-022: Portfolio Performance Chart

## Related Requirement
- [REQ-022-portfolio-performance](../requirements/REQ-022-portfolio-performance.md)

## Description
As a user, I want to view a chart of my portfolio's historical performance so that I can visualize my investment growth over time.

## Acceptance Criteria
- [ ] **Visualization**: A line chart is displayed showing the total portfolio value over time.
- [ ] **Time Ranges**: Users can switch between the following time ranges: 24H, 7D, 30D, 90D, 1Y, All.
- [ ] **Dynamic Updates**: The chart and metrics update immediately when a new time range is selected.
- [ ] **Performance Metrics**: The total value change (in USD) and percentage change (%) for the selected period are clearly displayed.
- [ ] **Interactivity**: Hovering over the chart line displays a tooltip with the specific date/time and portfolio value.
- [ ] **Loading State**: A skeleton or loading spinner is shown while historical data is being fetched/calculated.
- [ ] **Error Handling**: An error message is displayed if the data cannot be loaded, with a retry option.
- [ ] **Responsive**: The chart scales correctly on mobile and desktop screens.

## Planning
- Estimate: 5 SP
- Priority: High

## Architecture
- **UI Component**: `PortfolioPerformanceChart`
  - Uses `recharts` for visualization.
  - Contains time range selector buttons.
  - Displays summary metrics (Change $, Change %).
- **Service**: `PortfolioAnalyticsService`
  - New method: `getPortfolioHistory(assets, days)`
  - Logic:
    1. Fetch historical prices for each asset using `coingecko` API (`/coins/{id}/market_chart/range`).
    2. Normalize timestamps (as different coins might have slightly different data points).
    3. Aggregate values: `Sum(Asset Quantity * Historical Price)` for each timestamp.
- **State Management**:
  - Use React Query for caching historical data responses to avoid rate limits and improve performance.

## Task Breakdown
1. Implement `getPortfolioHistory` in `PortfolioAnalyticsService` with mock/real data fetching.
2. Create `PortfolioPerformanceChart` component with Recharts.
3. Implement time range selection logic.
4. Integrate service with component using React Query.
5. Add loading and error states.
6. Style component to match design system.
7. Write unit tests for service (calculation logic) and component.
8. Write E2E test for chart rendering and interaction.
