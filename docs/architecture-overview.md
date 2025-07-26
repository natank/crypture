## 10. 🧱 Persistence Architecture

### 🔍 Purpose

This section documents how portfolio data is persisted across sessions using `localStorage`, enabling seamless restoration of user state. It provides architectural guidance for integrating new persistence-related features (e.g., import/export, onboarding preferences, settings) with consistency and scalability.

---

### 🔄 Portfolio Persistence Flow

| Layer                    | Responsibility                                                               |
| ------------------------ | ---------------------------------------------------------------------------- |
| `localStorageService.ts` | Abstracts browser storage operations (`loadPortfolio`, `savePortfolio`)      |
| `usePortfolioState.ts`   | Hydrates from and syncs to localStorage, decoupled via coinMap + `isLoading` |
| `PortfolioPage.tsx`      | Orchestrates portfolio logic, price data, and coin metadata                  |

---

### 🔧 Hook Initialization Strategy

To avoid premature or conflicting writes during app boot:

- `usePortfolioState()` receives `coinMap` and `isLoading` from upstream.
- A `useRef` flag `isHydrated` ensures that:

  - Hydration from localStorage runs **only once** after coins load.
  - Persistence (`savePortfolio`) does **not run** until hydration is complete.

- Empty portfolios (`[]`) are persisted explicitly when all assets are removed.

---

### 💾 Storage Schema

**Key:** `cryptoPortfolio`
**Format:**

```ts
type StoredPortfolio = { asset: string; qty: number }[];
// Example:
[
  { asset: "btc", qty: 1.2 },
  { asset: "eth", qty: 0.5 },
];
```

- Asset symbols are stored in lowercase.
- Schema is versionless for now; can be extended for versioning/migration later.

---

### ✅ E2E Test Coverage

E2E scenarios under `persist-portfolio.spec.ts` ensure:

- Portfolio is restored after a page reload
- Deleting the last asset persists an empty portfolio
- No regressions in localStorage behavior across browser sessions

---

### 🧩 Adding New Persistent Features

To integrate additional localStorage-based features:

1. **Abstract logic** inside a new or existing service in `src/services/`.
2. Avoid direct `localStorage` access inside hooks/components.
3. If hydration is conditional (e.g., requires fetched data), mirror the `isHydrated` + `isLoading` pattern.
4. Write integration tests for hydration logic, and E2E tests for visible behavior.
5. Validate that writes do not happen prematurely or overwrite user data on boot.

Here is a scaffolded section you can append organically to the `architecture-overview.md`, following the structure of existing sections like "Portfolio Persistence Flow":

---

## 📁 11. Export/Import File Architecture

### 🎯 Purpose

This section describes the structure and handling of portfolio export/import files in CSV and JSON formats. It ensures consistent formatting for integration with spreadsheets, backups, or third-party finance tools, and supports reliable data interchange across app versions and environments.

---

### 📦 File Structure Overview

#### ✅ CSV Format

- **File extension**: `.csv`
- **Encoding**: UTF-8
- **Delimiter**: Comma (`,`)
- **Quoting**: Values with commas are wrapped in double quotes

**Headers**:

```csv
Asset,Quantity,Value (USD)
```

**Example**:

```csv
Asset,Quantity,Value (USD)
btc,2,"60,000.00"
eth,1.5,"3,000.00"
```

#### ✅ JSON Format

- **File extension**: `.json`
- **Encoding**: UTF-8
- **Structure**: Array of asset records

```ts
type ExportedPortfolio = {
  asset: string; // e.g., "btc"
  quantity: number; // e.g., 2
  value: number; // e.g., 60000
}[];
```

**Example**:

```json
[
  {
    "asset": "btc",
    "quantity": 2,
    "value": 60000
  },
  {
    "asset": "eth",
    "quantity": 1.5,
    "value": 3000
  }
]
```

---

### 📥 Download Behavior

- Files are generated via `Blob` and `URL.createObjectURL()`.
- Filename follows: `portfolio-YYYY-MM-DD.csv|json` via `getFormattedDate()`.
- Triggered programmatically by injecting and clicking an anchor element (`<a download>`).
- All downloads use the browser’s default location unless overridden.

---

### 🧪 Test Coverage

| Test Type   | Covered Behavior                                      |
| ----------- | ----------------------------------------------------- |
| Unit        | `exportPortfolio()` logic for CSV/JSON and formatting |
| Integration | `ExportImportControls` triggers correct logic         |
| E2E         | Download file triggers with correct content + name    |

---

### 📐 Design Notes

- Matches UX and label tone in `style-guide.md` (e.g., “Download portfolio as file”)
- Conforms to structure shown in `ui-mockups.md` export/import toolbar
- Filename and content format is stable and consistent for re-import support
