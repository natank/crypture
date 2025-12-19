# Preliminary Design Report: Backlog Item 27 - Compare Coins Side-by-Side

## 1. UX/UI Design

### 1.1 User Flow

```
[Coin Detail Page] → "Compare" button → [Comparison Page with coin pre-selected]
                                              ↓
[Market/Portfolio] → "Compare" action → [Comparison Page with coin pre-selected]
                                              ↓
[Header/Nav] → "Compare" link → [Empty Comparison Page]
                                              ↓
                                    [Search & Select Coins]
                                              ↓
                                    [View Comparison Table]
                                              ↓
                                    [View Overlaid Charts]
```

### 1.2 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back                              Compare Coins           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Selected Coins (max 3)                               │   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐              │   │
│  │ │ BTC  ✕   │ │ ETH  ✕   │ │ + Add    │              │   │
│  │ └──────────┘ └──────────┘ └──────────┘              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Comparison Table                                     │   │
│  │ ┌─────────────┬───────────┬───────────┬───────────┐ │   │
│  │ │ Metric      │ Bitcoin   │ Ethereum  │ (empty)   │ │   │
│  │ ├─────────────┼───────────┼───────────┼───────────┤ │   │
│  │ │ Price       │ $67,234   │ $3,456    │           │ │   │
│  │ │ Market Cap  │ $1.32T ▲  │ $415B     │           │ │   │
│  │ │ 24h Change  │ +2.3% ▲   │ -0.5%     │           │ │   │
│  │ │ 7d Change   │ +5.1%     │ +8.2% ▲   │           │ │   │
│  │ │ ...         │           │           │           │ │   │
│  │ └─────────────┴───────────┴───────────┴───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Price Performance Chart                              │   │
│  │ [7D] [30D] [90D] [1Y]                               │   │
│  │                                                      │   │
│  │     ╱╲                                              │   │
│  │    ╱  ╲    ╱╲                                       │   │
│  │   ╱    ╲  ╱  ╲                                      │   │
│  │  ╱      ╲╱    ╲                                     │   │
│  │ ╱                ╲                                  │   │
│  │                                                      │   │
│  │ ● Bitcoin  ● Ethereum                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Mobile Layout

On mobile (< 640px):
- Coin selector chips stack horizontally with scroll
- Comparison table scrolls horizontally
- Chart maintains full width with touch-friendly controls

---

## 2. Technical Approach

### 2.1 Component Architecture

```
CoinComparisonPage
├── CoinSelector (search/add coins)
├── SelectedCoinsBar (chips with remove action)
├── ComparisonTable (metrics side-by-side)
└── ComparisonChart (overlaid price lines)
```

### 2.2 State Management

```typescript
// Comparison state (local to page)
interface ComparisonState {
  selectedCoinIds: string[];  // max 3
  coinData: Map<string, CoinDetails>;
  chartData: Map<string, PriceHistoryPoint[]>;
  isLoading: boolean;
  errors: Map<string, string>;
}
```

### 2.3 Data Flow

1. User selects coin → Add to `selectedCoinIds`
2. Trigger parallel fetches for coin details and chart data
3. Store results in `coinData` and `chartData` maps
4. Render comparison table and chart from maps

---

## 3. Component Overview

### 3.1 New Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `CoinComparisonPage` | Main page container | - |
| `CoinSelector` | Search and select coins | `onSelect`, `excludeIds` |
| `SelectedCoinsBar` | Display selected coins with remove | `coins`, `onRemove` |
| `ComparisonTable` | Side-by-side metrics | `coins: CoinDetails[]` |
| `ComparisonChart` | Overlaid price chart | `data: Map<string, PriceHistoryPoint[]>`, `coins` |

### 3.2 Modified Components

| Component | Changes |
|-----------|---------|
| `CoinDetailPage` | Add "Compare" button |
| `App.tsx` | Add `/compare` route |

---

## 4. API Usage

### 4.1 Endpoints Used

| Endpoint | Purpose | Caching |
|----------|---------|---------|
| `/coins/{id}` | Coin details | Existing 10min cache |
| `/coins/{id}/market_chart` | Price history | Existing cache |

### 4.2 Request Strategy

- Fetch coin details in parallel using `Promise.all`
- Debounce coin selector search (300ms)
- Reuse existing `fetchCoinDetails` and `getAssetHistory` functions

---

## 5. Chart Normalization

To compare coins with vastly different prices (e.g., BTC $67k vs DOGE $0.15):

```typescript
// Normalize to percentage change from first data point
function normalizeChartData(data: PriceHistoryPoint[]): NormalizedPoint[] {
  const basePrice = data[0].price;
  return data.map(point => ({
    timestamp: point.timestamp,
    percentChange: ((point.price - basePrice) / basePrice) * 100
  }));
}
```

Chart Y-axis shows "% Change" instead of absolute price.

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| API rate limits with 3 parallel requests | Use existing caching, stagger requests if needed |
| Chart performance with large datasets | Limit data points, use Recharts optimization |
| Complex mobile layout | Progressive disclosure, horizontal scroll for table |
| Coin search performance | Debounce input, limit results to 10 |

---

## 7. File Structure

```
frontend/src/
├── pages/
│   └── CoinComparisonPage.tsx (new)
├── components/
│   └── CoinComparison/
│       ├── index.ts (new)
│       ├── CoinSelector.tsx (new)
│       ├── SelectedCoinsBar.tsx (new)
│       ├── ComparisonTable.tsx (new)
│       └── ComparisonChart.tsx (new)
└── hooks/
    └── useCoinComparison.ts (new - optional, may use local state)
```
