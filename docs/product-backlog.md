## 📋 Product Backlog

This document outlines the prioritized list of user stories for the Crypto Portfolio Tracker application. It serves as the single source of truth for all planned features and enhancements, structured to deliver maximum user value while supporting an agile, iterative development approach.

The backlog is derived from the product vision and software development plan, focusing first on core functionality essential to the Minimum Viable Product (MVP). Each user story is written from the perspective of our target users, with clearly defined acceptance criteria to guide implementation and validation.

Stories are grouped by feature category and prioritized based on their importance to user experience, technical dependencies, and overall product goals. This backlog will evolve with ongoing feedback, development progress, and product insights.

---

## 🗂 Summary of Backlog Items

| ID    | Title                                                             | Priority | Feature Category           | Status    |
| ----- | ----------------------------------------------------------------- | -------- | -------------------------- | --------- |
| 1     | Add Crypto Asset with Quantity                                    | High     | Core Portfolio Management  | ✅ Done   |
| 2     | Delete Crypto Asset                                               | High     | Core Portfolio Management  | ✅ Done   |
| 3     | Calculate and Display Total Portfolio Value                       | High     | Core Portfolio Management  | ✅ Done   |
| 4     | Fetch Real-Time Prices via CoinGecko API                          | High     | Real-Time Data Integration | ✅ Done   |
| 5     | Real-Time Value Updates on Change                                 | High     | Real-Time Data Integration | ✅ Done   |
| 0     | Render Portfolio Overview Layout                                  | High     | UI and Usability           | ✅ Done   |
| 6     | Filter/Sort Assets by Name or Value                               | High     | UI and Usability           | ✅ Done   |
| 7     | Handle UI States (Loading, Error)                                 | Medium   | UI and Usability           | ✅ Done   |
| 8     | Intuitive Interface for Non-Technical Users                       | Medium   | UI and Usability           | ✅ Done   |
| UI-14 | Establish Branded Visual Identity Across App                      | Medium   | UI and Usability           | ✅ Done   |
| UI-15 | Align Component Styles with Updated UI Mockups                    | High     | UI and Usability           | ✅ Done   |
| UI-16 | Improve Header & Toolbar Layout                                   | Medium   | UI and Usability           | ✅ Done   |
| 9     | Persist Portfolio in Local Storage/Backend                        | High     | Extended Features          | ✅ Done   |
| 10    | Export Portfolio to CSV/JSON                                      | High     | Extended Features          | ✅ Done   |
| 11    | Import Portfolio from CSV/JSON                                    | High     | Extended Features          | ✅ Done   |
| 12    | Add Charting for Price History                                    | Low      | Extended Features          | ✅ Done   |
| 13    | Enable User Authentication                                        | Low      | Extended Features          | Pending   |
| 14    | Add Landing Page with Navigation to Portfolio                     | High     | UI and Usability           | ✅ Done   |
| 15    | Refactor Sprint 1 Code to Follow SOLID Principles                 | Medium   | Technical Debt             | Pending   |
| TD-02 | UI Visibility Refactor and Design Token Integration               | Medium   | Technical Debt             | ✅ Done   |
| TD-03 | Windsurf-Aided Review of UI/UX Design Docs                        | Medium   | Technical Debt             | ✅ Done   |
| TD-04 | Visual/UX Refactor of `ui-mockups.md` for Design System Alignment | Medium   | Technical Debt             | ✅ Done   |

---

## 🧾 User Story 14: Add Landing Page with Navigation to Portfolio

**User Story**  
_As a new user,_  
_I want to see an informative landing page when I first visit the site,_  
_so that I can understand what the application does before viewing the portfolio._

**Acceptance Criteria**  
- [x] A landing page is displayed at the root URL (`/`)
- [x] The landing page includes a clear call-to-action to view the portfolio
- [x] Navigation to `/portfolio` shows the portfolio view
- [x] The about page is accessible via `/about`
- [x] All internal links use React Router for SPA navigation
- [x] The header logo links back to the landing page
- [x] Responsive design works on all device sizes

**Technical Notes**
- Implemented with React Router v6
- Added responsive design using Tailwind CSS
- Maintained existing portfolio functionality at the new route

**Dependencies**  
- None

---

## 🧾 User Story TD-04

**User Story**
_As a developer/designer preparing for MVP delivery,_
_I want to visually and stylistically refactor `ui-mockups.md` to match the updated wireframes and style guide, without making any logical changes or altering the set of components/mockups,_
_so that the mockups serve as an accurate, implementation-ready reference for frontend development._

---

## 🧾 User Story TD-03: Align UI/UX Design Docs with Visibility Standards (Windsurf-Aided)

**User Story**
_As a developer preparing for MVP delivery,_
_I want Windsurf IDE to review our UI/UX documentation for visibility, consistency, and traceability,_
_so that the codebase can be aligned with the intended design language and product goals._

**Priority:** Medium
**Status:** ✅ Done
**Completed On:** 2025-08-24
**Feature Category:** Technical Debt
**Story ID:** `TD-03`

---

### ✅ Acceptance Criteria

- [x] Windsurf reviews the following documents:

  - `ui-wireframes.md`
  - `style-guide.md`
  - `ui-mockups.md`
  - `product-backlog.md` (focus on design-driven stories)

- [x] A list of visibility issues and improvement suggestions is generated.
- [x] Redundancies, inconsistencies, or unclear naming are flagged.
- [x] Designer artifacts are updated to reflect accepted suggestions (if needed).
- [x] Summary of improvements is added to `refactor-notes.md`.
- [x] The resulting guidance informs the follow-up code visibility audit (`TD-02`).

---

### 🔧 Implementation Tasks

| Task Type            | Description                                                                        | Status |
| -------------------- | ---------------------------------------------------------------------------------- | ------ |
| 🧠 **Doc Analysis**  | Prompt Windsurf to review UI/UX docs for visibility issues                         | DONE   |
| 📝 **Issue Catalog** | Summarize Windsurf’s findings in a markdown checklist                              | DONE   |
| ✍️ **Revise Docs**   | Apply accepted changes to `ui-wireframes.md`, `style-guide.md`, or `ui-mockups.md` | DONE   |
| 📄 **Sync Summary**  | Log findings to `refactor-notes.md` and close the loop to TD-02 planning           | DONE   |

---

## 🏁 TD-02 – UI Visibility Refactor and Design Token Integration (Windsurf-Informed)

**User Story**
_As a developer preparing for MVP,_
_I want to refactor the UI for improved visual hierarchy, accessibility, and layout consistency using design tokens,_
_so that the interface is clean, readable, and easy to adapt in the future._

**Priority:** Medium
**Feature Category:** Technical Debt
**Status:** ✅ Done
**Completed On:** 2025-06-28

---

### ✅ Acceptance Criteria

- [x] Layout and spacing match `ui-mockups.md`
- [x] Design tokens from `style-guide.md` used for:

  - Typography
  - Semantic colors (`primary`, `error`, etc.)
  - Border radius and spacing

- [x] Tailwind config extended with CSS variable tokens
- [x] `.bg-primary`, `.text-error`, etc. defined in `tokens.css`
- [x] All interactive elements have `aria-label`s and accessibility improvements
- [x] No logic changes introduced; visual only
- [x] All tests (unit, integration, E2E) pass unchanged

---

### 🔧 Implementation Summary

- Migrated from manual CSS to utility-first styling with semantic token wrappers
- Configured `tailwind.config.js` with variable-driven theme tokens
- Cleaned up layout, spacing, and element structure across:

  - `PortfolioPage`
  - `AssetRow`
  - `AddAssetModal`

- Validated implementation against `ui-mockups.md` and `style-guide.md`
- Verified accessibility, tooltips, and test ID integration

---

## Real-Time Data Integration

### 🧾 User Story 4: Fetch Real-Time Prices via CoinGecko API

**User Story**  
As a casual crypto investor,  
I want the app to fetch real-time cryptocurrency prices from a public API,  
so that I can view up-to-date valuations of my portfolio.

**Priority:** High

**Acceptance Criteria:**

- [ ] 2.1 Upon adding an asset, the app queries a public API (e.g., CoinGecko) for its current price.
- [ ] 2.2 Prices are displayed in the user's preferred fiat currency (default: USD).
- [ ] 2.3 Fetched prices are accurate and reflect current market data (within a reasonable delay).
- [ ] 2.4 If the API is unreachable or fails, a clear error message is shown.
- [ ] 2.5 The fetch operation must not block the UI.

**Notes:**

- Use CoinGecko’s public API.
- Support only top 100 coins initially for simplicity.

---

### 🧾 User Story 5: Real-Time Value Updates on Change

**User Story**  
As a crypto enthusiast,  
I want my total portfolio value to update immediately when I add/remove an asset or when prices change,  
so that I always see the real-time worth of my investments.

**Priority:** High

**Acceptance Criteria:**

- [ ] 3.1 When a new asset is added, the portfolio value updates automatically.
- [ ] 3.2 When an asset is removed, its value is subtracted immediately.
- [ ] 3.3 When real-time price data updates, the total portfolio value refreshes accordingly.
- [ ] 3.4 Updates occur without requiring a manual refresh or user action.
- [ ] 3.5 The UI reflects current values consistently across components.

**Notes:**

- Debounce or throttle background updates to avoid API rate limits.
- Useful for future expansion into auto-refresh intervals or WebSocket integration.

---

## UI and Usability

### 🧾 User Story 0: Render Portfolio Overview Layout - Done

**User Story**  
As a casual crypto investor,  
I want a clean, structured portfolio page with total value, asset list, and action buttons,  
so that I can view and manage my crypto holdings clearly.

**Priority:** High

**Acceptance Criteria:**

- [V] 0.1 The page includes a total portfolio value header.
- [V] 0.2 The layout includes space for asset list rows.
- [V] 0.3 Sort/filter controls are visible above the list.
- [V] 0.4 Add/Export/Import buttons are rendered at the bottom.
- [V] 0.5 All layout elements are styled and spaced per mockups.
- [V] 0.6 The layout is responsive on mobile and desktop.
- [V] 0.7 The “Add Asset” button opens the modal.

**Notes:**

- This layout is required for nearly all features to function.
- Can initially render with an empty portfolio.
- Based on mockups in `ui-mockups.md`, aligns with User Story 8.

### 🧾 User Story 6: Filter/Sort Assets by Name or Value - Done

**User Story**  
As a casual crypto investor,  
I want to filter or sort my portfolio assets by name or value,  
so that I can quickly find and evaluate specific holdings.

**Priority:** Medium

**Acceptance Criteria:**

- [x] 6.1 The user can sort the portfolio list alphabetically by asset name (A–Z, Z–A).
- [x] 6.2 The user can sort by asset value (high to low, low to high).
- [x] 6.3 Sorting options are accessible via a dropdown or toggle interface.
- [x] 6.4 The list updates immediately upon selection of a sort option.
- [x] 6.5 Filter field allows typing to narrow visible assets by name (partial match allowed).

**Notes:**

- Sorting can be done client-side via array methods.
- Filtering should debounce or throttle input to avoid unnecessary re-renders.

---

### 🧾 User Story 7: Handle UI States (Loading, Error) - Done

**User Story**  
As a new crypto enthusiast,  
I want to see clear indicators when data is loading or if an error occurs,  
so that I understand what's happening and avoid confusion.

**Priority:** Medium

**Acceptance Criteria:**

- [x] 7.1 When price data is being fetched, a visible loading spinner or indicator is shown.
- [x] 7.2 If the API call fails, a clear error message is displayed in the UI.
- [x] 7.3 The error message provides actionable info (e.g., “Try again later”).
- [x] 7.4 While loading, the “Add Asset” button is disabled or shows a spinner.
- [x] 7.5 The UI recovers gracefully after an error (e.g., retry fetch, manual refresh).

**Notes:**

- Match UI states with async state transitions (loading, success, error).
- Consider using `useReducer` or status flags for UI state management.

---

### 🧾 User Story 8: Intuitive Interface for Non-Technical Users

**User Story**  
As a casual or new crypto user,  
I want the interface to be clean and easy to use without needing technical knowledge,  
so that I can interact with the app confidently.

**Priority:** Medium

**Acceptance Criteria:**

- [x] 8.1 Form fields have clear labels and placeholder text (e.g., “Enter quantity”).
- [x] 8.2 Buttons use action-oriented language (e.g., “Add Asset”, “Clear”).
- [x] 8.3 Icons and labels are used to clarify function (e.g., trash can icon for delete).
- [x] 8.4 The layout is responsive and functional on mobile devices.
- [x] 8.5 Instructions or tooltips are available for any complex actions.

**Notes:**

- Aligns with product goal: “interface is understandable without prior crypto knowledge”.
- Apply Tailwind utility classes to enforce consistent spacing and clarity.

---

Here is the updated **`product-backlog.md`** entry to introduce the new branding user story:

---

### 🧾 User Story UI-14: Establish Branded Visual Identity Across App

**User Story**
_As a crypto portfolio user,
I want the app to reflect a unique, consistent visual brand,
so that I feel more confident, emotionally connected, and can distinguish it from generic tools._

---

#### 🎯 Goals

- Define and apply a cohesive brand identity across the UI
- Update visual assets, styles, and design tokens to reflect brand consistently
- Introduce branding in layout, components, and feedback states

---

#### ✅ Acceptance Criteria

- [x] UI header includes brand logo, name, and optional tagline
- [x] Primary and accent brand colors are applied across buttons, headings, and highlights
- [x] Component styles (modals, buttons, inputs, etc.) use updated brand design tokens
- [x] Branding is applied to empty states and error/loading banners
- [x] `style-guide.md` includes updated tokens, colors, and brand tone guidelines
- [x] `ui-wireframes.md` and `ui-mockups.md` reflect brand layout and visual updates
- [x] `tailwind.config.js` is extended with brand tokens and semantic utilities
- [x] Accessibility (WCAG AA) is preserved post-brand update

---

#### 📦 Related Artifacts

- `ui-wireframes.md` – Updated layout showing branded header/footer
- `ui-mockups.md` – Color-integrated mockups for header, buttons, states
- `style-guide.md` – Design tokens for `brand.primary`, `brand.accent`, `font.brand`
- `tailwind.config.js` – Theme extension with brand palette
- `tokens.css` – Optional class utilities (`.bg-brand-primary`, `.text-brand-accent`)
- New Components:

  - `BrandedHeader.tsx`
  - `EmptyState.tsx`
  - `Logo.tsx`

---

## 🧾 User Story UI-15: Align Component Styles with Updated UI Mockups

**User Story**
_As a frontend developer delivering the MVP,_
_I want to update existing components to use the new visual styles from the finalized UI mockups,_
_so that the application’s visual language reflects the intended brand identity and UX design._

---

### 🎯 Goals

- Refactor all visible components to match updated branding tokens, layout, and tone
- Replace legacy color tokens (`--color-primary`, `.btn`, `.input`) with semantic brand token utilities
- Ensure all styling matches `style-guide.md` and `ui-mockups.md` exactly

---

### ✅ Acceptance Criteria

| ID  | Description                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------- |
| AC1 | All shared components (e.g. `Button`, `Input`, `Card`) use `brand-primary`, `brand-accent`, `font-brand` where defined |
| AC2 | All page-level layout and header/footer sections match `ui-mockups.md` layout                                          |
| AC3 | Components no longer use hardcoded colors (`blue-600`, `text-gray-900`, etc.) or deprecated tokens (`--color-primary`) |
| AC4 | `index.css` or tokens layer reflects `.bg-brand-primary`, `.text-brand-accent`, `.font-brand` usage across components  |
| AC5 | Visual output matches `ui-mockups.md` Sections 1–7, with consistent spacing, radius, and icon tone                     |
| AC6 | All tests (unit, integration, E2E) continue to pass post-refactor                                                      |

---

### 🧩 Components to Refactor

| Component/File                   | Target Update Area                    |
| -------------------------------- | ------------------------------------- |
| `AddAssetModal.tsx`              | Buttons, inputs, modal layout         |
| `AssetRow.tsx`                   | Font, inline error style, delete icon |
| `PortfolioHeader.tsx`            | Logo, title, total value display      |
| `SortFilterBar.tsx`              | Input/select ring, layout, spacing    |
| `ExportImportControls.tsx`       | CTA buttons (`Export`, `Import`)      |
| `ErrorBanner.tsx`, `Spinner.tsx` | Branded tokens, tone, accessibility   |

---

### 📄 References

- `style-guide.md` Sections 1.1–1.5, 2.1–2.3, 3.x
- `ui-mockups.md` Sections 1–7
- `index.css` – for `.bg-brand-primary`, `.text-brand-accent`, `.font-brand`

---

### ⏳ Effort Estimate

| Task                                | Points    |
| ----------------------------------- | --------- |
| Refactor 6–8 atomic components      | 3 pts     |
| Refactor page-level header/footer   | 1 pt      |
| QA regression and visual validation | 1 pt      |
| Cleanup legacy tokens/classes       | 1 pt      |
| **Total**                           | **6 pts** |

---

### 🧩 Dependencies

- UI mockups and style guide must remain locked (no more design changes)
- Refactor should avoid logic changes or layout restructuring beyond style

---

### 🏁 Definition of Done

- Visual styles match mockups across all components
- No usage of hardcoded Tailwind color names in UI
- All brand token utilities applied consistently
- Tests remain green
- Design sign-off approved

## Extended Features

### 🧾 User Story 9: Persist Portfolio in Local Storage

**User Story**  
As a personal finance hobbyist,  
I want my portfolio to be saved between visits using local storage,  
so that I don’t lose my asset list every time I refresh the page.

**Priority:** High

**Acceptance Criteria:**

- [x] 9.1 The portfolio state (assets and quantities) is saved in browser local storage.
- [x] 9.2 On app load, previously saved portfolio data is loaded and displayed.
- [x] 9.3 Changes to the portfolio (add/remove asset, update quantity) trigger an automatic save.
- [x] 9.4 If no data exists in storage, the portfolio starts empty.
- [x] 9.5 Local storage usage is documented and does not include sensitive data.

**Implementation Summary:**

- Created a `localStorageService` utility to abstract read/write operations.
- Updated `usePortfolioState` to hydrate from localStorage after `coinMap` is ready and `isLoading` is false.
- Prevented premature overwrite using an internal `isHydrated` ref.
- Ensured saving is triggered by all state changes (including empty portfolio).
- Integrated new hook logic in `PortfolioPage` with `coinMap` and loading state.

**Tests:**

- ✅ Unit Tests: Serialization and hydration logic (mocked localStorage)
- ✅ Integration Tests: `PortfolioPage` loads saved data correctly
- ✅ E2E Tests: End-to-end behavior for add, delete, and reload scenarios

**Completed On:** 2025-07-19
**Status:** ✅ Done

Here are the **updated sections for `product-backlog.md`** reflecting the sprint grooming and selection of **User Story 10** for implementation:

---

### 🧾 User Story 10: Export Portfolio to CSV/JSON

**User Story**
_As a casual crypto investor,_
_I want to export my portfolio data in CSV or JSON format,_
_so that I can back it up or integrate it with my financial tools._

**Priority:** High
**Status:** ✅ Done
**Completed On:** 2025-08-24

---

#### ✅ Acceptance Criteria

- [x] 10.1 The user can choose between CSV and JSON formats for export.
- [x] 10.2 Clicking "Export" triggers a file download with current portfolio data.
- [x] 10.3 The file includes asset name, symbol, quantity, and current value.
- [x] 10.4 Exported files are named with a timestamp (e.g., `portfolio-2025-07-20.json`).
- [x] 10.5 The export functionality is accessible via a clearly labeled UI element.

---

#### 🔧 Implementation Notes

- Format selector (CSV/JSON) to be added to export UI (dropdown or toggle).
- Use Blob and `URL.createObjectURL()` to trigger file download.
- Filename to be generated using ISO date (`YYYY-MM-DD`) format.
- UI already stubbed in `ui-mockups.md` → Section 7.
- Style and UX to follow `style-guide.md` → Button styling, aria-labels, tone.
- Unit test: Validate CSV and JSON structure.
- E2E test: Trigger export via UI and validate download was invoked.

---

#### 📎 Related Docs

- `sprint-planning.md` – Task breakdown, effort estimate, and deliverables
- `ui-mockups.md` – Export button layout, aria-label, visual priority
- `style-guide.md` – Button styling (`bg-brand-primary`), file naming UX tone
- `e2e-guide.md` – New spec: `export-portfolio.spec.ts`

---

### 🧾 User Story 11: Import Portfolio from CSV/JSON

**User Story**  
As a personal finance hobbyist,  
I want to import my crypto holdings from a CSV or JSON file,  
so that I can quickly set up my portfolio without manual entry.

**Priority:** High  
**Status:** ✅ Done  
**Completed On:** 2025-08-24  
**Traceability:** See `docs/sprint-planning.md` (User Story 11) and `docs/sprint-progress-tracker.md` (2025-08-24).

**Acceptance Criteria:**

- [x] 11.1 The user can upload a `.csv` or `.json` file via an import button or drop zone.
- [x] 11.2 Valid files populate the portfolio with the imported data.
- [x] 11.3 Invalid formats or missing fields trigger a clear validation error message.
- [x] 11.4 The import function preserves existing portfolio items or offers a “replace” option.
- [x] 11.5 A preview of parsed data is shown before applying the import.

**Notes:**

- CSV format must include at least: asset, quantity.
- JSON structure must match export format.

---

### 🧾 User Story 12: Add Charting for Price History

**User Story**  
As a new crypto enthusiast,  
I want to view historical price trends for each asset in a chart,  
so that I can understand how my investments have changed over time.

**Priority:** Medium
**Status:** ✅ Done
**Completed On:** 2025-08-24

**Acceptance Criteria:**

- [x] 12.1 The user can select an asset to view a historical price chart.
- [x] 12.2 The chart displays price trends over selectable time ranges (e.g., 7D, 30D, 1Y).
- [x] 12.3 Price data is fetched from the CoinGecko API or mock API.
- [x] 12.4 The chart includes axes, tooltips, and labels for usability.
- [x] 12.5 In case of data fetch failure, the chart area shows an appropriate fallback message.

**Notes:**

- Use a lightweight charting library like Chart.js or Recharts.
- Initial version can default to 30-day view.

---

### 🧾 User Story 14: Refactor Sprint 1 Code to Follow SOLID Principles

**User Story**  
As a developer maintaining this portfolio app,  
I want the Sprint 1 code to follow SOLID design principles,  
so that the codebase is easier to extend, test, and reuse in future sprints.

**Priority:** Medium  
**Feature Category:** Technical Debt

**Acceptance Criteria:**

- [ ] 13.1 Each React component and custom hook has a single, well-defined responsibility (SRP).
- [ ] 13.2 Validation logic is decoupled and reusable across components (OCP).
- [ ] 13.3 UI components delegate business logic to separate modules or hooks (DIP).
- [ ] 13.4 No direct dependencies on API services from UI layers (DIP).
- [ ] 13.5 All logic modules are testable in isolation.
- [ ] 13.6 Existing unit, integration, and E2E tests pass after refactor.

**Notes:**

- Applies to files implemented in Sprint 1:
  - `AddAssetModal.tsx`
  - `usePortfolio.ts`
  - `validateAsset.ts`
  - `AssetSelector.tsx`
  - `useAssetList.ts`
- WindSurf analysis will be used to identify violations.
- Results of the refactor will inform standards for future components.
