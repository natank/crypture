# Story 2: Coin Information & Metrics Display

## Description
As a user, I want to see comprehensive information about a coin including its description, key metrics, price chart, and external links so that I can make informed investment decisions.

## Acceptance Criteria
- [ ] Coin description displayed (from API)
- [ ] Key metrics section (market cap, volume, supply, ATH/ATL)
- [ ] Price chart with time range selector (7d, 30d, 90d, 1y)
- [ ] External links section (website, whitepaper, social channels)
- [ ] Links open in new tabs and are clearly marked as external

## Technical Tasks
1. Extend `CoinDetails` type with description and links
2. Create `CoinDescription` component
3. Create `CoinLinks` component
4. Integrate `AssetChart` for price history
5. Reuse/extend `AssetMetricsPanel` for metrics display

## Traceability
- **Requirements**: FR-1, FR-3
- **Backlog Item**: 26

## Estimated Effort
2-3 hours
