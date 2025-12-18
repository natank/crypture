# feat(alerts): Implement Price Alerts & Notifications System

> Fixes Backlog Item 24 (REQ-013-notifications)

## Summary

This PR implements the complete Price Alerts & Notifications feature, allowing users to set price thresholds for their assets and receive notifications when those thresholds are crossed. It includes the alert management UI, background polling logic, and comprehensive E2E tests.

- **User Story**: [STORY-024-1] Alert Management UI & [STORY-024-2] Alert Notification System
- **Context**: Users need a way to monitor asset prices without constantly checking the app. This feature provides both in-app and browser notifications for price movements.

## Changes

- [x] **UI**: Implemented `AlertsPanel` for managing alerts (create, edit, delete, mute) and `AlertButton` with badge count.
- [x] **Logic**: Implemented `useAlertPolling` for periodic price checking and `useAlerts` for state management. Fixed a critical render loop regression in `PortfolioPage`.
- [x] **Accessibility**: Ensure alerts panel is keyboard navigable and has proper ARIA roles.
- [x] **Tests**: Added 18 comprehensive E2E tests covering the entire alert lifecycle.

## Files Changed

- **Frontend**
  - `src/pages/PortfolioPage.tsx`: Integrated alert polling and notification components. **Fixed infinite re-render loop by memoizing callbacks.**
  - `src/hooks/useAlertPolling.ts`: Implemented periodic price checking with visibility awareness. Optimized to use `useRef` for stable dependencies.
  - `src/hooks/useAlerts.ts`: Added `mutedAlerts` support and state management.
  - `src/components/AlertsPanel/index.tsx`: Updated to correctly filter and display muted alerts.
  - `src/services/alertService.ts`: Implemented localStorage persistence for alerts.

- **Tests**
  - `src/__tests__/components/AlertForm.test.tsx`: 15 unit tests for alert form component
  - `src/__tests__/components/AlertList.test.tsx`: 20 unit tests for alert list component
  - `src/__tests__/hooks/useAlertPolling.test.ts`: 18 unit tests for polling hook
  - `src/__tests__/services/alertService.test.ts`: 22 unit tests for alert service
  - `src/__tests__/services/notificationService.test.ts`: 13 unit tests for notification service
  - `src/e2e/specs/features/price-alerts.spec.ts`: 18 E2E tests covering:
    - Panel management (open/close/empty state)
    - Alert creation (above/below conditions, validation)
    - Alert management (edit, delete, mute, reactivate)
    - Badge count updates
    - Persistence across reloads

## Acceptance Criteria

- [x] **Permission Request**: App requests notification permission with clear explanation (implemented in `NotificationPermission`)
- [x] **Browser Notification**: When an alert triggers, a browser notification is displayed (via `notificationService`)
- [x] **In-App Notification**: An in-app notification banner is shown (`NotificationBanner`)
- [x] **Alert Polling**: Price conditions are checked periodically (every 5 minutes)
- [x] **Trigger Logic**: Alert triggers when price crosses the threshold
- [x] **Auto-Deactivate**: Triggered alerts are marked as "triggered"
- [x] **Notification Settings**: User can mute/unmute alerts
- [x] **Visual Indicator**: Header shows badge count of active/triggered alerts

## How to Test

### E2E Tests
Run the new price alerts test suite:
```bash
npx playwright test src/e2e/specs/features/price-alerts.spec.ts
```
Expected outcome: All 18 tests pass.

Run the full regression suite to ensure no side effects:
```bash
npm run test:e2e
```
Expected outcome: All tests pass (currently 108 passing, 3 skipped).

### Manual Verification
1. Go to Portfolio page.
2. Click the Bell icon to open the Alerts panel.
3. Create a new alert for Bitcoin (e.g., "Above $1").
4. Verify the alert appears in the "Active" list.
5. Mute the alert and verify it moves to the "Muted" section.
6. Reactivate the alert.
7. (Dev check) Manually trigger an alert or wait for price movement to see the notification banner.

## Checklist

- [x] Lint/Typecheck pass locally
- [x] Unit/Integration tests added or updated (406 unit tests passing)
- [x] E2E tests added/updated (18 new tests)
- [x] Manual smoke test completed (browser notification permissions verified)
- [x] A11y & Mobile checklist completed
  - [x] Alerts panel is keyboard accessible (Esc to close)
  - [x] Controls have proper aria-labels
