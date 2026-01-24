## 🧪 E2E Test Configuration Guide

### 📁 Project Structure

```
frontend/src/e2e/
├── fixtures.ts                       # Shared POM-based test fixtures
├── test-setup.ts                     # Global setup, routing mocks, etc.
├── mocks/
│   └── mockCoinGecko.ts              # API mocks (e.g., CoinGecko)
├── pom-pages/                        # Page Object Model classes
│   ├── portfolio.pom.ts
│   ├── add-asset-modal.pom.ts
│   └── delete-confirmation-modal.pom.ts
├── specs/
│   ├── a11y/                         # Accessibility specs
│   │   └── contrast.spec.ts (example)
│   ├── features/                     # Feature-focused specs
│   │   └── ...
│   └── flows/                        # Cross-feature user flows
│       ├── import-portfolio.spec.ts  # Import flow (scaffolded)
│       └── ...
└── utils/
    └── aa11y-check.ts                # Reusable utilities
```

---

### ⚙️ Tooling & Conventions

- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: TypeScript
- **Testing Strategy**: Page Object Model (POM) + custom fixtures
- **Location**: All E2E assets are under `frontend/src/e2e/` with specs organized by `a11y`, `features`, and `flows`.

---

### 📦 POM Class Conventions

| Component / Page          | File                               | Class Name                |
| ------------------------- | ---------------------------------- | ------------------------- |
| Portfolio Dashboard       | `portfolio.pom.ts`                 | `PortfolioPage`           |
| Add Asset Modal           | `add-asset-modal.pom.ts`           | `AddAssetModal`           |
| Delete Confirmation Modal | `delete-confirmation-modal.pom.ts` | `DeleteConfirmationModal` |

---

### 🔑 POM Entry Points (PortfolioPage)

- `goto()` – navigate to app root
- `addAsset(symbol: string, quantity: number)` – opens modal and adds asset
- `assetRow(symbol: string)` – locator for a specific asset row (by symbol)
- `selectExportFormat(label: "CSV" | "JSON")` – choose export format
- `clickExportButton()` – trigger export action
- `isModalVisible()` – check modal visibility

Example:

```ts
import { test, expect } from "../fixtures";

test("add and export portfolio", async ({ portfolioPage }) => {
  await portfolioPage.goto();
  await portfolioPage.addAsset("BTC", 0.5);
  await expect(portfolioPage.assetRow("BTC")).toBeVisible();

  await portfolioPage.selectExportFormat("JSON");
  await portfolioPage.clickExportButton();
});
```

Import flow test IDs used in specs for reference:
- `data-testid="import-file-input"`
- `data-testid="import-replace-button"`

### 🏷️ Test Selectors Reference

Common `data-testid` values used in E2E and component tests:

- `add-asset-button` — `@components/AssetList/index.tsx`
- `asset-select` — `@components/AssetSelector.tsx`
- `export-button` — `@components/ExportImportControls/index.tsx`
- `import-button` — `@components/ExportImportControls/index.tsx`
- `import-file-input` — `@components/ExportImportControls/index.tsx`
- `import-merge-button` — `@components/ImportPreviewModal.tsx`
- `import-replace-button` — `@components/ImportPreviewModal.tsx`
- `filter-input` — `@components/FilterSortControls/index.tsx`
- `sort-dropdown` — `@components/FilterSortControls/index.tsx`
- `total-value` — `@components/PortfolioHeader/index.tsx`
- `asset-list` — rendered list container in Portfolio wiring tests

All classes:

- Accept `page: Page` in constructor
- Expose user-oriented methods (e.g., `.addAsset()`, `.confirmDelete()`)
- Use `get locators()` pattern for selectors

---

### 🧪 Test Fixture Conventions

All specs should use POMs via injected fixtures defined in `src/e2e/fixtures.ts`:

```ts
test("user can delete an asset", async ({
  portfolioPage,
  addAssetModal,
  deleteModal,
}) => {
  await addAssetModal.openAndAdd("BTC", 0.5);
  await portfolioPage.openDeleteModalFor("BTC");
  await deleteModal.confirm();
  await expect(portfolioPage.assetRow("BTC")).not.toBeVisible();
});
```

Define fixtures using `test.extend()` in `fixtures.ts`.

---

### 🔧 Creating a New Fixture

Extend `test` from `@playwright/test` with custom page objects:

```ts
// src/e2e/fixtures.ts
import { test as base } from "@playwright/test";
import { PortfolioPage } from "./pom-pages/portfolio.pom";
import { AddAssetModal } from "./pom-pages/add-asset-modal.pom";
import { DeleteConfirmationModal } from "./pom-pages/delete-confirmation-modal.pom";

export const test = base.extend<{
  portfolioPage: PortfolioPage;
  addAssetModal: AddAssetModal;
  deleteModal: DeleteConfirmationModal;
}>({
  portfolioPage: async ({ page }, use) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    await use(portfolio);
  },
  addAssetModal: async ({ page }, use) => {
    await use(new AddAssetModal(page));
  },
  deleteModal: async ({ page }, use) => {
    await use(new DeleteConfirmationModal(page));
  },
});
yaml;
Copy;
Edit;
```

---

### 🧪 Writing a New Test Spec

Create a new test file in `src/e2e/specs/`:

```ts
// delete-asset.spec.ts
import { test, expect } from "../fixtures";

test("user can delete an asset", async ({
  portfolioPage,
  addAssetModal,
  deleteModal,
}) => {
  await addAssetModal.openAndAdd("BTC", 1.5);
  await portfolioPage.openDeleteModalFor("BTC");
  await deleteModal.confirm();
  await expect(portfolioPage.assetRow("BTC")).not.toBeVisible();
});
```

---

### ✅ Best Practices

- One `.spec.ts` file per feature or user story
- One `.pom.ts` file per logical page or modal
- Always use test data via helper or fixture (avoid hardcoded waits)
- Prefer `data-testid` attributes for robust selectors
- Assert with `expect()` for each user-visible outcome

---

### 🚀 Running E2E Tests

#### Run all specs:

```bash
npx playwright test
```

#### Run specific spec:

```bash
npx playwright test src/e2e/specs/delete-asset.spec.ts
```

#### ▶️ Run E2E Tests in Watch Mode

To re-run a specific Playwright test automatically when files change, use:

```bash
npx chokidar-cli 'src/e2e/\*_/_.{ts,tsx}' -c 'npx playwright test src/e2e/specs/calculate-total-value.spec.ts'
```

Make sure chokidar-cli is installed:

```bash
npm install --save-dev chokidar-cli
```

This will watch for changes in the src/e2e/ directory and re-run the specified test file each time a change is detected.

#### Headed mode for debugging:

```bash
npx playwright test --headed
```

---

---

### 🔒 External API Mocking Strategy

Playwright tests **do not rely on live API calls**. All requests to third-party services like CoinGecko are intercepted and mocked to ensure test reliability, speed, and offline support.

By default, we mock the `/coins/markets` endpoint from CoinGecko using the `mockCoinGeckoMarkets(page)` utility.

This function is defined in `src/e2e/mocks/coinGecko.ts` and is typically invoked at the start of each test:

```ts
import { mockCoinGeckoMarkets } from "../mocks/coinGecko";

test("example", async ({ page }) => {
  await mockCoinGeckoMarkets(page);
  ...
});
```

The mock returns a fixed response for Bitcoin and Ethereum:
[
{ "id": "bitcoin", "symbol": "btc", "name": "Bitcoin", "current_price": 30000 },
{ "id": "ethereum", "symbol": "eth", "name": "Ethereum", "current_price": 2000 }
]
📌 Note: If your test depends on different data, copy and customize the mock for your test scenario.

This avoids flakiness due to API rate limits, downtime, or unexpected data changes.

---

### 🧾 Changelog

- 2025-08-24
  - Added placeholder for Import Portfolio E2E spec: `src/e2e/specs/import-portfolio.spec.ts`
  - Recommended scenarios:
    - Happy path import with valid JSON
    - CSV with missing required field → validation error
    - Merge vs Replace behavior from preview modal
  - Run a single spec locally:

```bash
cd frontend
npm run test:e2e -- src/e2e/specs/import-portfolio.spec.ts
