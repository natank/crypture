# REQ-023: Asset-Level Insights & Metrics

## Related Backlog Items
- [23] Asset-Level Insights & Metrics

## Description
Provide users with detailed, actionable insights for each asset in their portfolio. This includes key performance metrics, market position indicators, supply information, and price ranges to help users make informed decisions about individual holdings.

## Functional Requirements
1. The application shall display detailed metrics for each asset in the portfolio, including:
   - All-Time High (ATH) and All-Time Low (ATL) with dates
   - Current price distance from ATH/ATL (percentage)
   - Market cap rank and category
   - Circulating supply, total supply, and max supply
   - 24-hour price range (high/low)
   - 24-hour trading volume
   - Market cap value
2. Users shall be able to view these metrics directly from the asset list (e.g., expandable row or detail panel).
3. The application shall highlight significant metrics (e.g., near ATH, significant volume changes).
4. Asset metrics shall update in real-time along with price data.
5. The application shall handle missing data gracefully (e.g., some coins may not have max supply).

## Non-Functional Requirements
- Metrics should be fetched efficiently, leveraging existing API calls where possible.
- The UI should be responsive and work on mobile devices.
- Data should be cached appropriately to minimize API calls.
- Loading states should be shown while fetching detailed metrics.
- The interface should not overwhelm users with too much data at once.

## API Endpoints Used
- `/coins/markets` - Extended market data including ATH/ATL, supply metrics, volume
- Existing portfolio and price data for context

## User Value
- **Investment Decisions**: Users can identify assets near ATH/ATL to inform buy/sell decisions.
- **Risk Assessment**: Market cap rank and supply metrics help users understand asset maturity and risk.
- **Performance Context**: Comparing current price to historical ranges provides performance perspective.
- **Portfolio Optimization**: Detailed metrics enable users to rebalance based on comprehensive data.
