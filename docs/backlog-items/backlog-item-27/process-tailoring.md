# Process Tailoring

**Backlog Item**: 27 - Compare Coins Side-by-Side  
**Assessed Complexity**: **Medium**

---

## Justification

This backlog item is assessed as **Medium** complexity based on:

| Criteria | Assessment |
|----------|------------|
| Components | Multiple: New page, comparison table, multi-line chart, coin selector |
| Patterns | Known: Follows existing page/hook/service patterns from Backlog Item 26 |
| Estimated Lines | ~200-300 lines of new code |
| API Integration | Reuses existing `fetchCoinDetails` and `useAssetHistory` |
| Risk | Low-Medium: Multi-line chart overlay is new but Recharts supports it |

**Why not Simple?**
- Requires new route and dedicated page component
- Multiple new UI components (comparison table, chart overlay, selector)
- State management for selected coins
- Chart normalization logic for meaningful comparison

**Why not Complex?**
- No new architectural patterns
- Leverages existing hooks and services
- No new API endpoints (reuses `/coins/{id}` and `/coins/{id}/market_chart`)
- No external dependencies beyond existing ones

---

## Tailored Deliverables

- [x] Requirements Analysis: **Yes** (completed)
- [x] Preliminary Design: **Yes** (completed)
- [x] Detailed Design: **Skip** (not needed for medium complexity)
- [x] Stories: **3 stories** (all implemented)

---

## Tailored Tasks

### Story 1: Comparison Page Structure & Coin Selection
- Create `CoinComparisonPage.tsx` with basic layout
- Add route `/compare` to `App.tsx`
- Create `CoinSelector.tsx` for searching and selecting coins
- Implement state management for selected coins (max 3)
- Add navigation to comparison page from Coin Detail Page

### Story 2: Comparative Metrics Table
- Create `ComparisonTable.tsx` component
- Display side-by-side metrics for selected coins
- Add visual indicators for better/worse performance
- Handle loading and empty states
- Mobile-responsive layout

### Story 3: Overlaid Price Charts
- Create `ComparisonChart.tsx` component
- Extend chart logic to support multiple coin data series
- Implement price normalization (percentage change from start)
- Add legend with coin colors
- Time range selector integration

---

## Story Folders

```
docs/backlog-items/backlog-item-27/
├── requirements-analysis.md ✓
├── process-tailoring.md ✓
├── Preliminary Design/
│   └── preliminary-design-report.md
├── story-1/
│   ├── story.md
│   └── implementation-plan.md
├── story-2/
│   ├── story.md
│   └── implementation-plan.md
└── story-3/
    ├── story.md
    └── implementation-plan.md
```
