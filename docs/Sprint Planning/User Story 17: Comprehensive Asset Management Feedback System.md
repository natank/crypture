## 🧾 User Story 17: Comprehensive Asset Management Feedback System

**User Story**  
_As a portfolio manager,_  
_I want clear, consistent, and accessible feedback for all portfolio management actions_  
_so I can confidently track and verify my asset changes._

### Asset Addition & Editing
- [ ] **17.1** Show existing quantity in the asset selector dropdown (e.g., "Bitcoin (BTC) - Owned: 1.5")
- [ ] **17.2** Display toast notifications for all asset operations:
  - **Add Success (new)**: "✓ Added 1.5 BTC to your portfolio"
  - **Add Success (existing)**: "✓ Added 1.5 BTC (Total: 3.0 BTC)"
  - **Edit Success**: "✓ Updated BTC quantity to 3.0"
  - **Error (validation)**: "✗ Invalid quantity: Must be a positive number"
  - **Error (API)**: "✗ Failed to save changes. Please try again."

### Import Operations
- [ ] **17.3** Show import preview with summary before confirmation
- [ ] **17.4** Display toast notifications for import results:
  - **Success**: "✓ Imported 5 assets (2 updated, 3 new)"
  - **Partial Success**: "✓ Imported 4/5 assets (1 skipped - invalid format)"
  - **Error**: "✗ Import failed: Invalid file format"

### Export Operations
- [ ] **17.5** Show success toast after export with:
  - Number of assets exported
  - File format and name
  - Visual confirmation (✓ icon)
- [ ] **17.6** Show error toast for failed exports

### Visual Feedback
- [ ] **17.7** Loading states for all async operations
- [ ] **17.8** Highlight recently added/updated assets
- [ ] **17.9** Warning for unusual quantity inputs

### Accessibility & Help
- [ ] **17.10** All notifications accessible via screen readers
- [ ] **17.11** Tooltips explaining quantity summing behavior
- [ ] **17.12** Dismissible help banner for first-time users
- [ ] **17.13** Keyboard navigation support for all interactive elements

**Technical Notes**
- Reuse existing `react-hot-toast` implementation
- Add new toast components for different notification types
- Implement proper ARIA labels and roles
- Add analytics events for user interactions
- Update e2e tests for all new feedback mechanisms

**Dependencies**
- Completion of User Story #16 (Edit Asset Quantity)

**Priority**: High  
**Story Points**: 8 (Medium-high complexity, multiple components and states)

---

## 1. Design Sketch

### Overview
- Centralize toast notification logic in a `useNotifications` hook
- Enhance `AssetSelector` to display owned quantities inline
- Add visual feedback layer (highlights, loading states) without blocking user flow
- Leverage existing `react-hot-toast` with custom toast components
- All feedback messages follow consistent format: icon + action + result
- Screen reader announcements via `aria-live` regions
- No feature flags needed (all improvements are progressive enhancements)
- Analytics events fire for all user actions (add/edit/delete/import/export)

### Public API & Contracts

**useNotifications Hook**
```typescript
interface NotificationOptions {
  duration?: number;
  icon?: string;
  ariaLabel?: string;
}

export function useNotifications() {
  return {
    success: (message: string, options?: NotificationOptions) => void;
    error: (message: string, options?: NotificationOptions) => void;
    warning: (message: string, options?: NotificationOptions) => void;
    info: (message: string, options?: NotificationOptions) => void;
  };
}
```

**AssetSelector Enhancement**
```typescript
interface AssetSelectorProps {
  // ... existing props
  portfolio?: PortfolioState; // NEW: for showing owned quantities
  showOwnedQuantities?: boolean; // NEW: toggle feature
}
```

**useAssetHighlight Hook** (for AC 17.8)
```typescript
export function useAssetHighlight(assetId: string, triggerCount: number) {
  return {
    isHighlighted: boolean;
    highlightClass: string;
  };
}
```

### Data Flow

**Add Asset Flow:**
1. User submits `AddAssetModal` → `useAddAssetForm.handleSubmit()`
2. Validation passes → `addAsset(newAsset)` called
3. State updates → localStorage persists
4. `onSuccess` callback fires → `notifications.success()`
5. If asset exists: message shows "Added X (Total: Y)"
6. If new: message shows "Added X to portfolio"
7. Asset row highlights for 3s via `useAssetHighlight`
8. Analytics: `asset_added` event fires

**Import Flow:**
1. User selects file → `usePortfolioImportExport.onFileSelected()`
2. Parsing succeeds → preview modal shows with summary
3. User clicks Merge/Replace → `applyMerge()`/`applyReplace()`
4. Assets batch-added → count tracked (new vs updated)
5. Success → `notifications.success("Imported X assets (Y updated, Z new)")`
6. Partial failure → `notifications.warning("Imported X/Y assets (Z skipped)")`
7. Complete failure → `notifications.error("Import failed: [reason]")`
8. Analytics: `portfolio_imported` event with counts

**Export Flow:**
1. User clicks Export → `exportPortfolio(format)`
2. File generation starts → button shows loading spinner
3. Download triggered → `notifications.success("Exported X assets to [filename]")`
4. Failure → `notifications.error("Export failed")`
5. Analytics: `portfolio_exported` event with format + count

### Component Boundaries

**UI Layer** (`frontend/src/components/`)
- `AddAssetModal.tsx`: Add success/error toasts
- `AssetSelector.tsx`: Display owned quantities
- `AssetRow/index.tsx`: Use `useAssetHighlight` for visual feedback
- `ExportImportControls/index.tsx`: Add loading states + toast triggers
- `ImportPreviewModal.tsx`: Show summary stats before confirmation

**Hooks Layer** (`frontend/src/hooks/`)
- `useNotifications.ts`: NEW - Wraps `react-hot-toast` with consistent API
- `useAssetHighlight.ts`: NEW - Manages temporary highlight state
- `useAddAssetForm.ts`: Trigger notifications on success/error
- `usePortfolioImportExport.ts`: Trigger notifications for import/export results
- `usePortfolioState.ts`: Return operation results for notification triggers

**Services** (no changes needed)
- Existing services remain unchanged
- Notifications fire at hook/component level

### Feature Gating
- **No feature flags required** - all changes are additive
- Notifications default to enabled (progressive enhancement)
- Owned quantities in AssetSelector: show if `portfolio` prop provided
- Graceful degradation: missing props = existing behavior

---

## 2. Implementation Plan

### Phase 1: Notification Infrastructure (Shippable) ✅ **COMPLETE**
- [x] Create `frontend/src/hooks/useNotifications.tsx`
  - Wrap `react-hot-toast` with consistent API
  - Default durations: success 4s, error 8s, warning 6s
  - Return `{ success, error, warning, info }` methods
- [x] Create custom toast components in `frontend/src/components/Toast/`
  - `SuccessToast.tsx`: Green background, checkmark icon
  - `ErrorToast.tsx`: Red background, X icon
  - `WarningToast.tsx`: Amber background, warning icon
- [x] Add ARIA labels to toast components
  - `role="status"` for success/info
  - `role="alert"` for errors/warnings
  - `aria-live="polite"` for non-critical, `"assertive"` for errors
- [x] Unit tests created and passing (30 tests: 12 hook + 18 components)

### Phase 2: Add Asset Notifications (Shippable) ✅ **COMPLETE**
- [x] Update `useAddAssetForm.ts`
  - On success: check if asset existed → format message accordingly
  - Call `notifications.success()` with appropriate message
  - On error: call `notifications.error()` with validation message
- [x] Update `PortfolioPage.tsx`
  - Pass `portfolio` to `AddAssetModal` for owned quantity check
- [x] Update `AssetSelector.tsx`
  - Accept `portfolio?: PortfolioState` prop
  - Map coins → show " - Owned: X" suffix if asset in portfolio
  - Keep existing behavior if prop not provided
  - Performance: useMemo for O(1) owned quantity lookup
- [x] Updated existing unit tests (mocked useNotifications)
- [x] **E2E Tests**: Create `e2e/specs/features/notifications.spec.ts`
  - Test: Add new asset shows success notification with correct message ✅
  - Test: Add to existing asset shows "Total: X" message ✅
  - Test: Validation error shows error toast ✅
  - Test: Shows owned quantity in asset selector ✅
  - Test: Edge cases (negative, zero, modal behavior) ✅
  - Note: Asset highlight test deferred to Phase 5 (Visual Feedback)

### Phase 3: Delete Asset Notifications (Shippable)
- [ ] Update `PortfolioPage.tsx` delete handler
  - After `removeAsset()`: call `notifications.success("✓ Removed [name] from portfolio")`
  - On error: call `notifications.error("✗ Failed to remove asset")`
- [ ] **E2E Tests**: Add to `e2e/specs/features/notifications.spec.ts`
  - Test: Delete asset shows confirmation toast with asset name
  - Test: Delete confirmation modal + success notification flow

### Phase 4: Import/Export Notifications (Shippable)
- [ ] Update `usePortfolioImportExport.ts`
  - Track counts during `applyMerge`/`applyReplace`: `{ added, updated }`
  - Return result object from apply methods
- [ ] Update `PortfolioPage.tsx` import handlers
  - On success: format message with counts
  - On partial: show warning with skipped count
  - On error: show error message
- [ ] Update `ExportImportControls/index.tsx`
  - Add loading state during export
  - Trigger success toast after download with filename + count
  - Catch export errors and show error toast
- [ ] **E2E Tests**: Create `e2e/specs/features/import-export-feedback.spec.ts`
  - Test: Export shows success toast with filename and asset count
  - Test: Import shows preview modal with summary counts
  - Test: Import success shows single batch toast (not individual toasts)
  - Test: Import partial success shows warning with skipped count
  - Test: Import error shows error toast with helpful message
  - Test: Export with empty portfolio shows warning toast

### Phase 5: Visual Feedback (Shippable)
- [ ] Create `useAssetHighlight.ts` hook
  - Accept `assetId` and trigger counter
  - Return `isHighlighted` boolean (true for 3s after trigger)
  - Use `useState` + `useEffect` with timeout
- [ ] Update `AssetRow/index.tsx`
  - Call `useAssetHighlight(asset.id, updateCounter)`
  - Apply highlight class when `isHighlighted`: `bg-teal-50 dark:bg-teal-900/20 transition-colors duration-1000`
- [ ] Update `PortfolioPage.tsx`
  - Track last operation: `useState<{ type, assetId, timestamp }>()`
  - Pass trigger to AssetList/AssetRow

### Phase 6: Unusual Input Warnings (Shippable)
- [ ] Add validation to `validateQuantity.ts`
  - Warn if quantity > 1000000 (potential typo)
  - Warn if quantity < 0.00000001 (dust amount)
  - Return `{ valid, error?, warning? }`
- [ ] Update `AddAssetModal.tsx` and `AssetRow` edit mode
  - Show warning toast for unusual values (non-blocking)
  - User can proceed after acknowledgment
- [ ] **E2E Tests**: Add to `e2e/specs/features/notifications.spec.ts`
  - Test: Large quantity (> 1M) shows warning toast but allows proceed
  - Test: Tiny quantity (< 0.00000001) shows warning toast but allows proceed

### Phase 7: Accessibility & Help (Shippable)
- [ ] Add tooltips to `AssetSelector` explaining summing behavior
  - "Adding to an existing asset will increase your total quantity"
- [ ] Create dismissible help banner component
  - Show on first portfolio visit (localStorage key: `help_banner_dismissed`)
  - "Tip: You can add multiple purchases of the same asset..."
- [ ] Audit all interactive elements for keyboard nav
  - Verify tab order, Enter/Space handlers
  - Test with screen reader (VoiceOver/NVDA)
- [ ] **E2E Tests**: Create `e2e/specs/a11y/notification-accessibility.spec.ts`
  - Test: Toasts have proper ARIA attributes (role, aria-live)
  - Test: Success toasts use role="status" with aria-live="polite"
  - Test: Error toasts use role="alert" with aria-live="assertive"
  - Test: Keyboard navigation skips past toasts (not focusable)
  - Test: Help banner is dismissible and persists preference
  - Test: Tooltips are keyboard accessible (focus + hover)
- [ ] **E2E Tests**: Add mobile viewport tests to existing specs
  - Test: Notifications visible on mobile (375x667)
  - Test: Touch targets meet 44x44px minimum (tap-44)
  - Test: Toast positioning doesn't overlap with keyboard

### Analytics Events
```typescript
// Track in Phase 2-4 alongside notifications
analytics.track('asset_added', { 
  assetId, 
  quantity, 
  wasExisting: boolean,
  method: 'manual' | 'import'
});

analytics.track('asset_deleted', { assetId });

analytics.track('asset_updated', { 
  assetId, 
  oldQuantity, 
  newQuantity 
});

analytics.track('portfolio_imported', { 
  format: 'csv' | 'json',
  assetsAdded: number,
  assetsUpdated: number,
  assetsSkipped: number,
  success: boolean
});

analytics.track('portfolio_exported', { 
  format: 'csv' | 'json',
  assetCount: number,
  success: boolean
});
```

### Migrations/Deprecations
- **None** - all changes are additive
- Existing code continues to work without modifications
- New features activate when props/hooks are adopted

---

## 3. Risks & Tradeoffs

### Risk 1: Toast Notification Overload
**Problem**: Multiple rapid operations (e.g., bulk import) could spam 50 toasts, overwhelming UI and screen readers.

**Mitigation**:
- Batch notifications: single toast for bulk operations with summary
- Import: "✓ Imported 5 assets" (not 5 separate toasts)
- Queue management: auto-dismiss old toasts when new ones arrive (max 3 visible)
- Debounce repeated notifications for same asset within 2s

### Risk 2: Owned Quantity Calculation Performance
**Problem**: `AssetSelector` iterating entire portfolio for every coin render could cause lag with 100+ coins.

**Mitigation**:
- Pre-compute owned quantities map once: `useMemo(() => portfolio.reduce(...), [portfolio])`
- Pass map to AssetSelector: O(1) lookup per coin instead of O(n)
- Only show owned quantities if portfolio < 1000 assets (edge case guard)
- Add performance budget test: render time < 100ms

### Risk 3: Highlight Timing Conflicts
**Problem**: User adds asset A, then quickly adds asset B → both highlight simultaneously, diluting feedback.

**Mitigation**:
- Stagger highlights: delay second highlight by 500ms if first is active
- Use distinct colors for add vs edit: teal for add, purple for edit
- Limit highlights to most recent 3 operations, clear older ones
- Add e2e test for rapid sequential operations

### Risk 4: Screen Reader Announcement Conflicts
**Problem**: Toast + highlight + modal = multiple `aria-live` regions announcing simultaneously, creating audio chaos.

**Mitigation**:
- Use `aria-live="polite"` for toasts (wait for current speech to finish)
- Use `role="status"` instead of `role="alert"` for success messages
- Modal announcements take precedence (assertive)
- Test with VoiceOver/NVDA to verify announcement order

### Risk 5: Localization of Dynamic Messages
**Problem**: "Added 1.5 BTC (Total: 3.0 BTC)" requires runtime string interpolation, complicating i18n.

**Mitigation**:
- Structure messages as templates: `t('notifications.asset_added_existing', { quantity, symbol, total })`
- Use ICU MessageFormat for pluralization: "1 asset" vs "5 assets"
- Extract all notification strings to i18n keys in implementation
- Document message format requirements in `docs/i18n-guide.md`

---

## 4. Test Plan

### Unit Tests (Vitest + RTL)

**useNotifications Hook** (`__tests__/hooks/useNotifications.test.ts`)
```typescript
describe('useNotifications', () => {
  it('calls toast.success with correct message', () => {
    const { success } = renderHook(() => useNotifications()).result.current;
    success('Test message');
    expect(toast.success).toHaveBeenCalledWith('Test message', expect.any(Object));
  });

  it('applies custom duration for errors', () => {
    const { error } = renderHook(() => useNotifications()).result.current;
    error('Error', { duration: 10000 });
    expect(toast.error).toHaveBeenCalledWith('Error', { duration: 10000 });
  });

  it('includes aria-label in toast options', () => {
    const { success } = renderHook(() => useNotifications()).result.current;
    success('Success', { ariaLabel: 'Asset added successfully' });
    expect(toast.success).toHaveBeenCalledWith('Success', expect.objectContaining({ ariaLabel: 'Asset added successfully' }));
  });
});
```

**useAssetHighlight Hook** (`__tests__/hooks/useAssetHighlight.test.ts`)
```typescript
describe('useAssetHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('returns highlighted state immediately after trigger', () => {
    const { result } = renderHook(() => useAssetHighlight('btc', 1));
    expect(result.current.isHighlighted).toBe(true);
  });

  it('clears highlight after 3 seconds', () => {
    const { result } = renderHook(() => useAssetHighlight('btc', 1));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isHighlighted).toBe(false);
  });

  it('re-triggers highlight when counter increments', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useAssetHighlight('btc', count),
      { initialProps: { count: 1 } }
    );
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.isHighlighted).toBe(false);
    
    rerender({ count: 2 });
    expect(result.current.isHighlighted).toBe(true);
  });
});
```

**AssetSelector with Owned Quantities** (`__tests__/components/AssetSelector.owned.test.tsx`)
```typescript
describe('AssetSelector - Owned Quantities', () => {
  it('displays owned quantity for assets in portfolio', () => {
    const portfolio = [{ coinInfo: { id: 'bitcoin', symbol: 'btc' }, quantity: 1.5 }];
    render(<AssetSelector portfolio={portfolio} coins={mockCoins} {...defaultProps} />);
    
    expect(screen.getByText(/Bitcoin.*Owned: 1.5/)).toBeInTheDocument();
  });

  it('does not show owned text for assets not in portfolio', () => {
    const portfolio = [{ coinInfo: { id: 'bitcoin' }, quantity: 1.5 }];
    render(<AssetSelector portfolio={portfolio} coins={mockCoins} {...defaultProps} />);
    
    expect(screen.queryByText(/Ethereum.*Owned/)).not.toBeInTheDocument();
  });

  it('gracefully handles empty portfolio', () => {
    render(<AssetSelector portfolio={[]} coins={mockCoins} {...defaultProps} />);
    expect(screen.queryByText(/Owned:/)).not.toBeInTheDocument();
  });
});
```

**AddAssetModal Notifications** (`__tests__/components/AddAssetModal.notifications.test.tsx`)
```typescript
describe('AddAssetModal - Notifications', () => {
  it('shows success toast when adding new asset', async () => {
    const user = userEvent.setup();
    render(<AddAssetModal {...defaultProps} />);
    
    await user.type(screen.getByLabelText(/quantity/i), '1.5');
    await user.click(screen.getByRole('button', { name: /add asset/i }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Added 1.5 BTC to your portfolio')
      );
    });
  });

  it('shows different message when adding to existing asset', async () => {
    const portfolio = [{ coinInfo: { id: 'bitcoin', symbol: 'btc' }, quantity: 1.0 }];
    render(<AddAssetModal portfolio={portfolio} {...defaultProps} />);
    
    // ... add 0.5 more BTC
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Added 0.5 BTC (Total: 1.5 BTC)')
      );
    });
  });

  it('shows error toast on validation failure', async () => {
    // ... trigger validation error
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Invalid quantity')
      );
    });
  });
});
```

### Integration Tests

**Portfolio Operations with Notifications** (`__tests__/integration/portfolio-feedback.test.tsx`)
```typescript
describe('Portfolio Feedback Integration', () => {
  it('full flow: add → shows toast → asset highlights → highlight fades', async () => {
    render(<PortfolioPage />);
    
    // Add asset
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    // ... fill form and submit
    
    // Verify toast
    expect(toast.success).toHaveBeenCalled();
    
    // Verify highlight appears
    const assetRow = screen.getByTestId('asset-row-bitcoin');
    expect(assetRow).toHaveClass('bg-teal-50');
    
    // Fast-forward 3s
    act(() => vi.advanceTimersByTime(3000));
    
    // Verify highlight removed
    expect(assetRow).not.toHaveClass('bg-teal-50');
  });

  it('import flow: shows preview → confirms → batch toast with counts', async () => {
    const file = createMockCSVFile('bitcoin,1.5\nethereum,2.0');
    // ... upload file
    
    // Verify preview shows summary
    expect(screen.getByText(/2 assets will be imported/)).toBeInTheDocument();
    
    // Confirm import
    await userEvent.click(screen.getByRole('button', { name: /merge/i }));
    
    // Verify single summary toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        '✓ Imported 2 assets (0 updated, 2 new)'
      );
    });
    expect(toast.success).toHaveBeenCalledTimes(1); // Not 2 separate toasts
  });
});
```

### E2E Tests (Playwright)

**Notification Visibility** (`e2e/specs/features/notifications.spec.ts`)
```typescript
test('add asset shows success notification', async ({ page }) => {
  await page.goto('/portfolio');
  
  await page.click('button:has-text("Add Asset")');
  await page.fill('[aria-label*="quantity"]', '1.5');
  await page.selectOption('select', 'bitcoin');
  await page.click('button:has-text("Add Asset")');
  
  // Verify toast appears
  const toast = page.locator('[role="status"]', { hasText: /Added 1.5 BTC/ });
  await expect(toast).toBeVisible();
  
  // Verify toast auto-dismisses
  await expect(toast).not.toBeVisible({ timeout: 5000 });
});

test('asset row highlights after addition', async ({ page }) => {
  await page.goto('/portfolio');
  
  // Add asset
  // ...
  
  // Verify highlight class
  const assetRow = page.locator('[data-testid="asset-row-bitcoin"]');
  await expect(assetRow).toHaveClass(/bg-teal-50/);
  
  // Wait for fade
  await page.waitForTimeout(3500);
  await expect(assetRow).not.toHaveClass(/bg-teal-50/);
});
```

**Import/Export Feedback** (`e2e/specs/features/import-export-feedback.spec.ts`)
```typescript
test('export shows success toast with filename', async ({ page }) => {
  await page.goto('/portfolio');
  
  // Add some assets first
  // ...
  
  await page.click('button:has-text("Export")');
  
  // Verify toast with filename
  await expect(page.locator('[role="status"]', { 
    hasText: /Exported 2 assets to portfolio-\d{4}-\d{2}-\d{2}\.csv/ 
  })).toBeVisible();
});

test('import shows preview with counts', async ({ page }) => {
  await page.goto('/portfolio');
  
  const file = createTestCSVFile();
  await page.setInputFiles('input[type="file"]', file);
  
  // Verify preview modal
  await expect(page.locator('text=2 assets will be imported')).toBeVisible();
  
  await page.click('button:has-text("Merge")');
  
  // Verify summary toast (not individual toasts)
  const successToast = page.locator('[role="status"]', { 
    hasText: /Imported 2 assets/ 
  });
  await expect(successToast).toBeVisible();
  
  // Verify no duplicate toasts
  await expect(page.locator('[role="status"]')).toHaveCount(1);
});
```

**Accessibility** (`e2e/specs/a11y/notification-accessibility.spec.ts`)
```typescript
test('toasts are announced to screen readers', async ({ page }) => {
  await page.goto('/portfolio');
  
  // Add asset
  // ...
  
  // Verify toast has proper ARIA
  const toast = page.locator('[role="status"]');
  await expect(toast).toHaveAttribute('aria-live', 'polite');
  
  // Verify error uses alert role
  // ... trigger error
  const errorToast = page.locator('[role="alert"]');
  await expect(errorToast).toBeVisible();
});

test('keyboard navigation through notifications', async ({ page }) => {
  await page.goto('/portfolio');
  
  // Add asset to trigger toast
  // ...
  
  // Tab should skip past toast (not focusable)
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).not.toBe('DIV'); // Toast container
});
```

### Edge Cases

**Empty States**
- [ ] Export with empty portfolio → shows warning toast "Cannot export empty portfolio"
- [ ] Import empty file → shows error "File is empty or invalid"
- [ ] Asset selector with no owned assets → no "Owned:" suffix shown

**Error Cases**
- [ ] Network failure during export → error toast + retry option
- [ ] Invalid CSV format → error toast with line number
- [ ] Duplicate import (100% existing assets) → warning toast, no changes

**Slow Network**
- [ ] Import large file (100+ assets) → loading spinner, no timeout
- [ ] Export during network lag → button shows loading, no double-click
- [ ] Toast queue during bulk operations → max 3 visible, oldest dismissed

**Null/Undefined Inputs**
- [ ] `portfolio` prop undefined in AssetSelector → gracefully hide owned quantities
- [ ] Toast with empty message → fallback to generic "Operation completed"
- [ ] Highlight with null assetId → no-op, no crash

---

## 5. File Changes Summary

### New Files
```
frontend/src/hooks/useNotifications.ts
frontend/src/hooks/useAssetHighlight.ts
frontend/src/components/Toast/SuccessToast.tsx
frontend/src/components/Toast/ErrorToast.tsx
frontend/src/components/Toast/WarningToast.tsx
frontend/src/__tests__/hooks/useNotifications.test.ts
frontend/src/__tests__/hooks/useAssetHighlight.test.ts
frontend/src/__tests__/components/AssetSelector.owned.test.tsx
frontend/src/__tests__/components/AddAssetModal.notifications.test.tsx
frontend/src/__tests__/integration/portfolio-feedback.test.tsx
frontend/src/e2e/specs/features/notifications.spec.ts
frontend/src/e2e/specs/features/import-export-feedback.spec.ts
frontend/src/e2e/specs/a11y/notification-accessibility.spec.ts
```

### Modified Files
```
frontend/src/hooks/useAddAssetForm.ts        (add notifications)
frontend/src/hooks/usePortfolioImportExport.ts  (add counts + notifications)
frontend/src/components/AssetSelector.tsx    (add owned quantities)
frontend/src/components/AssetRow/index.tsx   (add highlight)
frontend/src/components/AddAssetModal.tsx    (pass portfolio prop)
frontend/src/components/ExportImportControls/index.tsx  (add loading + notifications)
frontend/src/pages/PortfolioPage.tsx         (wire notifications, pass portfolio)
frontend/src/utils/validateQuantity.ts       (add warnings for unusual values)
```

---

## 6. Definition of Done

- [ ] All 13 acceptance criteria implemented and verified
- [ ] Unit tests: 25+ new tests, all passing
- [ ] Integration tests: 5+ scenarios, all passing
- [ ] **E2E tests: 20+ specs, all passing** (including a11y + mobile)
  - Phase 2: 4 notification tests
  - Phase 3: 2 delete notification tests
  - Phase 4: 6 import/export feedback tests
  - Phase 6: 2 unusual input warning tests
  - Phase 7: 9 accessibility + mobile tests
- [ ] Code review completed, no blocking issues
- [ ] Accessibility audit: WCAG AA compliance verified
- [ ] Screen reader tested (VoiceOver on macOS, NVDA on Windows)
- [ ] Mobile tested (iOS Safari, Chrome Android)
- [ ] Performance: No regressions, render times < 100ms
- [ ] Documentation updated (CHANGELOG, component docs)
- [ ] Analytics events firing correctly (verified in dev console)
- [ ] i18n structure ready (strings extractable for future translation)

---
