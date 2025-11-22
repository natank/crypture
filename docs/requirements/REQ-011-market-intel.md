# REQ-011: Market Intelligence

## Related Backlog Items
- [18] Market Overview Dashboard
- [19] Trending & Discovery Feed
- [20] Category-Based Exploration

## Description
Provide users with comprehensive market intelligence through global metrics, trending coins, top movers, and category-based exploration to help them discover investment opportunities and understand market context.

## Functional Requirements
1. The application shall display global crypto market metrics (total market cap, 24h volume, BTC dominance).
2. The application shall show trending coins based on search popularity.
3. Users shall be able to view top gainers and losers (24h).
4. Users shall be able to browse and filter coins by category (DeFi, NFT, Gaming, Layer 1/2, etc.).
5. Market data shall refresh automatically at appropriate intervals.

## Non-Functional Requirements
- Data should be cached to minimize API calls and respect rate limits.
- UI should be responsive and mobile-optimized.
- Loading states should be clear and smooth.
- Market data should update every 5-15 minutes.

## API Endpoints Used
- `/global` - Global market metrics
- `/search/trending` - Trending coins
- `/coins/markets` with order parameters - Top gainers/losers
- `/coins/categories` - Category listings and filtering
