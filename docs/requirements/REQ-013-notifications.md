# REQ-013: Proactive Notifications

## Related Backlog Items
- [24] Price Alerts & Notifications
- [25] Daily Portfolio Summary & Insights

## Description
Enable proactive user engagement through customizable price alerts, notifications, and daily portfolio summaries to keep users informed and create daily engagement habits.

## Functional Requirements
1. Users shall be able to set price alerts with custom thresholds (above/below specific price).
2. Users shall be able to set percentage change alerts (±X% in 24h).
3. Users shall be able to set portfolio milestone alerts (total value thresholds).
4. The application shall display a daily portfolio summary showing performance, top/worst performers, and notable events.
5. The application shall send browser notifications for triggered alerts.
6. Users shall be able to manage (view, edit, delete, mute) their alerts.

## Non-Functional Requirements
- Alerts should be checked via client-side polling every 5-15 minutes.
- Notification permissions should be requested clearly with user consent.
- Alert management UI should be simple and accessible.
- Daily summary should be personalized and actionable.
- Users should be able to customize notification frequency to avoid fatigue.

## Technical Considerations
- Use Web Notifications API for browser notifications.
- Store alert configurations in localStorage.
- Implement smart defaults to prevent notification fatigue.
- future: Consider backend service for push notifications.
