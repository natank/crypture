# Story 1: Core Price Alerts

## Story Info
- **ID**: STORY-024-1
- **Backlog Item**: [24 - Price Alerts & Notifications](../../../product-backlog.md)
- **Requirement**: [REQ-013-notifications](../../../requirements/REQ-013-notifications.md)

## Description
As a portfolio user, I want to create, view, edit, and delete price alerts for my assets so that I can track when prices reach my target levels.

## Acceptance Criteria
- [ ] **Create Alert**: User can create a price alert specifying asset, target price, and direction (above/below)
- [ ] **View Alerts**: User can view a list of all active alerts with asset, target price, and status
- [ ] **Edit Alert**: User can modify an existing alert's target price or direction
- [ ] **Delete Alert**: User can remove an alert from the list
- [ ] **Persistence**: Alerts are saved to localStorage and persist across sessions
- [ ] **Validation**: Form validates that target price is a positive number
- [ ] **Asset Selection**: User can select from their portfolio assets or search all available coins

## Planning
- **Estimate**: 3 SP
- **Priority**: High

---

## Design Reference

- **UX/UI**: See [Preliminary Design Report](../Preliminary%20Design/preliminary-design-report.md)

### Story-Specific Notes
- Alert form should be accessible from the header toolbar (bell icon) or from individual asset rows
- Consider a slide-out panel or modal for alert management to avoid leaving the portfolio view

---

## Task Breakdown
1. [x] Create `Alert` type definition in `frontend/src/types/alert.ts`
2. [x] Implement `alertService.ts` with CRUD operations and localStorage persistence
3. [x] Create `AlertForm` component for creating/editing alerts
4. [x] Create `AlertList` component for displaying alerts
5. [x] Create `AlertsPanel` container component (slide-out or modal)
6. [x] Add alert button to header toolbar
7. [x] Write unit tests for alertService (22 tests)
8. [ ] Write unit tests for AlertForm and AlertList
9. [ ] Write E2E test for alert CRUD operations

---

## Implementation Notes

### Files Created/Modified
- `frontend/src/types/alert.ts` - Alert type definitions (PriceAlert, CreateAlertInput, UpdateAlertInput)
- `frontend/src/services/alertService.ts` - Alert CRUD and localStorage persistence (150+ lines)
- `frontend/src/hooks/useAlerts.ts` - React hook for alert state management
- `frontend/src/components/AlertForm/index.tsx` - Create/edit alert form with coin search
- `frontend/src/components/AlertList/index.tsx` - Alert list with status grouping and actions
- `frontend/src/components/AlertsPanel/index.tsx` - Slide-out panel container with framer-motion
- `frontend/src/components/AlertButton/index.tsx` - Bell icon button with badge
- `frontend/src/components/PortfolioHeader/index.tsx` - Added AlertButton integration
- `frontend/src/pages/PortfolioPage.tsx` - Added AlertsPanel and state management
- `frontend/src/__tests__/services/alertService.test.ts` - 22 unit tests

### Key Features
- Create price alerts with above/below conditions
- Search and select from portfolio or all coins
- View active, triggered, and muted alerts
- Edit, delete, mute, and reactivate alerts
- Badge count on bell icon
- Smooth slide-out panel animation
- Persistent storage in localStorage (max 50 alerts)

---

## Pull Request

### PR Description
{To be filled after implementation}

---

## Retrospective
{Post-completion notes}
