## 📋 Product Backlog

This document outlines the prioritized list of user stories for the Crypto Portfolio Tracker application. It serves as the single source of truth for all planned features and enhancements, structured to deliver maximum user value while supporting an agile, iterative development approach.

The backlog is derived from the product vision and software development plan, focusing first on core functionality essential to the Minimum Viable Product (MVP). Each user story is written from the perspective of our target users, with clearly defined acceptance criteria to guide implementation and validation.

Stories are grouped by feature category and prioritized based on their importance to user experience, technical dependencies, and overall product goals. This backlog will evolve with ongoing feedback, development progress, and product insights.

---

## 🗂 Summary of Backlog Items

| ID  | Title                                             | Priority | Feature Category           | Status  |
| --- | ------------------------------------------------- | -------- | -------------------------- | ------- |
| 1   | Add Crypto Asset with Quantity                    | High     | Core Portfolio Management  | DONE    |
| 2   | Delete Crypto Asset                               | High     | Core Portfolio Management  | DONE    |
| 3   | Calculate and Display Total Portfolio Value       | High     | Core Portfolio Management  | DONE    |
| 4   | Fetch Real-Time Prices via CoinGecko API          | High     | Real-Time Data Integration | DONE    |
| 5   | Real-Time Value Updates on Change                 | High     | Real-Time Data Integration | DONE    |
| 0   | Render Portfolio Overview Layout                  | High     | UI and Usability           | DONE    |
| 6   | Filter/Sort Assets by Name or Value               | Medium   | UI and Usability           | Pending |
| 7   | Handle UI States (Loading, Error)                 | Medium   | UI and Usability           | Pending |
| 8   | Intuitive Interface for Non-Technical Users       | Medium   | UI and Usability           | Pending |
| 9   | Persist Portfolio in Local Storage/Backend        | Low      | Extended Features          | Pending |
| 10  | Export/Import Portfolio Data (CSV/JSON)           | Medium   | Extended Features          | Pending |
| 11  | Add Charting for Price History                    | Low      | Extended Features          | Pending |
| 12  | Enable User Authentication                        | Low      | Extended Features          | Pending |
| 13  | Refactor Sprint 1 Code to Follow SOLID Principles | Medium   | Technical Debt             | Pending |
| TD-02 | Windsurf Visibility Audit and Enhancement         | Medium   | Technical Debt             | Pending |
| TD-03  | Windsurf-Aided Review of UI/UX Design Docs         | Medium   | Technical Debt             | Pending |
| TD-04  | Visual/UX Refactor of `ui-mockups.md` for Design System Alignment         | Medium   | Technical Debt             | DONE |
---

Perfect. Here's your new technical debt user story for design doc alignment via Windsurf:

---

## 🧾 User Story TD-04
**User Story**
*As a developer/designer preparing for MVP delivery,*
*I want to visually and stylistically refactor `ui-mockups.md` to match the updated wireframes and style guide, without making any logical changes or altering the set of components/mockups,*
*so that the mockups serve as an accurate, implementation-ready reference for frontend development.*


---

## 🧾 User Story TD-03: Align UI/UX Design Docs with Visibility Standards (Windsurf-Aided)

**User Story**
*As a developer preparing for MVP delivery,*
*I want Windsurf IDE to review our UI/UX documentation for visibility, consistency, and traceability,*
*so that the codebase can be aligned with the intended design language and product goals.*

**Priority:** Medium
**Feature Category:** Technical Debt
**Story ID:** `TD-03`

---

### ✅ Acceptance Criteria

* [ ] Windsurf reviews the following documents:

  * `ui-wireframes.md`
  * `style-guide.md`
  * `ui-mockups.md`
  * `product-backlog.md` (focus on design-driven stories)
* [ ] A list of visibility issues and improvement suggestions is generated.
* [ ] Redundancies, inconsistencies, or unclear naming are flagged.
* [ ] Designer artifacts are updated to reflect accepted suggestions (if needed).
* [ ] Summary of improvements is added to `refactor-notes.md`.
* [ ] The resulting guidance informs the follow-up code visibility audit (`TD-02`).

---

### 🔧 Implementation Tasks

| Task Type            | Description                                                                        | Status    |
| -------------------- | ---------------------------------------------------------------------------------- | --------- |
| 🧠 **Doc Analysis**  | Prompt Windsurf to review UI/UX docs for visibility issues                         | ⬜ Pending |
| 📝 **Issue Catalog** | Summarize Windsurf’s findings in a markdown checklist                              | ⬜ Pending |
| ✍️ **Revise Docs**   | Apply accepted changes to `ui-wireframes.md`, `style-guide.md`, or `ui-mockups.md` | ⬜ Pending |
| 📄 **Sync Summary**  | Log findings to `refactor-notes.md` and close the loop to TD-02 planning           | ⬜ Pending |

---


### 🧾 User Story TD-02: Windsurf Visibility Audit and Enhancement

**User Story**
*As a developer preparing for MVP,*
I want to use Windsurf IDE to identify and improve code visibility,
so that I can ensure our architecture is readable, maintainable, and easy to extend.

**Priority:** Medium
**Feature Category:** Technical Debt
**Story ID:** TD-02

**Acceptance Criteria:**

* [ ] Windsurf is used to analyze critical files and generate improvement suggestions.
* [ ] Suggestions are prioritized and implemented one at a time.
* [ ] Existing unit, integration, and E2E tests all pass after changes.
* [ ] No regressions or functional changes occur.
* [ ] A changelog file (`refactor-notes.md`) documents the visibility upgrades.

**Notes:**

* Covers improvements like naming clarity, component/hook modularity, and internal doc comments.
* Includes UI and hook layers (e.g., `PortfolioPage.tsx`, `usePortfolio`, `context`, etc).
* Builds on the SOLID refactor from TD-01, focusing on **comprehension** rather than responsibility split.

---


### 🧾 User Story 1: Add Crypto Asset with Quantity

**User Story**  
As a casual crypto investor,  
I want to manually add a cryptocurrency with a quantity,  
so that I can track how much of each asset I own in my portfolio.

**Priority:** High

**Acceptance Criteria:**

- [x] 1.1 The user can enter a cryptocurrency name or symbol (e.g., BTC, ETH).
- [x] 1.2 The user can input a numeric quantity (e.g., 0.5 BTC).
- [x] 1.3 The asset and quantity are added to the portfolio list upon confirmation (e.g., pressing “Add”).
- [x] 1.4 Invalid or empty inputs are rejected with an appropriate error message.
- [x] 1.5 The input fields reset after a successful addition.
- [x] 1.6 The newly added asset appears in the portfolio with its quantity and name.

**Notes:**

- No authentication required.
- Price value will be fetched later (see real-time batch).
- UI should be intuitive (e.g., dropdown or autocomplete for asset selection).

### 🧾 User Story 2: Delete Crypto Asset

**User Story**  
As a personal finance hobbyist,  
I want to remove an asset from my portfolio,  
so that I can keep my holdings list accurate and up-to-date.

**Priority:** High

**Acceptance Criteria:**

- [x] 2.1 Each asset listed in the portfolio has a visible delete/remove button.
- [x] 2.2 Clicking the delete button removes the asset and its data from the portfolio.
- [x] 2.3 A confirmation prompt appears before deletion (to avoid accidental removal).
- [x] 2.4 Once deleted, the asset is no longer visible in the list or included in calculations.
- [x] 2.5 Deletion works correctly for all supported assets without breaking the UI.

**Notes:**

- This complements the "Add Asset" story for basic CRUD operations.
- No backend or authentication involved.
- Can be implemented via simple state management (e.g., array filtering).

### 🧾 User Story 3: Calculate and Display Total Portfolio Value

**User Story**  
As a new crypto enthusiast,  
I want to see the total value of my holdings calculated in real-time,  
so that I can understand how much my portfolio is worth overall.

**Priority:** High

**Acceptance Criteria:**

- [x] 2.1 The application multiplies each asset’s quantity by its current market price.
- [x] 2.2 The portfolio total value is displayed prominently on the interface.
- [x] 2.3 The total value updates automatically when a new asset is added or an existing one is removed.
- [x] 2.4 The value updates whenever the fetched market prices change.
- [x] 2.5 In case of price fetch failure, the total value should be omitted or show a fallback state.

**Notes:**

- Depends on successful price fetching (see Real-Time Data Integration stories).
- Total should reflect real-time data accuracy.
- This is a key user need stated in the vision for quick, reliable insight.

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

### 🧾 User Story 6: Filter/Sort Assets by Name or Value

**User Story**  
As a casual crypto investor,  
I want to filter or sort my portfolio assets by name or value,  
so that I can quickly find and evaluate specific holdings.

**Priority:** Medium

**Acceptance Criteria:**

- [ ] 6.1 The user can sort the portfolio list alphabetically by asset name (A–Z, Z–A).
- [ ] 6.2 The user can sort by asset value (high to low, low to high).
- [ ] 6.3 Sorting options are accessible via a dropdown or toggle interface.
- [ ] 6.4 The list updates immediately upon selection of a sort option.
- [ ] 6.5 Filter field allows typing to narrow visible assets by name (partial match allowed).

**Notes:**

- Sorting can be done client-side via array methods.
- Filtering should debounce or throttle input to avoid unnecessary re-renders.

---

### 🧾 User Story 7: Handle UI States (Loading, Error)

**User Story**  
As a new crypto enthusiast,  
I want to see clear indicators when data is loading or if an error occurs,  
so that I understand what's happening and avoid confusion.

**Priority:** Medium

**Acceptance Criteria:**

- [ ] 7.1 When price data is being fetched, a visible loading spinner or indicator is shown.
- [ ] 7.2 If the API call fails, a clear error message is displayed in the UI.
- [ ] 7.3 The error message provides actionable info (e.g., “Try again later”).
- [ ] 7.4 While loading, the “Add Asset” button is disabled or shows a spinner.
- [ ] 7.5 The UI recovers gracefully after an error (e.g., retry fetch, manual refresh).

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

- [ ] 8.1 Form fields have clear labels and placeholder text (e.g., “Enter quantity”).
- [ ] 8.2 Buttons use action-oriented language (e.g., “Add Asset”, “Clear”).
- [ ] 8.3 Icons and labels are used to clarify function (e.g., trash can icon for delete).
- [ ] 8.4 The layout is responsive and functional on mobile devices.
- [ ] 8.5 Instructions or tooltips are available for any complex actions.

**Notes:**

- Aligns with product goal: “interface is understandable without prior crypto knowledge”.
- Apply Tailwind utility classes to enforce consistent spacing and clarity.

---

## Extended Features

### 🧾 User Story 9: Persist Portfolio in Local Storage

**User Story**  
As a personal finance hobbyist,  
I want my portfolio to be saved between visits using local storage,  
so that I don’t lose my asset list every time I refresh the page.

**Priority:** High

**Acceptance Criteria:**

- [ ] 9.1 The portfolio state (assets and quantities) is saved in browser local storage.
- [ ] 9.2 On app load, previously saved portfolio data is loaded and displayed.
- [ ] 9.3 Changes to the portfolio (add/remove asset, update quantity) trigger an automatic save.
- [ ] 9.4 If no data exists in storage, the portfolio starts empty.
- [ ] 9.5 Local storage usage is documented and does not include sensitive data.

**Notes:**

- No backend or authentication required.
- Use a key like `cryptoPortfolio` in localStorage.

---

### 🧾 User Story 10: Export Portfolio to CSV/JSON

**User Story**  
As a casual crypto investor,  
I want to export my portfolio data in CSV or JSON format,  
so that I can back it up or integrate it with my financial tools.

**Priority:** High

**Acceptance Criteria:**

- [ ] 10.1 The user can choose between CSV and JSON formats for export.
- [ ] 10.2 Clicking "Export" triggers a file download with current portfolio data.
- [ ] 10.3 The file includes asset name, symbol, quantity, and current value.
- [ ] 10.4 Exported files are named with a timestamp (e.g., `portfolio-2025-05-16.json`).
- [ ] 10.5 The export functionality is accessible via a clearly labeled UI element.

**Notes:**

- Ensure exported data matches current in-app state.
- Use browser download API or create blob.

---

### 🧾 User Story 11: Import Portfolio from CSV/JSON

**User Story**  
As a personal finance hobbyist,  
I want to import my crypto holdings from a CSV or JSON file,  
so that I can quickly set up my portfolio without manual entry.

**Priority:** High

**Acceptance Criteria:**

- [ ] 11.1 The user can upload a `.csv` or `.json` file via an import button or drop zone.
- [ ] 11.2 Valid files populate the portfolio with the imported data.
- [ ] 11.3 Invalid formats or missing fields trigger a clear validation error message.
- [ ] 11.4 The import function preserves existing portfolio items or offers a “replace” option.
- [ ] 11.5 A preview of parsed data is shown before applying the import.

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

**Acceptance Criteria:**

- [ ] 12.1 The user can select an asset to view a historical price chart.
- [ ] 12.2 The chart displays price trends over selectable time ranges (e.g., 7D, 30D, 1Y).
- [ ] 12.3 Price data is fetched from the CoinGecko API or mock API.
- [ ] 12.4 The chart includes axes, tooltips, and labels for usability.
- [ ] 12.5 In case of data fetch failure, the chart area shows an appropriate fallback message.

**Notes:**

- Use a lightweight charting library like Chart.js or Recharts.
- Initial version can default to 30-day view.

---

### 🧾 User Story 13: Refactor Sprint 1 Code to Follow SOLID Principles

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
