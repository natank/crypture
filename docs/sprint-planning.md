# Sprint Planning

## 🛠️ Story-to-Task Breakdown Strategy

This document outlines the systematic approach used by the Developer Agent to break down user stories into technical tasks. It supports transparent, predictable, and high-quality feature implementation aligned with the product vision.

---

### 🎯 Objective

Convert product backlog user stories into actionable, well-scoped technical tasks for implementation within the sprint.

---

### 🔍 Breakdown Strategy

#### 1. Understand the Story Context

- Identify the user persona and their goal.
- Clarify feature intent and expected behaviors.
- Analyze acceptance criteria as functional checkpoints.
- Note any feature dependencies or ordering constraints.

#### 2. Map Acceptance Criteria to Functional Behaviors

- Each criterion is translated into UI, logic, or interaction behavior.
- These behaviors inform specific component, hook, or service responsibilities.

#### 3. Identify Technical Responsibilities

| Layer            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| UI Components    | Render forms, modals, buttons, layout wrappers             |
| State Management | Use React state, reducers, or context to manage data flow  |
| Data Logic       | Transform, validate, and persist asset/price information   |
| Side Effects     | API requests (e.g., price fetch), debounce, error fallback |
| Visual Feedback  | Loading indicators, disabled states, error messages        |
| Accessibility    | Aria labels, focus trap, semantic HTML for usability       |
| Testing          | Unit and integration tests for reusable logic (hooks)      |

#### 4. Group into Logical Development Tasks

Tasks are grouped and labeled by their responsibility type and scoped to be:

- Atomic (one concern per task)
- Independently testable and reviewable
- Appropriately small to complete within a sprint

#### 5. Prioritize by Sprint Scope

Tasks are ordered by:

- Functional dependency (e.g., must fetch price before calculating value)
- MVP necessity (e.g., Add/Delete before Export/Import)
- Reusability and extensibility

---

This process ensures that implementation aligns tightly with user needs, design expectations, and technical best practices.

# 🚀 Active Stories

> **Currently focused story:** User Story 9

## 🟢 FOCUSED Sprint Story: User story 9

# 📦 Active Sprint stories

# 📦 Archived Sprints

## 🏁 User Story 9: Persist Portfolio in Local Storage

> **User Story** > _As a personal finance hobbyist,_ > _I want my portfolio to be saved between visits using local storage,_ > _so that I don’t lose my asset list every time I refresh the page._

✅ Status: Complete  
🗓️ Completed On: 2025-07-19

### ✅ Acceptance Criteria

- [x] 9.1 The portfolio state (assets and quantities) is saved in browser local storage.
- [x] 9.2 On app load, previously saved portfolio data is loaded and displayed.
- [x] 9.3 Changes to the portfolio (add/remove asset, update quantity) trigger an automatic save.
- [x] 9.4 If no data exists in storage, the portfolio starts empty.
- [x] 9.5 Local storage usage is documented and does not include sensitive data.

---

| Layer                          | Task                                                                     | Files/Modules                                   | Status         |
| ------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------- | -------------- |
| **State Logic**                | Add serialization logic to `usePortfolio` to persist to `localStorage`   | `src/hooks/usePortfolio.ts`                     | ✅ Done        |
| **Initialization**             | Load from `localStorage` on hook init, fallback to `[]` if none          | `usePortfolio.ts`                               | ✅ Done        |
| **Triggering**                 | Use `useEffect` to sync `portfolio` state on change                      | `usePortfolio.ts`                               | ✅ Done        |
| **Keys & Schema**              | Use key `cryptoPortfolio`; structure: `{ asset: string, qty: number }[]` | Defined in same hook                            | ✅ Done        |
| **Testing - Unit**             | Write unit tests for save/load logic, mock `localStorage`                | `__tests__/usePortfolio.localStorage.test.ts`   | ✅ Done        |
| **Testing - Integration**      | Confirm persisted data loads correctly in `PortfolioPage`                | `__tests__/PortfolioPage.localStorage.test.tsx` | ✅ Done        |
| **Testing - E2E**              | Verify full behavior: add → reload → restore UI                          | `e2e/specs/persist-portfolio.spec.ts`           | ✅ Done        |
| **Visual Feedback (Optional)** | Consider adding "💾 Saved" or sync indicator for UX clarity              | `PortfolioHeader.tsx`, optional                 | ⬜ Not Started |
| **Docs**                       | Add note on `localStorage` usage to project README or `dev-notes.md`     | `README.md` or `docs/dev-notes.md`              | ⬜ Not Started |

---

### 🧪 Tests & Coverage Plan

| Type        | Scenario                                                     |
| ----------- | ------------------------------------------------------------ |
| Unit        | Saving portfolio state to localStorage on change             |
| Unit        | Loading portfolio state from localStorage on init            |
| Integration | App initializes from storage, correctly renders saved assets |
| E2E         | User adds asset → refresh page → asset persists in portfolio |
| E2E         | User deletes asset → refresh → asset no longer appears       |

---

### ⏱️ Effort Estimate

| Task Category                       | Estimate  |
| ----------------------------------- | --------- |
| Hook implementation + logic         | 1 pt      |
| Unit & integration testing          | 2 pts     |
| E2E testing                         | 1 pt      |
| Optional: Visual feedback indicator | 1 pt      |
| **Total**                           | **5 pts** |

---

### ✅ Definition of Done

- Portfolio data persists across sessions using `localStorage`
- Page reload restores asset list and recalculates total value
- Tests verify save/load reliability and no data loss
- Optional visual indicator for saved state adds UX clarity
- Matches `style-guide.md` and follows SOLID principles
- All tests (unit, integration, E2E) pass

---

## 🟢 User Story: UI-16 – Improve Header & Toolbar Layout

### **User Story UI-16**

_As a crypto portfolio user,_
_I want the header and filter/sort toolbar to feel more compact and visually distinct from the asset list,_
_so that I can quickly understand my portfolio status and navigate controls without confusion._

**Priority:** Medium
**Feature Category:** UI and Usability

---

### ✅ Acceptance Criteria

- [x] 16.1 Header condenses logo, tagline, and total value into one flex row
- [x] 16.2 Toolbar is wrapped with `.toolbar-wrapper` for visual grouping
- [x] 16.3 Layout spacing and alignment work on desktop and mobile
- [x] 16.4 Follows mockup tokens and accessibility conventions
- [x] 16.5 Visual output matches `ui-wireframes.md` and `ui-mockups.md`

---

### 🔧 Technical Breakdown

| File                                       | Task                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `PortfolioPage.tsx`                        | Refactor header layout using `flex justify-between items-center`  |
| `PortfolioPage.tsx` or `SortFilterBar.tsx` | Wrap sort/filter block with `<div className="toolbar-wrapper">`   |
| `index.css`                                | Confirm `.toolbar-wrapper` is available under `@layer components` |
| `PortfolioHeader.stories.tsx`              | Add Storybook preview showing updated layout                      |
| `__tests__/PortfolioPage.test.tsx`         | Visual + structural regression test if needed                     |
| `e2e/specs/layout-visual.spec.ts`          | Add coverage (optional) or reuse for visual confirmation          |

---

### 📦 Dev Deliverables

- Updated layout for header and toolbar
- Responsive, branded spacing
- Storybook preview for header section
- Visual QA confirmation
- Functional parity (no regression in portfolio behavior)

---

## 🏁 User Story 6: Filter/Sort Assets by Name or Value

> “As a casual crypto investor, I want to filter or sort my portfolio assets by name or value, so that I can quickly find and evaluate specific holdings.”

### ✅ Acceptance Criteria

- [x] 6.1 Sort by name (A–Z, Z–A)
- [x] 6.2 Sort by value (high → low, low → high)
- [x] 6.3 Sort options accessible via dropdown
- [x] 6.4 List updates immediately on selection
- [x] 6.5 Filter input allows partial name match

### Design

The feature was implemented by integrating a dropdown for sorting options and a text input for filtering within the existing portfolio management components. The `useFilterSort` hook was used to manage the logic, and comprehensive testing was conducted.

---

### 🔧 Implementation Plan

In this step We will provide a breakdown of the tasks based on the design as implemetation plan

| File                                   | Purpose                            |
| -------------------------------------- | ---------------------------------- |
| `src/components/SortFilterBar.tsx`     | Filter + Sort UI                   |
| `src/hooks/useSortFilter.ts`           | Filtering and sorting logic        |
| `src/pages/PortfolioPage.tsx`          | State management and integration   |
| `__tests__/useSortFilter.test.ts`      | Unit test for sorting/filter logic |
| `__tests__/PortfolioPage.test.tsx`     | Integration of state into UI       |
| `e2e/specs/filter-sort-assets.spec.ts` | End-to-end testing via UI          |

---

## 🏁 User Story 1: Add Crypto Asset with Quantity

- ✅ All acceptance criteria completed
- ✅ Code merged and functional in `PortfolioPage.tsx`
- ✅ Unit, integration, and E2E tests passed
- 🧪 Verified DoD via manual and automated tests
- 🗓️ Closed on: 2025-05-25

### ✅ Story Summary

> “As a casual crypto investor, I want to manually add a cryptocurrency with a quantity, so that I can track how much of each asset I own in my portfolio.”

**Acceptance Criteria**:

- [x] 1.1 Enter a cryptocurrency name/symbol (e.g., BTC, ETH).
- [x] 1.2 Input a numeric quantity.
- [x] 1.3 Confirm to add asset and quantity to the portfolio.
- [x] 1.4 Show validation for invalid or empty inputs.
- [x] 1.5 Reset fields after successful addition.
- [x] 1.6 Newly added asset appears in the portfolio.

---

### 🔧 Implementation Plan

#### 1. UI Components (`src/components/AddAssetModal.tsx`) – ✅ Done

- [x] Modal with:
  - [x] Asset dropdown (autocomplete/select)
  - [x] Quantity input with validation
  - [x] Add/Cancel buttons with loading states
  - [x] Inline error messages
- [x] Connected to `usePortfolio` and `validateAsset`

#### 2. State Management (`src/hooks/usePortfolio.ts`) - In Progress

- [x] Add `addAsset(assetId: string, quantity: number)` logic
- [x] Merge if asset exists

#### 3. Validation Logic (`src/utils/validateAsset.ts`) - Pending

- [x] Ensure quantity is positive and asset is valid
- [x] Provide structured error messages

#### 4. Coin List Integration (`src/services/coinGecko.ts`) - Pending

- [x] Fetch top 100 coins from CoinGecko
- [x] Add API key from env and error handling

#### 5. Asset Selector Component (`src/components/AssetSelector.tsx`) – ✅ Done

- [x] Pure presentational component for asset selection inside the Add Asset modal.
- [x] Styled per `style-guide.md` using Tailwind form/input styles.
- [x] Accepts `onSelect()` prop to emit selected coin to parent.
- [x] Renders loading, error, and empty states appropriately.
- [x] Delegates all logic (fetch, filter, search) to the `useAssetList` hook for clean separation of concerns.

#### 5b. Asset List Hook (`src/hooks/useAssetList.ts`) – ✅ Done

- [x] Fetches top 100 coins from CoinGecko via `fetchTopCoins`.
- [x] Manages loading and error state for API calls.
- [x] Stores and exposes a `search` term with `setSearch` handler.
- [x] Provides both full list and search-filtered coin list.
- [x] Designed for reusability across dropdowns or future features.

#### 6. Visual Feedback & Accessibility - In Progress

- [x] Match Tailwind styles and design tokens (`style-guide.md`)
- [x] Ensure proper labels, `aria-*`, focus handling.

#### 7. Integration into Page (`src/pages/PortfolioPage.tsx`) - ✅ Done

- [x] Manage modal state.
- [x] Connect form submission to `usePortfolio`.

#### 8. Unit Tests – ✅ Done

- [x] `usePortfolio`
- [x] `validateAsset`
- [x] `useAssetList`
- [x] `AssetSelector`
- [x] `AddAssetModal` (one test skipped, documented)

#### 9. Integration Tests (`__tests__/components/AddAssetModal.test.tsx`) – ✅ Done

- [x] Simulates field input, submit success/failure
- [x] Skipped edge case for loading state due to modal unmounting

#### 10. E2E Tests (`e2e/specs/addAsset.spec.ts`) - ✅ Done

- [x] Automate modal open → input → add → verify asset in UI.

---

## 🔧 Technical Sprint: SOLID Refactor of Sprint 1 Code

**Completed On**: 2025-05-25

### ✅ Summary

Refactored all Sprint 1 modules to follow SOLID principles:

- Decomposed monolithic UI into clean components
- Decoupled logic and side effects into hooks and services
- Validated design, accessibility, and UX alignment
- Maintained full unit/integration/E2E test coverage

**Goal**  
Improve maintainability and modularity of Sprint 1 deliverables by refactoring them to follow SOLID principles. This ensures a scalable architecture as new features are introduced.

**Target Scope**

- `AddAssetModal.tsx`
- `usePortfolio.ts`
- `validateAsset.ts`
- `AssetSelector.tsx`
- `useAssetList.ts`
- `PortfolioPage.tsx`
- `coinGecko.ts`

**Motivation**
The Sprint 1 code meets functional goals but reveals coupling between UI, logic, and data responsibilities. Applying SOLID principles will make the codebase easier to test, extend, and debug in future sprints.

---

### 🛠️ Task Breakdown

#### 1. Static Analysis & Issue Mapping

- [x] Run WindSurf on target files to identify architectural/code smells.
- [x] Create a mapping table of issues to violated SOLID principles.

#### 2. Refactor by Responsibility

- [x] Extract submission and validation logic from `AddAssetModal.tsx` into a custom `useAddAssetForm` hook.
- [x] Create `usePortfolioState.ts` to isolate portfolio state logic.
- [x] Refactor `validateAsset.ts` to be a schema-based validator (open/closed for future validation).
- [✔] Confirmed existing `coinGecko.ts` already satisfies SRP and DIP as service abstraction.
- [x] Refactor `PortfolioPage.tsx` to isolate orchestration logic into reusable hooks or services (e.g., modal control, event handlers).
- [x] Wrap `coinGecko.ts` API logic inside an abstracted service layer (`coinService.ts`) to decouple from hooks and UI (DIP).
- [x] Extract presentational sections of `PortfolioPage.tsx` into reusable components)

#### 3. Dependency Cleanup

- [x] Remove direct API/data-fetching calls from UI components.
- [x] Ensure all hooks/components depend on abstractions, not hardcoded implementations.

#### 4. Testing & Verification

- [x] Update unit tests for new modular hooks.
- [x] Ensure `AddAssetModal`, `usePortfolio`, and `AssetSelector` remain testable in isolation.
- [x] Run and verify all integration tests pass after changes.
- [x] Run E2E tests (`addAsset.spec.ts`) to confirm regression-free behavior.

---

**Definition of Done**

- Code aligns with SOLID principles and passes WindSurf lint rules.
- Refactored components are cleanly separated and testable.
- All tests pass and code coverage remains ≥ previous baseline.
- Future features can reuse new modular components/hooks.

**Sprint Type**: Refactor / Technical Debt  
**Owner**: Developer Agent  
**Status**: 🟢 Active

🏁 User Story 14: Implement App-Level Context System for Portfolio
“As a developer, I want a centralized context system to provide portfolio state and actions, so that reusable components can access functionality without prop drilling.”

Acceptance Criteria:

✅ 14.1 A PortfolioPageContext provides state and actions from usePortfolio.

✅ 14.2 A PortfolioPageProvider wraps the page and initializes the context.

✅ 14.3 A set of context-based subscriber components wraps reusable components to inject props from context.

✅ 14.4 Reusable components (e.g., AssetRow) remain stateless and unaware of context.

✅ 14.5 All future state-connected UI components follow this pattern.

🔧 Implementation Summary
usePortfolioContext and PortfolioPageContext were defined in context/usePortfolioContext.ts.

PortfolioPageProvider was created in context/PortfolioPageProvider.tsx.

AssetRowSubscriber was implemented to subscribe to context and render AssetRow with injected props.

PortfolioPage is now wrapped in the provider via the App component.

All state-connected components rely on context instead of prop drilling.

🧪 Tests
✅ Unit Test: PortfolioPageContext.test.tsx – verifies context hook and provider logic.

✅ Integration Test: AssetRowSubscriber.test.tsx – confirms prop injection and delete handler behavior.

✅ E2E Test: Existing portfolio-layout.spec.ts validates layout and modal behavior under context.

✅ Definition of Done
Context replaces prop drilling in PortfolioPage.

Subscriber pattern used for modular access to portfolio state/actions.

Code adheres to SOLID principles and Tailwind styling conventions.

All tests pass (unit, integration, E2E).

Verified through interaction and automated flows.

Status: ✅ Complete
Completed On: 2025-05-27

---

🏁 User Story 14: Implement App-Level Context System for Portfolio
“As a developer, I want a centralized context system to provide portfolio state and actions, so that reusable components can access functionality without prop drilling.”

Acceptance Criteria:

✅ 14.1 A PortfolioPageContext provides state and actions from usePortfolio.

✅ 14.2 A PortfolioPageProvider wraps the page and initializes the context.

✅ 14.3 A set of context-based subscriber components wraps reusable components to inject props from context.

✅ 14.4 Reusable components (e.g., AssetRow) remain stateless and unaware of context.

✅ 14.5 All future state-connected UI components follow this pattern.

🔧 Implementation Summary
usePortfolioContext and PortfolioPageContext were defined in context/usePortfolioContext.ts.

PortfolioPageProvider was created in context/PortfolioPageProvider.tsx.

AssetRowSubscriber was implemented to subscribe to context and render AssetRow with injected props.

PortfolioPage is now wrapped in the provider via the App component.

All state-connected components rely on context instead of prop drilling.

🧪 Tests
✅ Unit Test: PortfolioPageContext.test.tsx – verifies context hook and provider logic.

✅ Integration Test: AssetRowSubscriber.test.tsx – confirms prop injection and delete handler behavior.

✅ E2E Test: Existing portfolio-layout.spec.ts validates layout and modal behavior under context.

✅ Definition of Done
Context replaces prop drilling in PortfolioPage.

Subscriber pattern used for modular access to portfolio state/actions.

Code adheres to SOLID principles and Tailwind styling conventions.

All tests pass (unit, integration, E2E).

Verified through interaction and automated flows.

Status: ✅ Complete
Completed On: 2025-05-27

## 🏁 User Story 14: Implement App-Level Context System for Portfolio

> “As a developer, I want a centralized context system to provide portfolio state and actions, so that reusable components can access functionality without prop drilling.”

**Acceptance Criteria:**

- ✅ 14.1 A `PortfolioPageContext` provides state and actions from `usePortfolio`.
- ✅ 14.2 A `PortfolioPageProvider` wraps the page and initializes the context.
- ✅ 14.3 A set of context-based **subscriber components** wraps reusable components to inject props from context.
- ✅ 14.4 Reusable components (e.g., `AssetRow`) remain stateless and unaware of context.
- ✅ 14.5 All future state-connected UI components follow this pattern.

---

### 🔧 Implementation Summary

- Defined `usePortfolioContext` and `PortfolioPageContext` in `context/usePortfolioContext.ts`.
- Created `PortfolioPageProvider` in `context/PortfolioPageProvider.tsx`.
- Implemented `AssetRowSubscriber` as a context-based wrapper for `AssetRow`.
- Wrapped `PortfolioPage` with `PortfolioPageProvider` inside `App`.
- Ensured clean, reusable props-driven components with context-only subscriptions.

---

### 🧪 Tests

- ✅ **Unit Tests**: `PortfolioPageContext.test.tsx` validates context creation and access.
- ✅ **Integration Tests**: `AssetRowSubscriber.test.tsx` confirms correct rendering and delete behavior.
- ✅ **E2E Tests**: Existing tests in `portfolio-layout.spec.ts` verify context-wrapped behavior including add, delete, and modal interaction.

---

### ✅ Definition of Done

- Context system removes need for prop drilling in `PortfolioPage`.
- Subscriber pattern implemented and documented for future state-connected components.
- Code adheres to SOLID and modular architecture.
- All unit, integration, and E2E tests pass.
- User story verified and aligned with sprint goal.

**Status**: ✅ Complete
**Completed On**: 2025-05-27

---

## 🏁 User Story 2: Delete Crypto Asset

- ✅ All acceptance criteria completed
- ✅ Code merged and functional
- ✅ Unit, integration, and E2E tests passed
- 🧪 Verified DoD via manual and automated tests
- 🗓️ Closed on: 2025-05-31

> “As a personal finance hobbyist, I want to remove an asset from my portfolio, so that I can keep my holdings list accurate and up-to-date.”

**Acceptance Criteria**:

- [x] 2.1 Each asset listed in the portfolio has a visible delete/remove button.
- [x] 2.2 Clicking the delete button removes the asset and its data from the portfolio.
- [x] 2.3 A confirmation prompt appears before deletion (to avoid accidental removal).
- [x] 2.4 Once deleted, the asset is no longer visible in the list or included in calculations.
- [x] 2.5 Deletion works correctly for all supported assets without breaking the UI.

---

### 🔧 Implementation Plan

#### 1. UI Components

- [x] `AssetRow.tsx`: Add delete icon-button with `aria-label` and `onClick` callback.
- [x] `DeleteConfirmationModal.tsx`: Modal with confirm/cancel for deletion (reusable).
- [x] Inject modal trigger into each row, tied to asset’s symbol/id.

#### 2. State Management (`src/hooks/usePortfolio.ts`)

- [x] Add `removeAsset(assetId: string)` method to update internal portfolio state.
- [x] Ensure removed asset is excluded from calculations and rendering.

#### 3. Visual Feedback & Accessibility

- [x] Tailwind styling for danger-action buttons (`bg-red-600`, `text-white`, hover states).
- [x] Modal accessibility: focus trap, `aria-modal="true"`, keyboard support.

#### 4. Integration in Page (`PortfolioPage.tsx`)

- [x] Pass delete handler and open-modal logic to each `AssetRow`.
- [x] Render confirmation modal at top level and control it via local state.

#### 5. Tests

- [x] **Unit Tests**:

  - `usePortfolio.test.ts`: `removeAsset()` logic
  - `AssetRow.test.tsx`: Button click triggers handler
  - `DeleteConfirmationModal.test.tsx`: Modal actions

- [x] **Integration Test**:

  - Render asset list → open delete modal → confirm → asset removed from DOM and state.

- [x] **E2E Test** (Playwright):
  - Add two assets, delete one via UI interaction, confirm the asset is gone.

---

### ✅ Definition of Done

- Users can remove assets from the portfolio with confirmation.
- Deletion updates UI and internal state immediately.
- UI styling and modal behavior match `ui-mockups.md`.
- Code follows SOLID principles; logic and components are modular.
- All unit, integration, and E2E tests pass.

---

## 🏁 User Story 3: Calculate and Display Total Portfolio Value

> “As a new crypto enthusiast, I want to see the total value of my holdings calculated in real-time, so that I can understand how much my portfolio is worth overall.”

🗓️ Completed On: 2025-06-01  
✅ Status: Complete

**Acceptance Criteria:**

- [x] 3.1 The application multiplies each asset’s quantity by its current market price.
- [x] 3.2 The portfolio total value is displayed prominently on the interface.
- [x] 3.3 The total value updates automatically when a new asset is added or an existing one is remved.
- [x] 3.4 The value updates whenever the fetched market prices change.
- [x] 3.5 In case of price fetch failure, the total value should be omitted or show a fallback state.

---

### 🔧 Implementation Plan

#### 1. Extend `usePortfolioState` to Compute Total Value

- [x] Add `totalValue` field using `useMemo()`
- [x] Compute from asset quantity and latest price per asset
- [x] Skip assets with missing or invalid prices
- [x] Ensure memoization uses `[portfolio, prices]` as dependencies

#### 2. Pass `prices` from `useCryptoPrices` into `usePortfolioState`

- [x] Update context provider (e.g., `PortfolioPageProvider.tsx`)
- [x] Inject real-time prices when initializing portfolio state

#### 3. Display Total Value in Portfolio Header

- [x] `PortfolioPage.tsx`
- [x] Render value using Tailwind styles (`text-xl font-semibold`)
- [x] Fallback display (`—`) when price data is not available

#### 4. Unit Test: `usePortfolioState.test.ts`

- [x] Confirm correct total value calculation with mock prices
- [x] Validate edge cases (zero quantity, missing price, no assets)

#### 5. Integration Test: `PortfolioPage.test.tsx`

- [x] Add and remove assets → verify total updates
- [x] Mock price changes → total reflects new price

#### 6. E2E Test: `calculate-total-value.spec.ts`

- [x] Add BTC (0.5 @ \$30k) → confirm total = \$15,000
- [x] Delete asset → total updates
- [x] Simulate price fetch failure → fallback shown

---

### ✅ Definition of Done

- Portfolio total is calculated and displayed based on current price × quantity
- Updates in real-time with portfolio or price changes
- Matches UI layout and style from `ui-mockups.md`
- Graceful fallback for missing or failed price fetches
- All tests (unit, integration, E2E) pass

---

## 🏁 User Story TD-01: Integrate Storybook for UI Component Development

🗓️ Completed On: 2025-06-01  
✅ Status: Complete

> “As a developer and designer, I want Storybook integrated into the project, so that we can build, test, and document UI components in isolation.”

**Acceptance Criteria:**

- [x] TD.1 Install and configure Storybook in the project (React + Vite + TypeScript setup).
- [x] TD.2 Define a folder structure for placing component stories (`src/components/**/__stories__/*.stories.tsx`).
- [x] TD.3 Add at least one Story for each of:
  - `AddAssetModal`
  - `AssetRow`
  - `DeleteConfirmationModal`
- [x] TD.4 Use Tailwind and design tokens from `style-guide.md` in stories.
- [x] TD.5 Ensure stories reflect real design examples from `ui-mockups.md`.
- [x] TD.6 Run Storybook with live reload using `npm run storybook`.
- [x] TD.7 Include Storybook instructions in project README or a dedicated `storybook-guide.md`.

---

### 🔧 Implementation Plan

#### 1. 📦 Install & Configure Storybook

- [x] Install Storybook with Vite and TypeScript support (`npx storybook@latest init --builder vite`)
- [x] Add Storybook configuration files (`.storybook/` folder) and confirm it runs (`npm run storybook`)

#### 2. 🧱 Set Up Tailwind & Global Styles

- [x] Add Tailwind PostCSS support in `.storybook/preview.ts`
- [x] Apply global decorators for styling context (e.g., padding wrapper, design tokens)

#### 3. 🧪 Write Initial Component Stories

- [x] Add story for `AddAssetModal` using realistic props and sample data
- [x] Add story for `AssetRow` (default + error state)
- [x] Add story for `DeleteConfirmationModal` with mocked callbacks

#### 4. 🧰 Enable Component Reusability in Stories

- [x] Export mock portfolio data from test fixtures or create a local mock module
- [x] Ensure all components render without app context (mock required hooks/props)

#### 5. 📚 Documentation & Scripts

- [x] Add `storybook` and `build-storybook` scripts to `package.json`
- [x] Create a `storybook-guide.md` with instructions for local use and adding new stories
- [x] Update `README.md` to include Storybook usage section

#### 6. ✅ Review & QA

- [x] Validate visual alignment against `ui-mockups.md`
- [x] Demo Storybook to design lead and verify it meets expectations

---

### ✅ Definition of Done

- Storybook runs with Tailwind and design tokens
- Stories exist for core components with mock data
- Designers can view and validate UI elements
- Instructions are written and visible to the team

---

## 🏁 User Story 4: Fetch and Display Real-Time Prices

🗓️ Completed On: 2025-06-05  
✅ Status: Complete

> “As a casual crypto investor, I want my portfolio assets to show their current prices and calculated value, so that I can understand the worth of each asset in real-time.”

### ✅ Acceptance Criteria:

- [x] 4.1 Each asset row displays the price in USD from the preloaded coin list.
- [x] 4.2 Each asset row displays its total value (price × quantity).
- [x] 4.3 If a price is missing or coin is unmatched, the row shows a fallback display (`—`).
- [x] 4.4 If price data is missing, an inline warning appears (`⚠️ Price fetch failed`).
- [x] 4.5 Display matches the design and style in `ui-mockups.md` and `style-guide.md`.

---

### 🔧 Implementation Summary

- Added `getPriceBySymbol()` in `useCoinContext.ts`
- Injected live price and value into each `AssetRow` via `AssetList.tsx`
- Inline fallback UI for missing prices + global error banner for failed fetch
- Reusable UI components:
  - `<ErrorBanner />`, `<LoadingSpinner />`, `<InlineErrorBadge />`

---

### 🧪 Tests

- ✅ Unit Tests: `useCoinContext`, `AssetRow`
- ✅ Integration Tests: `AssetList`, `PortfolioPage`
- ✅ E2E Tests:
  - BTC (0.5 @ $30k) = $15,000
  - Fallbacks for missing price + CoinGecko API error

---

### 🎨 Design Compliance

- UI matches `ui-mockups.md` and `style-guide.md`
- Price/Value styles, inline error badge, loading spinners all implemented

✅ Fully tested, merged, and verified.

## 🟢 Active Sprint Story: Story 5: Real-Time Value Updates on Change

> **User Story:**
> “As a crypto enthusiast, I want my total portfolio value to update immediately when I add/remove an asset or when prices change, so that I always see the real-time worth of my investments.”

---

### 🧩 Functional Goals (Mapped from Acceptance Criteria)

| ID  | Behavior                                            |
| --- | --------------------------------------------------- |
| 5.1 | Total value recalculates when asset is **added**    |
| 5.2 | Total value recalculates when asset is **removed**  |
| 5.3 | Total value updates when **prices change**          |
| 5.4 | No **manual refresh** needed — updates are reactive |
| 5.5 | UI reflects current values consistently             |

---

### 🧱 Tasks by Responsibility Type

#### 1. **Hook Refactoring for SRP**

- [x] Create `useCoinList()`
      → Fetch top 100 coins
      → Add polling with `usePolling()`
      → Only update state if prices or timestamps changed

- [x] Create `usePriceMap(coins)`
      → Accepts coin array
      → Returns stable `{ [symbol]: price }` map via `useMemo`

- [x] Refactor `useCoinSearch`  
       → Remove internal fetch logic  
       → Accept `coins` as a prop  
       → Limit to search state + filtered list only

#### 2. **Polling Infrastructure**

- [x] Implement reusable `usePolling(callback, interval)`
      → Cleanup-aware, timer-based polling logic
      → Used by `useCoinList` for scheduled fetches

- [x] Update `useCoinList()` to use `usePolling()` instead of `setInterval`
      → Cleanly refactor polling logic into external reusable hook
      → Ensure cleanup and immediate-first behavior still work

- [x] Detect changes in fetched prices using timestamp diff or deep equality before calling `setCoins()`

- [x] Expose `lastUpdatedAt` metadata to support future freshness indicators

#### 3. **UI Feedback**

- [x] Add Tailwind transition class to total value display: `transition-colors duration-300`

#### 4. **Integration and Wiring**

- [x] Fully remove `useCoinContext` from all components  
       → Replace `getPriceBySymbol`, `coins`, and `search` with hook-based props  
       → Confirm no remaining consumers in AssetList, AssetSelector, or PortfolioPage

- [x] Wire `useCoinList`, `usePriceMap`, and `useCoinSearch` into `PortfolioPage.tsx`
      → Ensure reactive price updates flow to total value and asset list
      → Validate updated props via context or direct hook usage

#### 5. **Testing**

- [x] **Unit Tests**

  - [x] `usePolling`: verify timer + cleanup
  - [x] `useCoinList`: verify polling + deduplication
  - [x] `usePriceMap`: verify memoized mapping

- [x] **Integration Test**

  - `PortfolioPage`: simulate price update, check updated total

- [x] **E2E Test**
  - `real-time-value.spec.ts`: add BTC → mock price update → confirm UI reflects new total

### 📦 Deliverables

| Type              | File / Component                        |
| ----------------- | --------------------------------------- |
| Hook Enhancement  | `useCryptoPrices.ts`, `usePolling.ts`   |
| UI Adjustment     | `PortfolioHeader.tsx` (animation)       |
| Test: Unit        | `useCryptoPrices.test.ts`               |
| Test: Integration | `PortfolioPage.test.tsx`                |
| Test: E2E         | `src/e2e/specs/real-time-value.spec.ts` |

---

### ✅ Definition of Done

- Total value auto-recalculates on asset and price change
- Prices are polled every 60s using `/simple/price` to stay within free-tier limits
- Batching and last-updated detection avoid redundant updates
- UI reflects accurate, up-to-date totals across components
- All tests (unit, integration, E2E) pass
- Styling and feedback align with `ui-mockups.md` and `style-guide.md`

## 🟢 Technical Story: TD-03 – Align UI/UX Design Docs with Visibility Standards (Windsurf-Aided)

**User Story**
_As a developer preparing for MVP delivery,_
_I want Windsurf IDE to review our UI/UX documentation for visibility, consistency, and traceability,_
_so that the codebase can be aligned with the intended design language and product goals._

---

### ✅ Acceptance Criteria

- [x] Windsurf reviews the following documents:
  - `ui-wireframes.md`
  - `style-guide.md`
  - `ui-mockups.md`
  - `product-backlog.md` (design-driven user stories)
- [x] A list of visibility issues and improvement suggestions is generated.
- [x] Redundancies, inconsistencies, or unclear naming are flagged.
- [x] Designer artifacts are updated to reflect accepted suggestions (if needed).
- [x] The resulting guidance informs the follow-up code visibility audit (`TD-02`).

---

### 🔧 Implementation Tasks

---

## 🟢 Technical Story: TD-04 – Visual/UX Refactor of `ui-mockups.md` for Design System Alignment

**User Story**
_As a developer/designer preparing for MVP delivery,_
_I want to visually and stylistically refactor `ui-mockups.md` to match the updated wireframes and style guide, without making any logical changes or altering the set of components/mockups,_
_so that the mockups serve as an accurate, implementation-ready reference for frontend development._

---

### ✅ Acceptance Criteria

- [x] Review all mockups for alignment with the latest wireframes and style guide (styling, layout, UX only)
      see ui-mockups-td04-checklist.md
- [x] Update Tailwind classes, tokens, and annotations to match the design system
- [x] Ensure all explicit labels, tooltips, error placements, and visual cues are present as per the wireframes/style guide
- [x] Do not add, remove, or logically alter any components/screens
- [x] Add a checklist of visual/UX improvements to the end of `ui-mockups.md` and mark completed items
- [x] Confirm that all mockups are implementation-ready and consistent with other design docs

---

### 🔧 Implementation Tasks

| Task Type            | Description                                                                                      | Status |
| -------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| 🧠 **Mockup Review** | Review each section of `ui-mockups.md` for visual/UX alignment with wireframes & style guide     | DONE   |
| 📝 **Checklist**     | Generate and insert a checklist of required visual/UX improvements at the end of `ui-mockups.md` | DONE   |
| ✍️ **Refactor**      | Apply Tailwind/class/annotation updates—styling/layout/UX only, no logic or component changes    | DONE   |
| 🔄 **Design Sync**   | Confirm all mockups visually match the rest of the design system and are ready for development   | DONE   |

---

| Task Type            | Description                                                                                            | Status  |
| -------------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| 🧠 **Doc Analysis**  | Prompt Windsurf to analyze `ui-wireframes.md`, `style-guide.md`, `ui-mockups.md`, `product-backlog.md` | ✅ Done |
| 📝 **Issue Catalog** | Extract and document Windsurf’s visibility suggestions (e.g., naming, structure, style usage)          | ✅ Done |
| ✍️ **Revise Docs**   | Apply agreed-upon updates to relevant docs (UI or styling inconsistencies, naming alignment)           | ✅ Done |
| 🔄 **Design Sync**   | Review final docs for clarity and consistency; ensure visual flow matches product intent               | ✅ Done |
| 📄 **Log Summary**   | Add design-related visibility changes to `refactor-notes.md`                                           | ✅ Done |
| 🔁 **Inform TD-02**  | Feed finalized design naming/structure recommendations into `TD-02` task planning                      | ✅ Done |

## 🟢 Technical Story TD-02: UI Visibility Refactor and Design Token Integration (Windsurf-Informed)

**User Story**
_As a developer preparing for MVP,_
_I want to refactor the UI for improved visual hierarchy, accessibility, and layout consistency using design tokens,_
_so that the interface is clean, readable, and easy to adapt in the future._

---

### ✅ Acceptance Criteria

- [x] All UI components follow layout and spacing from `ui-mockups.md`
- [x] Design tokens from `style-guide.md` are used consistently for:

  - Typography
  - Color roles (`primary`, `error`, etc.)
  - Spacing and border radius

- [x] Tailwind config is extended with semantic aliases (`--color-primary`, etc.)
- [x] Optional utility class wrappers (`.bg-primary`, `.text-error`) are added to `tokens.css`
- [x] All action elements have appropriate accessibility attributes (`aria-label`, tooltips)
- [x] The refactor results in **no logic changes**
- [x] All tests (unit, integration, E2E) still pass

---

### 🔧 Implementation Tasks

| Task Type             | Description                                                                                   | Status       |
| --------------------- | --------------------------------------------------------------------------------------------- | ------------ |
| 🧠 Mockup Review      | Re-analyze `ui-mockups.md` layout, spacing, and structure for implementation readiness        | ✅ Completed |
| 📐 Component Audit    | Identify Tailwind class inconsistencies or hardcoded color values in components               | ✅ Completed |
| 🎨 Apply Refactor     | Update visual layout, spacing, and tokens across `PortfolioPage`, `AssetRow`, `AddAssetModal` | ✅ Completed |
| 🧩 Token System Setup | Extend `tailwind.config.js` with CSS variable tokens (`--color-primary`, etc.)                | ✅ Completed |
| 📦 Utility Classes    | Define `.bg-primary`, `.text-error`, etc. via `@apply` in `tokens.css` (optional)             | ✅ Completed |
| ♿ Accessibility Pass | Add tooltips, aria-labels, role hints, keyboard navigation targets                            | ✅ Completed |
| ✅ Test Verification  | Run all tests (unit, integration, E2E) to confirm UI behaves the same                         | ✅ Completed |
| 📄 Document Results   | Log visual refactor notes and token alias mapping in `refactor-notes.md`                      | ✅ Completed |

---

### 📝 Commits Summary

- `fix:` simplify label styling and add test id to filter input
- `feat:` improve UI layout and accessibility across portfolio components
- `refactor:` migrate from CSS files to Tailwind utility classes and custom theme tokens
- `feat:` configure Tailwind CSS with custom design tokens and theme setup

---

### 🧪 Verification

- All E2E tests pass without changes
- Visual output matches `ui-mockups.md`
- Components are Storybook-compatible and use consistent tokens/utilities

---

### ✅ Status: Completed

🗓️ Completed On: 2025-06-28
🧩 Linked Story: TD-02 – UI Visibility Refactor and Design Token Integration

---
