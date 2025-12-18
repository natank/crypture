# Story 2: Alert Notification System

## Story Info
- **ID**: STORY-024-2
- **Backlog Item**: [24 - Price Alerts & Notifications](../../../product-backlog.md)
- **Requirement**: [REQ-013-notifications](../../../requirements/REQ-013-notifications.md)

## Description
As a portfolio user, I want to receive notifications when my price alerts are triggered so that I can take action on my investments.

## Acceptance Criteria
- [ ] **Permission Request**: App requests notification permission with clear explanation of why it's needed
- [ ] **Browser Notification**: When an alert triggers, a browser notification is displayed (if permitted)
- [ ] **In-App Notification**: An in-app notification banner is shown regardless of browser permission
- [ ] **Alert Polling**: Price conditions are checked periodically (every 5-15 minutes)
- [ ] **Trigger Logic**: Alert triggers when price crosses the threshold in the specified direction
- [ ] **Auto-Deactivate**: Triggered alerts are marked as "triggered" and won't fire repeatedly
- [ ] **Notification Settings**: User can mute all notifications or dismiss individual alerts
- [ ] **Visual Indicator**: Header shows badge count of active/triggered alerts

## Planning
- **Estimate**: 3 SP
- **Priority**: High

---

## Design Reference

- **UX/UI**: See [Preliminary Design Report](../Preliminary%20Design/preliminary-design-report.md)

### Story-Specific Notes
- Polling should only run when the app is active/visible to save resources
- Consider using `visibilitychange` event to pause/resume polling
- Notification permission should be requested only when user first creates an alert

---

## Task Breakdown
1. [x] Implement `notificationService.ts` with Web Notifications API wrapper
2. [x] Create notification permission request flow component
3. [x] Implement `useAlertPolling` hook for periodic alert checking
4. [x] Create `NotificationBanner` component for in-app alerts
5. [x] Add triggered alert logic to alertService (via polling hook)
6. [x] Add notification badge to header alerts button (Story 1)
7. [x] Implement mute/unmute functionality (Story 1)
8. [x] Write unit tests for notificationService (13 tests)
9. [x] Write unit tests for useAlertPolling hook (18 tests)
10. [x] Write E2E test for alert triggering flow (covered in price-alerts.spec.ts)

---

## Implementation Notes

### Files Created/Modified
- `frontend/src/services/notificationService.ts` - Web Notifications API wrapper (120 lines)
- `frontend/src/hooks/useAlertPolling.ts` - Periodic alert checking with visibility detection
- `frontend/src/components/NotificationBanner/index.tsx` - In-app alert banner
- `frontend/src/components/NotificationPermission/index.tsx` - Permission request dialog
- `frontend/src/pages/PortfolioPage.tsx` - Integrated polling and notifications
- `frontend/src/__tests__/services/notificationService.test.ts` - 13 unit tests
- `frontend/src/__tests__/app-pages/protfolio-page.test.tsx` - Added mocks for new hooks

### Key Features
- Browser notifications via Web Notifications API
- In-app notification banner for triggered alerts
- Permission request dialog with clear explanation
- Periodic alert checking (5 minute intervals)
- Visibility-aware polling (pauses when tab hidden)
- Toast notifications for alert triggers
- Auto-dismissing notifications (5 seconds)

---

## Pull Request

### PR Description
{To be filled after implementation}

---

## Retrospective
{Post-completion notes}
