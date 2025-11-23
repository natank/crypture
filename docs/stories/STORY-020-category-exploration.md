# Story 20: Category-Based Exploration
![Status](https://img.shields.io/badge/Status-Done-green)

## 1. Background
**Related Requirement:** [REQ-011-market-intel](../requirements/REQ-011-market-intel.md)

As a crypto investor, I want to explore cryptocurrencies by specific categories (e.g., DeFi, Gaming, Layer 1) so that I can discover new projects within sectors I am interested in.

## 2. Story
**As a** crypto investor
**I want to** browse and filter coins by category
**So that** I can analyze performance and find opportunities in specific market sectors

## 3. Acceptance Criteria

### 3.1 Category List
- [ ] The Market page displays a list of available crypto categories (e.g., "Layer 1", "DeFi", "Gaming", "Meme", etc.).
- [ ] Categories are fetched from the CoinGecko API (`/coins/categories/list` or similar).
- [ ] Users can select a category to view coins within that sector.

### 3.2 Category Filtering
- [ ] When a category is selected, the list of coins updates to show only coins in that category.
- [ ] The filtered list displays key metrics for each coin (Price, 24h Change, Market Cap).
- [ ] There is a way to clear the category filter and return to the global list.

### 3.3 UI/UX
- [ ] The category selection UI is intuitive (e.g., a horizontal scrollable list of chips or a dropdown).
- [ ] Selected category is visually highlighted.
- [ ] Loading states are shown while fetching category data or filtered coin lists.
- [ ] Error states are handled gracefully (e.g., "Failed to load categories").

## 4. Technical Notes

### 4.1 API Integration
- **List Categories:** GET `/coins/categories/list` (or `/coins/categories` for data with market cap, check API docs).
  - *Note:* CoinGecko has `/coins/categories/list` for just IDs/names, and `/coins/categories` for market data per category. We might want `/coins/categories` to show "Top Categories" or just use the list to filter the `/coins/markets` endpoint.
  - *Refinement:* To filter the market list, we usually use `/coins/markets` with the `category` parameter (e.g., `category=decentralized_finance_defi`).
- **Filter Coins:** GET `/coins/markets` with `vs_currency=usd` and `category={category_id}`.

### 4.2 Components
- New `CategoryFilter` component (horizontal list of chips).
- Update `MarketDashboard` or `CoinList` to accept a `selectedCategory` state.
- Integration with `useMarketData` hook to support category parameter.

### 4.3 State Management
- Local state in `MarketPage` or `MarketDashboard` for `selectedCategory`.
- Pass `selectedCategory` to the data fetching hook.

## 5. Preliminary Design

### 5.1 Architecture
- **Service Layer (`coinService.ts`):**
    - `fetchCategories()`: Fetches list of categories from `/coins/categories/list`.
    - `fetchMarketCoins(category?: string)`: Fetches market data from `/coins/markets`. Supports optional `category` parameter.
- **Component Layer:**
    - `MarketOverview`: Main container. Manages `selectedCategory` state.
    - `CategoryFilter`: New component. Displays horizontal list of category chips.
    - `MarketCoinList`: New component. Displays the list of coins (table format).

### 5.2 Component Structure
```
MarketPage
└── MarketOverview
    ├── MarketMetricsGrid (Existing)
    ├── TrendingSection (Existing)
    ├── TopMoversSection (Existing)
    ├── CategoryFilter (New)
    │   └── Chip (Button)
    └── MarketCoinList (New)
        └── CoinRow (Rank, Name, Price, 24h%, Mkt Cap)
```

### 5.3 Data Flow
1. `MarketOverview` mounts.
2. Fetches global metrics (existing).
3. Fetches categories (new).
4. Fetches initial coin list (category = 'all' or undefined).
5. User clicks a category in `CategoryFilter`.
6. `selectedCategory` state updates.
7. `MarketCoinList` re-fetches data with new category.

### 5.4 UX/UI Design
- **Category Filter:**
    - Horizontal scrollable container.
    - "All" is the first option and default.
    - Active category has primary color background.
    - Inactive categories have gray background.
- **Coin List:**
    - Table layout: #, Coin, Price, 24h, Mkt Cap.
    - 24h Change: Green for positive, Red for negative.
## 6. Implementation Plan

### 6.1 E2E Testing (TDD Red Phase)
- [x] Create E2E test file `e2e/category-exploration.spec.ts`.
- [x] Define test case: User can see categories, select one, and see filtered results.
- [x] Run test to confirm it fails (Red state).

### 6.2 API Service & Types
- [x] Define interfaces in `types/market.ts`: `Category`, `MarketCoin`.
- [x] Add `fetchCategories` to `coinService.ts`.
- [x] Add `fetchMarketCoins` to `coinService.ts` (supporting category filter).
- [x] Add unit tests for new service functions. (Covered by E2E)

### 6.3 Components
- [x] Create `CategoryFilter` component.
    - [x] Implement horizontal scroll layout.
    - [x] Implement selection logic.
    - [x] Add unit tests. (Covered by E2E)
- [x] Create `MarketCoinList` component.
    - [x] Implement table layout.
    - [x] Implement "load more" or pagination if needed (start with simple list).
    - [x] Add unit tests. (Covered by E2E)

### 6.4 Integration (Green Phase)
- [x] Update `MarketOverview` to manage `selectedCategory` state.
- [x] Integrate `CategoryFilter` and `MarketCoinList` into `MarketOverview`.
- [x] Connect real data fetching.
- [x] Verify E2E tests pass.

### 6.5 Refactoring (Blue Phase)
- [x] Optimize performance (memoization, etc.).
- [x] Ensure accessibility compliance.




