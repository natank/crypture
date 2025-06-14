# TD-02 Component Audit Log

_Last updated: 2025-06-14_

## 🔎 Summary of Component Audit

The audit reviewed all major UI components, containers, and supporting hooks for:
- Consistent use of layout and spacing per `ui-mockups.md`
- Design token usage from `style-guide.md`
- Hardcoded Tailwind classes or color values
- Accessibility attributes (aria-labels, tooltips, roles)
- Ensuring **no logic changes** during visual refactor

### Overall Findings
- **Alignment:** Most components are fully aligned with the design system and mockups, using correct tokens and semantic structure.
- **Accessibility:** Nearly all interactive elements have appropriate accessibility attributes. Minor improvements are possible for spinners and inline errors.
- **Hardcoded Classes:** No critical hardcoded colors; a few minor deviations (e.g., `text-gray-400` for fallback text, `text-gray-800` for empty state) were noted but do not impact accessibility.
- **Supporting Hooks:** All hooks are pure logic and do not directly affect visual or accessibility aspects.

### Minor Issues & Suggestions
- Use `text-gray-900` instead of `text-gray-800` for empty state text in `AssetList` for consistency.
- Use `text-gray-500` instead of `text-gray-400` for fallback/disabled text for better contrast.
- Add `aria-label` or `role="status"` to loading spinners for screen reader support.
- If `InlineErrorBadge` is used outside an already-labeled context, consider adding `role="alert"`.

### Next Steps
- Address minor suggestions above in a focused refactor PR.
- Proceed with the next TD-02 tasks: refactor implementation, token mapping in Tailwind config, and documentation of changes in `refactor-notes.md`.

---

This file tracks the audit of all UI components and relevant files for the TD-02 UI Visibility Refactor and Design Token Integration. Each component will be reviewed for:
- Consistent use of layout/spacing per `ui-mockups.md`
- Design token usage from `style-guide.md`
- Hardcoded Tailwind classes or color values
- Accessibility attributes (aria-label, tooltips)
- No logic changes during visual refactor

---

## 📋 Component Audit Targets

### Top-Level App Entrypoint
#### `App.tsx`

**Audit Results (2025-06-14):**

- **Layout/Structure:**
  - The file is minimal and only renders the `PortfolioPage` component.
  - No layout or spacing logic is present at this level.
- **Design Token Usage:**
  - No Tailwind or design token classes are used directly in this file.
- **Hardcoded Classes/Colors:**
  - None present.
- **Accessibility:**
  - No accessibility attributes are needed at this level.
- **Other Notes:**
  - There is a stray line: `const a = 'sdf'` which appears to be leftover debug code and should be removed for cleanliness.

**Status:**
- ✅ No visual or token issues found at the App entrypoint.
- 🟡 Minor: Remove stray debug variable for code cleanliness.

### Main Screens & Containers

#### `PortfolioHeader/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Uses semantic `<header role="banner">` and clear heading hierarchy.
  - Spacing via `space-y-1` for vertical separation.
- **Design Token Usage:**
  - Heading: `text-xl font-semibold text-gray-900` (matches style guide: `font-heading`, color, weight).
  - Subtext: `text-sm text-gray-500` (matches `font-subtle`).
- **Hardcoded Classes/Colors:**
  - All classes use design tokens or Tailwind utilities per style guide.
- **Accessibility:**
  - Uses `role="banner"` for landmark.
  - Content is descriptive; no interactive elements at this level.
- **Status:**
  - ✅ Fully aligned with mockups and style guide. No changes needed.

---

#### `AssetList/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Uses `section` with `space-y-4` for logical grouping.
  - Header and add button in flex row, asset list in divided column.
- **Design Token Usage:**
  - Section header: `text-base font-medium text-gray-900` (matches tokens).
  - Add button: `bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200` (all from style guide).
  - Empty state: `text-gray-800 italic` (gray-800 is not in main palette, consider switching to `text-gray-900` for consistency).
  - Divider: `divide-y divide-gray-200` (matches tokens).
- **Hardcoded Classes/Colors:**
  - All classes match style guide except `text-gray-800` (minor, but not a critical issue).
- **Accessibility:**
  - Add button has `data-testid` but no `aria-label` or tooltip—could add for clarity.
  - Section uses semantic `section` and headings.
- **Status:**
  - 🟢 Mostly aligned. Suggest changing `text-gray-800` to `text-gray-900` for empty state and consider adding `aria-label` to the add button.

---

#### `AddAssetModal.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Modal uses fixed overlay, centered flex, and `max-w-md` for responsive sizing.
  - Content grouped with `space-y-4`, clear sectioning for selector, input, error, and buttons.
- **Design Token Usage:**
  - Modal: `bg-white p-6 rounded-2xl shadow-lg` (matches style guide for modals).
  - Headings: `text-xl font-semibold text-gray-900` (tokens).
  - Labels: `text-sm font-medium text-gray-700` (matches label style).
  - Input: `border border-gray-200 rounded-md px-3 py-2 w-full` (matches input tokens).
  - Buttons: primary/secondary tokens, loading spinner uses correct classes.
  - Error: `text-sm text-red-600 mt-2` (matches error state tokens).
- **Hardcoded Classes/Colors:**
  - All classes match design tokens and style guide.
- **Accessibility:**
  - Modal uses `role="dialog"`, `aria-modal`, and `aria-labelledby`.
  - Focus trap is implemented.
  - Inputs and error messages have correct roles and `aria-live`.
  - Buttons are labeled and have visible focus; cancel disables on loading.
- **Status:**
  - ✅ Fully aligned with mockups and style guide. No changes needed.

---

### Core UI Components

#### `AssetRow/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Uses flex layout for row, with left (info), right (price/value), and action button sections.
  - Border and spacing per design system (`py-2 border-b border-gray-200`).
- **Design Token Usage:**
  - Symbol/name: `text-base font-medium text-gray-900` (matches tokens).
  - Quantity: `text-sm text-gray-600` (matches tokens).
  - Price/value: `text-sm text-gray-600`, `text-base font-semibold text-gray-900` (tokens).
  - Error: `text-sm text-red-600`, `text-base text-gray-400 italic` (gray-400 for fallback, which is less prominent than style guide recommends; consider `text-gray-500` for better contrast).
  - Button: `p-2 rounded-full hover:bg-gray-100 text-red-600` (matches icon button tokens).
- **Hardcoded Classes/Colors:**
  - All classes use tokens except for fallback gray-400 (minor, not critical).
- **Accessibility:**
  - Delete button has `aria-label` and `title` for screen readers/tooltips.
  - Row is not focusable, but all actions are accessible.
- **Status:**
  - 🟢 Mostly aligned. Consider `text-gray-500` for fallback text for improved contrast.

---

#### `AssetSelector.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Grouped with `space-y-2`, label and select/input fields clearly separated.
- **Design Token Usage:**
  - Select/input: `border border-gray-200 rounded-md px-3 py-2 w-full bg-white text-base` (matches tokens).
  - Label: `text-sm font-medium text-gray-700` (tokens).
  - Error: `text-sm text-red-600` (matches tokens).
- **Hardcoded Classes/Colors:**
  - All classes match tokens and style guide.
- **Accessibility:**
  - Select and input have labels and correct `id`/`htmlFor` linkage.
  - Error message uses `role="alert"`.
- **Status:**
  - ✅ Fully aligned with mockups and style guide. No changes needed.

---

#### `ErrorBanner.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:**
  - Banner uses `bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4 mx-auto max-w-4xl` (matches style guide for error banners).
- **Design Token Usage:**
  - All classes match error tokens from style guide.
  - Retry button: `underline text-blue-600 ml-2 hover:text-blue-800` (uses blue-600/800, which are approved for links/buttons).
- **Hardcoded Classes/Colors:**
  - All classes use tokens.
- **Accessibility:**
  - Banner uses `role="alert"` and `aria-live="assertive"` for screen reader announcement.
  - Retry button is a standard button, but does not have an explicit `aria-label` (could add for clarity, but label is descriptive).
- **Status:**
  - ✅ Fully aligned with mockups and style guide. No changes needed.

---
#### `InlineErrorBadge.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:** Inline span for error badge, used in context (e.g., asset row).
- **Design Token Usage:** `text-sm text-red-600 ml-2` (matches error badge tokens).
- **Hardcoded Classes/Colors:** None.
- **Accessibility:** No explicit role; relies on parent context. For inline errors, consider `role="alert"` if not already present in parent.
- **Status:** ✅ Fully aligned. No changes needed, but consider role if used outside already-labeled context.

---

#### `LoadingSpinner.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:** Flex-centered spinner with optional label, supports fullscreen and inline modes.
- **Design Token Usage:** Spinner: `animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full` (matches style guide for spinners). Label: `text-gray-600 text-sm mt-4` (matches tokens).
- **Hardcoded Classes/Colors:** None.
- **Accessibility:** No explicit `aria-label` on spinner div; label is visually present but not programmatically attached. Consider adding `aria-label` or `role="status"` for screen readers.
- **Status:** 🟢 Mostly aligned. Suggest adding `aria-label` or `role="status"` for accessibility.

---

#### `ExportImportControls/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:** Flex row for export/import buttons, right-aligned.
- **Design Token Usage:** Buttons: `bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200` (matches secondary button tokens).
- **Hardcoded Classes/Colors:** None.
- **Accessibility:** Each button has `aria-label` and clear icon/label.
- **Status:** ✅ Fully aligned. No changes needed.

---

#### `FilterSortControls/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:** Flex-wrap bar with grouped filter and sort controls, responsive with `sm:` classes.
- **Design Token Usage:**
  - Labels: `text-sm font-medium text-gray-700` (matches tokens).
  - Inputs: `px-3 py-2 border border-gray-200 rounded-md w-full sm:w-64 placeholder:text-gray-700` (matches tokens).
  - Dropdown: `px-3 py-2 border border-gray-200 rounded-md bg-white sm:w-48 w-full text-gray-900` (matches tokens).
- **Hardcoded Classes/Colors:** None.
- **Accessibility:** All controls have labels with correct `id`/`htmlFor` linkage. Placeholder text uses correct color.
- **Status:** ✅ Fully aligned. No changes needed.

---

#### `DeleteConfirmationModal/index.tsx`
**Audit Results (2025-06-14):**
- **Layout/Structure:** Modal overlay, centered card, clear heading and action group.
- **Design Token Usage:**
  - Modal: `bg-white p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4` (matches modal tokens).
  - Headings: `text-xl font-semibold text-gray-900` (matches tokens).
  - Paragraph: `text-sm text-gray-700` (matches tokens).
  - Buttons: primary (red) and secondary (gray) match style guide.
- **Hardcoded Classes/Colors:** None.
- **Accessibility:**
  - Modal uses `role="dialog"`, `aria-modal`, and `aria-labelledby`.
  - Buttons are labeled and have visible focus.
- **Status:** ✅ Fully aligned. No changes needed.

---

### Utility & Supporting Files

#### `hooks/useAddAssetForm.ts`
**Audit Results (2025-06-14):**
- **Purpose:** Custom React hook for Add Asset modal form logic (state, validation, submit, error handling).
- **Visual/Token/Accessibility:** No direct rendering; all UI/UX handled by consuming components. No Tailwind, tokens, or accessibility attributes present or needed.
- **Status:** ✅ No visual or token issues. Fully aligned.

---

#### `hooks/usePortfolioState.ts`
**Audit Results (2025-06-14):**
- **Purpose:** Manages portfolio state, asset CRUD, and total value calculation.
- **Visual/Token/Accessibility:** Pure logic; no rendering or styling. All UI/UX handled by consuming components.
- **Status:** ✅ No visual or token issues. Fully aligned.

---

#### `hooks/useUIState.ts`
**Audit Results (2025-06-14):**
- **Purpose:** UI state management for modal visibility, button refs, and asset deletion flow.
- **Visual/Token/Accessibility:** Pure logic; no rendering or styling. All UI/UX handled by consuming components.
- **Status:** ✅ No visual or token issues. Fully aligned.

---

_This list will be updated as additional components or files are discovered during the audit._
