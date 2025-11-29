# Preliminary Design Report

## Backlog Item
- **ID**: 25
- **Title**: Daily Portfolio Summary & Insights
- **Requirement**: [REQ-013-notifications](../../../requirements/REQ-013-notifications.md)

---

## 1. UX/UI Design

### 1.1 Component Placement
The `DailySummaryCard` will be positioned at the top of the Portfolio page, above the `PortfolioPerformanceChart`, providing users with an immediate snapshot when they visit the page.

```
┌─────────────────────────────────────────────────┐
│  PortfolioHeader                                │
├─────────────────────────────────────────────────┤
│  [NEW] DailySummaryCard                         │
├─────────────────────────────────────────────────┤
│  PortfolioPerformanceChart                      │
├─────────────────────────────────────────────────┤
│  PortfolioCompositionDashboard                  │
└─────────────────────────────────────────────────┘
```

### 1.2 Card Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Today's Summary                              [x] Dismiss    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Portfolio Value         24h Change                             │
│  $12,345.67              +$234.56 (+1.94%)  ▲                  │
│                                                                 │
├──────────────────────────┬──────────────────────────────────────┤
│  🔥 Top Performers       │  📉 Needs Attention                  │
│  ────────────────        │  ────────────────────                │
│  1. ETH    +5.2%         │  1. DOGE   -3.1%                    │
│  2. SOL    +3.8%         │  2. XRP    -1.8%                    │
│  3. BTC    +2.1%         │  3. ADA    -0.9%                    │
├──────────────────────────┴──────────────────────────────────────┤
│  🔔 Notable Events                                              │
│  • 2 price alerts triggered today                               │
│  • SOL reached new 7-day high                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Responsive Behavior

**Desktop (≥768px)**:
- Two-column layout for performers
- Full notable events section

**Mobile (<768px)**:
- Single column, stacked layout
- Collapsible performers sections
- Condensed notable events

---

## 2. Technical Approach

### 2.1 Data Flow

```
┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  PortfolioPage   │ --> │  useDailySummary    │ --> │ DailySummaryCard │
│  (portfolio,     │     │  (hook)             │     │ (UI component)   │
│   priceMap,      │     │                     │     │                  │
│   coinMetadata)  │     │  Returns:           │     │  Displays:       │
└──────────────────┘     │  - totalValue       │     │  - metrics       │
                         │  - change24h        │     │  - performers    │
                         │  - topPerformers    │     │  - events        │
                         │  - worstPerformers  │     └──────────────────┘
                         │  - notableEvents    │
                         └─────────────────────┘
                                   ↑
                         ┌─────────┴─────────┐
                         │  alertService     │
                         │  (triggered today)│
                         └───────────────────┘
```

### 2.2 Key Types

```typescript
interface DailySummary {
  portfolioValue: number;
  change24h: {
    absolute: number;
    percentage: number;
  };
  topPerformers: AssetPerformance[];
  worstPerformers: AssetPerformance[];
  notableEvents: NotableEvent[];
  asOfTime: number;
}

interface AssetPerformance {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  change24hPercent: number;
  currentValue: number;
}

interface NotableEvent {
  type: 'alert_triggered' | 'price_milestone' | 'significant_move';
  message: string;
  timestamp: number;
  coinId?: string;
}
```

---

## 3. Component Overview

### 3.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DailySummaryCard` | `src/components/DailySummaryCard/index.tsx` | Main summary card UI |
| `PerformersSection` | `src/components/DailySummaryCard/PerformersSection.tsx` | Top/worst performers list |
| `NotableEventsSection` | `src/components/DailySummaryCard/NotableEventsSection.tsx` | Events feed |

### 3.2 New Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useDailySummary` | `src/hooks/useDailySummary.ts` | Compute summary metrics |

### 3.3 Modified Files

| File | Changes |
|------|---------|
| `PortfolioPage.tsx` | Import and render `DailySummaryCard` |
| `portfolioAnalyticsService.ts` | Add `getAssetPerformance24h()` helper |

---

## 4. Data Sources & Calculations

### 4.1 Portfolio Value & 24h Change
- Use existing `totalValue` from `usePortfolioState`
- Calculate 24h change from `portfolioAnalyticsService.getPortfolioHistory(portfolio, 1)`

### 4.2 Top/Worst Performers
- Source: `coinMetadata[coinId].price_change_percentage_24h`
- Sort by 24h change, take top 3 and bottom 3
- Filter: Only include assets with valid 24h data

### 4.3 Notable Events
1. **Triggered Alerts**: Query `alertService.getTriggeredAlerts()` and filter by today
2. **Significant Moves**: Assets with |change24h| > 10%
3. **Price Milestones**: (Future) ATH/ATL notifications

---

## 5. Persistence

### 5.1 Dismiss State
- Key: `crypture_summary_dismissed`
- Value: ISO date string of when dismissed
- Behavior: If dismissed today, hide card. Resets daily.

```typescript
const STORAGE_KEY = 'crypture_summary_dismissed';

function isDismissedToday(): boolean {
  const dismissed = localStorage.getItem(STORAGE_KEY);
  if (!dismissed) return false;
  return new Date(dismissed).toDateString() === new Date().toDateString();
}

function dismissSummary(): void {
  localStorage.setItem(STORAGE_KEY, new Date().toISOString());
}
```

---

## 6. Accessibility

- Card has `role="region"` with `aria-labelledby="summary-heading"`
- Dismiss button has `aria-label="Dismiss today's summary"`
- Performer lists use semantic `<ol>` elements
- Color changes accompanied by text indicators (▲/▼)
- Focus management: dismiss returns focus to next focusable element

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| 24h data unavailable for some coins | Missing performers | Show "N/A" or omit from list |
| Slow history fetch delays rendering | Poor UX | Show skeleton loader, cache results |
| Too many notable events clutters UI | Overwhelming | Limit to 3 most important events |
| Empty portfolio shows blank card | Confusion | Show encouraging empty state message |

---

## 8. Story Breakdown

### Story 1: Summary Data & Logic
- Create `useDailySummary` hook
- Add `getAssetPerformance24h()` to analytics service
- Integrate with alertService for triggered alerts
- Unit tests for all calculations

### Story 2: Summary UI Component
- Create `DailySummaryCard` with subcomponents
- Implement dismiss functionality with localStorage
- Add responsive styling
- Integrate into PortfolioPage
- E2E tests for display and interaction
