# Requirements Analysis

## Backlog Item
- **ID**: 25
- **Title**: Daily Portfolio Summary & Insights
- **Requirement**: [REQ-013-notifications](../../requirements/REQ-013-notifications.md)

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Display daily portfolio performance summary (24h change in value and %) | High |
| FR-2 | Show top 3 performing assets (biggest gains) | High |
| FR-3 | Show bottom 3 performing assets (biggest losses) | High |
| FR-4 | Display notable events (triggered alerts, significant moves) | Medium |
| FR-5 | Summary should be personalized based on user's holdings | High |
| FR-6 | Allow users to dismiss/minimize the summary card | Low |

## Non-Functional Requirements

| ID | Requirement | Type |
|----|-------------|------|
| NFR-1 | Summary should load within 2 seconds | Performance |
| NFR-2 | Card should be accessible with proper ARIA labels | Usability |
| NFR-3 | Summary should be scannable at a glance | Usability |
| NFR-4 | Works in both light and dark modes | Usability |

## Dependencies

- **Depends On**: 
  - Backlog Item 24 (Price Alerts) - for triggered alerts data
  - Backlog Item 22 (Portfolio Performance) - for performance chart/data
  - Backlog Item 23 (Asset-Level Insights) - for per-asset metrics
- **Blocked By**: None

## Assumptions

1. Portfolio history data is available via `portfolioAnalyticsService`
2. Triggered alerts history is accessible via `alertService`
3. 24h price change data is available for portfolio assets
4. User has at least one asset in portfolio for summary to display

## Constraints

1. Must use existing data sources - no new API calls beyond what's already fetched
2. Performance data limited to what CoinGecko API provides
3. Must fit within existing Portfolio page layout without cluttering

## Out of Scope

- Push notifications for daily summary
- Email digest of daily summary
- Customizable summary time (always shows "today")
- Historical summary comparisons (e.g., "vs last week")

## Questions / Clarifications Needed

- [x] Should summary auto-collapse after viewing? → No, user dismisses manually
- [x] Where to position on Portfolio page? → Above performance chart
