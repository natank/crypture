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
