# Preliminary Design Report: Coin Deep Dive Pages

**Backlog Item**: 26  
**Date**: 2024-12-18

---

## 1. UX/UI Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Portfolio/Market                                 │
├─────────────────────────────────────────────────────────────┤
│  [Image] Bitcoin (BTC)                    $43,250.00        │
│          Rank #1                          ▲ +2.34% (24h)    │
├─────────────────────────────────────────────────────────────┤
│  Description                                                │
│  ─────────────────────────────────────────────────────────  │
│  Bitcoin is a decentralized digital currency...             │
│  [Read more]                                                │
├─────────────────────────────────────────────────────────────┤
│  Key Metrics                                                │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Market Cap   │ 24h Volume   │ Circulating  │            │
│  │ $847.2B      │ $28.5B       │ 19.6M BTC    │            │
│  ├──────────────┼──────────────┼──────────────┤            │
│  │ ATH          │ ATL          │ Max Supply   │            │
│  │ $69,045      │ $67.81       │ 21M BTC      │            │
│  └──────────────┴──────────────┴──────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Price History                          [7D] [30D] [90D] [1Y]│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    📈 Chart                             ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Links                                                      │
│  🌐 Website  📄 Whitepaper  🐦 Twitter  💬 Reddit          │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout
- Single column, stacked sections
- Collapsible description with "Read more"
- Horizontally scrollable metrics on small screens
- Full-width chart

---

## 2. Technical Approach

### Data Flow

```
URL (/coin/:coinId)
       │
       ▼
┌─────────────────┐
│ CoinDetailPage  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
useCoinDetails  useAssetHistory
    │              │
    ▼              ▼
fetchCoinDetails  fetchAssetHistory
    │              │
    ▼              ▼
CoinGecko API   CoinGecko API
/coins/{id}     /coins/{id}/market_chart
```

### API Endpoint

**CoinGecko `/coins/{id}`** returns:
- `id`, `symbol`, `name`, `image`
- `description.en` - Coin description
- `links.homepage`, `links.whitepaper`, `links.twitter_screen_name`, etc.
- `market_data.current_price`, `market_cap`, `total_volume`, etc.
- `categories` - For related coins discovery

---

## 3. Component Overview

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CoinDetailPage` | `pages/CoinDetailPage.tsx` | Main page component |
| `CoinHeader` | `components/CoinDetail/CoinHeader.tsx` | Name, symbol, image, price |
| `CoinDescription` | `components/CoinDetail/CoinDescription.tsx` | Expandable description |
| `CoinLinks` | `components/CoinDetail/CoinLinks.tsx` | External resource links |

### Reused Components

| Component | Modifications |
|-----------|---------------|
| `AssetMetricsPanel` | None - reuse as-is |
| `AssetChart` | None - reuse as-is |

### New Hooks

| Hook | Purpose |
|------|---------|
| `useCoinDetails` | Fetch and cache detailed coin info |

---

## 4. API Changes

### New Service Function

```typescript
// coinService.ts
export async function fetchCoinDetails(coinId: string): Promise<CoinDetails>
```

### New Types

```typescript
// types/market.ts
export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  description: { en: string };
  links: {
    homepage: string[];
    whitepaper: string;
    twitter_screen_name: string;
    subreddit_url: string;
    repos_url: { github: string[] };
  };
  categories: string[];
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    ath: { usd: number };
    ath_date: { usd: string };
    ath_change_percentage: { usd: number };
    atl: { usd: number };
    atl_date: { usd: string };
    atl_change_percentage: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    market_cap_rank: number;
  };
}
```

---

## 5. Routing Changes

```typescript
// App.tsx
<Route path="/coin/:coinId" element={<CoinDetailPage />} />
```

---

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| API rate limiting | Use caching (5-10 min) similar to existing patterns |
| Large description text | Truncate with "Read more" expansion |
| Missing links in API response | Graceful fallback - hide missing links |
| Slow page load | Progressive loading - show header first, then metrics, then chart |

---

## 7. File Structure

```
frontend/src/
├── pages/
│   └── CoinDetailPage.tsx          # New
├── components/
│   └── CoinDetail/                  # New folder
│       ├── index.ts
│       ├── CoinHeader.tsx
│       ├── CoinDescription.tsx
│       └── CoinLinks.tsx
├── hooks/
│   └── useCoinDetails.ts            # New
├── services/
│   └── coinService.ts               # Add fetchCoinDetails
└── types/
    └── market.ts                    # Add CoinDetails type
```
