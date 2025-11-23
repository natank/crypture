# REQ-022: Portfolio Performance Tracking

## Related Backlog Items
- [22] Portfolio Performance Tracking

## Description
Enable users to track the historical performance of their portfolio value over various timeframes. This provides critical feedback on investment decisions and overall portfolio health.

## Functional Requirements
1. **Historical Value Calculation**:
   - The system shall calculate the total portfolio value at historical points in time.
   - Calculation should be based on the current quantity of assets (MVP simplification: assume current holdings held historically) multiplied by historical prices.
   - *Note: True historical performance would require transaction history. For this MVP item, we will simulate performance based on "If I held this current portfolio in the past".*

2. **Time Ranges**:
   - Users shall be able to select the following time ranges:
     - 24 Hours (24H)
     - 7 Days (7D)
     - 30 Days (30D)
     - 90 Days (90D)
     - 1 Year (1Y)
     - All Time (Max available data)

3. **Performance Visualization**:
   - Display a line chart showing the portfolio value trend over the selected time range.
   - The chart should be interactive (hover to see date and value).
   - The Y-axis should scale appropriate to the value range.

4. **Performance Metrics**:
   - Display the absolute value change (in currency) for the selected period.
   - Display the percentage change for the selected period.
   - Color-code changes (Green for positive, Red for negative).

5. **Benchmarks (Optional/Phase 2)**:
   - *Deferred for this specific item to keep scope focused, unless specified otherwise.*

## Non-Functional Requirements
- **Performance**: Historical data fetching and calculation should be optimized. Use caching where possible (e.g., React Query).
- **Responsiveness**: The chart must be responsive and usable on mobile devices.
- **Accuracy**: Ensure historical prices are fetched from a reliable source (CoinGecko).

## API Endpoints
- `/coins/{id}/market_chart/range`: To fetch historical price data for each asset in the portfolio.
