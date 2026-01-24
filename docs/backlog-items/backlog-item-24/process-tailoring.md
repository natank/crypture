# Process Tailoring

## Backlog Item
- **ID**: 24
- **Title**: Price Alerts & Notifications
- **Requirement**: [REQ-013-notifications](../../requirements/REQ-013-notifications.md)

## Complexity Assessment

**Assessed Complexity**: ☑️ Medium

### Criteria Evaluation

| Factor | Assessment |
|--------|------------|
| Number of components | 3-4 (AlertForm, AlertList, AlertManager, NotificationBanner) |
| New patterns required | Some (polling service, Web Notifications API, alert state management) |
| Estimated lines of code | 50-200 (multiple files, total ~300-400 lines) |
| External integrations | Existing (CoinGecko API already integrated) |
| UI/UX complexity | Moderate (form, list management, notification UX) |

### Justification
This is a **Medium** complexity item because:
1. Requires multiple new components with interconnected state
2. Introduces new patterns: polling service, Web Notifications API
3. Requires careful UX design for alert management and notification consent
4. No new external APIs, but new client-side service layer
5. Total effort spans multiple sessions but doesn't require deep architectural changes

## Tailored Deliverables

| Deliverable | Required | Reason |
|-------------|----------|--------|
| Requirements Analysis | ☑️ Yes | Completed - multiple functional requirements need clarity |
| Preliminary Design | ☑️ Yes | New UX patterns for alerts/notifications require upfront design |
| Detailed Design | ⬜ Skip | Medium complexity - preliminary design sufficient |
| Story Breakdown | ☑️ Yes (2 stories) | Split by user-facing features for incremental delivery |

## Tailored Task List

### Phase: Design
- [x] Create preliminary design with UI wireframes
- [x] Define alert data model and localStorage schema
- [ ] Design notification flow and permission handling

### Phase: Implementation (Story 1 - Core Price Alerts)
- [x] Create `Alert` type definitions
- [x] Implement `alertService` for CRUD operations on localStorage
- [x] Create `AlertForm` component for setting price alerts
- [x] Create `AlertList` component for managing alerts
- [x] Implement `useAlerts` hook for state management

### Phase: Implementation (Story 2 - Notification System)
- [x] Implement `notificationService` with Web Notifications API
- [x] Create polling mechanism for checking alert conditions
- [x] Implement notification permission flow with user consent
- [x] Add visual notification banner for in-app alerts
- [x] Handle alert triggering and deactivation

### Phase: Testing
- [x] Unit tests for alertService (22 tests) and notificationService (13 tests)
- [x] Unit tests for AlertForm (15 tests) and AlertList (20 tests) components
- [x] Unit tests for useAlertPolling hook (18 tests)
- [x] E2E tests for creating and triggering alerts (18 tests)
- [x] Manual testing of browser notification permissions

## Notes
- Focus on price alerts first (FR-1); percentage (FR-2) and portfolio (FR-3) alerts can be added later
- Web Notifications require HTTPS or localhost - ensure dev environment supports this
- Consider a "quiet hours" or "mute all" feature to prevent notification fatigue
