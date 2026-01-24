# Implementation Plan: Task 1 - KI-01

**Backlog Item:** 29 - UI Polish & Accessibility Improvements  
**Task:** KI-01 - Alerts Indicator State Not Updating  
**Priority:** Must Have  
**Estimated Effort:** Medium (2-4 hours)

---

## Problem Statement

**Current Behavior:**
- Alert badge count in the header does not update immediately when a new alert is created
- Requires page refresh or panel close/reopen to see updated count
- Badge count shows stale data after alert creation, deletion, or triggering

**Root Cause Analysis:**

After analyzing the codebase, I've identified the following issues:

1. **State Flow Issue in PortfolioPage:**
   - `PortfolioPage.tsx` line 40: `const { alertCount, refreshAlerts } = useAlerts();`
   - The `alertCount` is destructured once and passed to `PortfolioHeader`
   - When alerts are created/deleted in `AlertsPanel`, it uses its own instance of `useAlerts()`
   - The parent `PortfolioPage` doesn't re-render because it doesn't know the alerts changed

2. **Multiple Hook Instances:**
   - `PortfolioPage` calls `useAlerts()` (line 40)
   - `AlertsPanel` calls `useAlerts()` again (line 10 in AlertsPanel/index.tsx)
   - Each hook instance maintains its own state copy
   - Changes in one instance don't propagate to the other

3. **Missing State Synchronization:**
   - `useAlerts` hook uses local state (`useState`)
   - No global state management (Context/Redux) to share alert state
   - `refreshAlerts()` is called after operations but only updates local state

**Expected Behavior:**
- Alert badge updates immediately when alert is created
- Alert badge updates immediately when alert is deleted
- Alert badge updates immediately when alert is triggered
- No page refresh required to see updated count

---

## Acceptance Criteria

- [x] Root cause identified
- [ ] Alert badge updates immediately when alert is created
- [ ] Alert badge updates immediately when alert is deleted
- [ ] Alert badge updates immediately when alert is triggered
- [ ] No page refresh required to see updated count
- [ ] No regression in existing alert functionality
- [ ] Unit tests pass
- [ ] E2E tests pass

---

## Technical Approach

### Option 1: Lift Alert State to PortfolioPage (Recommended)

**Pros:**
- Simple, minimal changes
- No new dependencies
- Follows existing patterns in the codebase
- Clear data flow

**Cons:**
- Slightly more props to pass down

**Implementation:**
1. Move `useAlerts()` call from `AlertsPanel` to `PortfolioPage`
2. Pass alert state and handlers as props to `AlertsPanel`
3. `PortfolioPage` will re-render when alerts change
4. `PortfolioHeader` receives updated `alertCount` automatically

### Option 2: Create Alert Context (Over-engineering for this case)

**Pros:**
- Cleaner prop drilling
- More scalable for future features

**Cons:**
- More complex
- Adds new abstraction layer
- Overkill for current needs

**Decision:** Use Option 1 for simplicity and alignment with existing patterns.

---

## Implementation Steps

### Step 1: Modify PortfolioPage to Own Alert State

**File:** `frontend/src/pages/PortfolioPage.tsx`

**Changes:**
1. Keep existing `useAlerts()` call (line 40)
2. Destructure all needed alert state and handlers:
   ```typescript
   const {
     alertCount,
     activeAlerts,
     triggeredAlerts,
     mutedAlerts,
     isLoading: alertsLoading,
     error: alertsError,
     createAlert,
     updateAlert,
     deleteAlert,
     muteAlert,
     reactivateAlert,
     refreshAlerts,
   } = useAlerts();
   ```
3. Pass these as props to `AlertsPanel` component

**Estimated Time:** 15 minutes

---

### Step 2: Update AlertsPanel to Accept Props

**File:** `frontend/src/components/AlertsPanel/index.tsx`

**Changes:**
1. Remove `useAlerts()` hook call (line 10)
2. Update `AlertsPanelProps` interface to accept alert state and handlers:
   ```typescript
   interface AlertsPanelProps {
     isOpen: boolean;
     onClose: () => void;
     availableCoins: MarketCoin[];
     portfolioCoins?: MarketCoin[];
     // Add alert state props
     activeAlerts: PriceAlert[];
     triggeredAlerts: PriceAlert[];
     mutedAlerts: PriceAlert[];
     isLoading: boolean;
     error: string | null;
     createAlert: (input: CreateAlertInput) => PriceAlert | null;
     updateAlert: (id: string, updates: UpdateAlertInput) => PriceAlert | null;
     deleteAlert: (id: string) => boolean;
     muteAlert: (id: string) => PriceAlert | null;
     reactivateAlert: (id: string) => PriceAlert | null;
   }
   ```
3. Use props instead of hook values throughout the component
4. Remove destructuring from hook (lines 27-38)

**Estimated Time:** 30 minutes

---

### Step 3: Update PortfolioPage AlertsPanel Usage

**File:** `frontend/src/pages/PortfolioPage.tsx`

**Changes:**
1. Find `<AlertsPanel>` component usage (around line 400+)
2. Add new props:
   ```tsx
   <AlertsPanel
     isOpen={isAlertsPanelOpen}
     onClose={() => setIsAlertsPanelOpen(false)}
     availableCoins={marketCoins}
     portfolioCoins={portfolioMarketCoins}
     activeAlerts={activeAlerts}
     triggeredAlerts={triggeredAlerts}
     mutedAlerts={mutedAlerts}
     isLoading={alertsLoading}
     error={alertsError}
     createAlert={createAlert}
     updateAlert={updateAlert}
     deleteAlert={deleteAlert}
     muteAlert={muteAlert}
     reactivateAlert={reactivateAlert}
   />
   ```

**Estimated Time:** 15 minutes

---

### Step 4: Verify AlertButton Props Flow

**File:** `frontend/src/components/PortfolioHeader/index.tsx`

**Changes:**
- No changes needed
- Verify that `alertCount` prop is already being passed correctly (lines 17, 94-95)
- The component will automatically receive updated counts when parent re-renders

**Estimated Time:** 5 minutes

---

### Step 5: Testing

**Manual Testing:**
1. Open portfolio page
2. Click alerts button to open panel
3. Create a new alert
4. Verify badge count updates immediately (without closing panel)
5. Delete an alert
6. Verify badge count updates immediately
7. Trigger an alert (by setting price threshold that's already met)
8. Verify badge count and color update immediately

**Automated Testing:**
1. Run existing unit tests: `npm test`
2. Run E2E tests: `npm run test:e2e`
3. Update tests if needed to verify immediate updates

**Estimated Time:** 1 hour

---

### Step 6: Code Review & Documentation

**Tasks:**
1. Review changes for code quality
2. Ensure no console errors
3. Check for any edge cases
4. Update component documentation if needed
5. Add inline comments for clarity

**Estimated Time:** 30 minutes

---

## Files to Modify

| File | Purpose | Lines Affected |
|------|---------|----------------|
| `frontend/src/pages/PortfolioPage.tsx` | Lift alert state, pass to AlertsPanel | ~40, ~400+ |
| `frontend/src/components/AlertsPanel/index.tsx` | Accept props instead of using hook | ~10, ~14-19, ~27-38 |

## Files to Review (No Changes)

| File | Purpose |
|------|---------|
| `frontend/src/components/PortfolioHeader/index.tsx` | Verify alertCount prop flow |
| `frontend/src/components/AlertButton/index.tsx` | Verify badge rendering |
| `frontend/src/hooks/useAlerts.ts` | Verify hook implementation |

---

## Risk Assessment

### Low Risk
- Changes are isolated to component prop flow
- No changes to business logic
- No changes to data structures
- Existing tests should continue to pass

### Potential Issues
1. **Prop drilling depth:** AlertsPanel receives many props
   - Mitigation: Document props clearly, consider Context if this grows
   
2. **Performance:** Parent re-renders on every alert change
   - Mitigation: React's reconciliation is efficient, AlertsPanel already uses memo/callbacks
   
3. **Breaking changes:** AlertsPanel API changes
   - Mitigation: Only used in one place (PortfolioPage), easy to update

---

## Rollback Plan

If issues arise:
1. Revert changes to `AlertsPanel/index.tsx`
2. Revert changes to `PortfolioPage.tsx`
3. Restore original `useAlerts()` call in AlertsPanel
4. Git revert if needed

---

## Success Metrics

- [ ] Alert badge count updates within 100ms of alert creation
- [ ] Alert badge count updates within 100ms of alert deletion
- [ ] Alert badge color changes when alert is triggered
- [ ] No console errors or warnings
- [ ] All existing tests pass
- [ ] Manual testing checklist completed

---

## Timeline

| Step | Duration | Cumulative |
|------|----------|------------|
| 1. Modify PortfolioPage state | 15 min | 15 min |
| 2. Update AlertsPanel props | 30 min | 45 min |
| 3. Update AlertsPanel usage | 15 min | 60 min |
| 4. Verify AlertButton flow | 5 min | 65 min |
| 5. Testing | 60 min | 125 min |
| 6. Code review & docs | 30 min | 155 min |

**Total Estimated Time:** ~2.5 hours (within 2-4 hour estimate)

---

## Next Steps

1. **Review this plan** with team/stakeholder
2. **Get approval** to proceed
3. **Implement** changes in order
4. **Test** thoroughly
5. **Commit** with clear message: `fix(alerts): Update badge count immediately on alert changes (KI-01)`
6. **Update** task documentation with implementation notes

---

## Related Documentation

- Requirement: `docs/requirements/REQ-024-tech-debt.md` (lines 34-59)
- Backlog Item: `docs/product-backlog.md` (line 58)
- SDP Process: `docs/software-development-plan.md` (Phase 7)

---

**Status:** Ready for Review  
**Created:** January 4, 2025  
**Author:** Developer + AI (Cascade)
