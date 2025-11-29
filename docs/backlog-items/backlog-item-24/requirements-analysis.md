# Requirements Analysis

## Backlog Item
- **ID**: 24
- **Title**: Price Alerts & Notifications
- **Requirement**: [REQ-013-notifications](../../requirements/REQ-013-notifications.md)

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Users can set price alerts with custom thresholds (above/below specific price) | High |
| FR-2 | Users can set percentage change alerts (±X% in 24h) | High |
| FR-3 | Users can set portfolio milestone alerts (total value thresholds) | Medium |
| FR-4 | Browser notifications are sent when alerts trigger | High |
| FR-5 | Users can manage alerts (view, edit, delete, mute) | High |

## Non-Functional Requirements

| ID | Requirement | Type |
|----|-------------|------|
| NFR-1 | Alerts checked via client-side polling every 5-15 minutes | Performance |
| NFR-2 | Notification permissions requested clearly with user consent | Usability |
| NFR-3 | Alert management UI should be simple and accessible | Usability |
| NFR-4 | Smart defaults to prevent notification fatigue | Usability |

## Dependencies

- **Depends On**: 
  - [4] Fetch Real-Time Prices via CoinGecko API (✅ Done)
  - [9] Persist Portfolio in Local Storage (✅ Done)
  - [3] Calculate and Display Total Portfolio Value (✅ Done)
- **Blocked By**: None

## Assumptions

1. Browser supports Web Notifications API (modern browsers)
2. User's browser allows notification permissions
3. Alerts are client-side only (no backend push notifications for MVP)
4. Alert configurations persist in localStorage alongside portfolio data

## Constraints

1. No backend service - all alert checking is client-side via polling
2. Notifications only work when the app tab is open (Web Notifications limitation)
3. Alert frequency limited to prevent API rate limiting issues

## Out of Scope

- Push notifications requiring backend service
- Email/SMS notifications
- Daily Portfolio Summary (covered in Backlog Item 25)
- Advanced scheduling options

## Questions / Clarifications Needed

- [x] Confirmed: Start with price alerts only, percentage and portfolio alerts as stretch goals
