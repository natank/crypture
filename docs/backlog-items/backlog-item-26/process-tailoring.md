# Process Tailoring

**Backlog Item**: 26 - Coin Deep Dive Pages  
**Assessed Complexity**: **Medium**

---

## Justification

This backlog item is assessed as **Medium** complexity based on:

| Criteria | Assessment |
|----------|------------|
| Components | Multiple: New page, new service function, new types, routing changes |
| Patterns | Known: Follows existing page/hook/service patterns |
| Estimated Lines | ~150-250 lines of new code |
| API Integration | New endpoint (`/coins/{id}`) but similar pattern to existing |
| Risk | Low: Builds on proven architecture |

**Why not Simple?**
- Requires new route and dedicated page component
- New API endpoint integration with different response shape
- Multiple UI sections (header, metrics, chart, links)

**Why not Complex?**
- No new architectural patterns
- Leverages existing components (AssetMetricsPanel, AssetChart)
- No state management changes
- No external dependencies beyond CoinGecko

---

## Tailored Deliverables

- [x] Requirements Analysis: **Yes** (completed)
- [x] Preliminary Design: **Yes** (brief)
- [ ] Detailed Design: **Skip** (not needed for medium complexity)
- [ ] Stories: **3 stories**

---

## Tailored Tasks

### Story 1: Core Coin Detail Page Structure
- Create `CoinDetailPage.tsx` with basic layout
- Add route `/coin/:coinId` to `App.tsx`
- Create `fetchCoinDetails` service function for `/coins/{id}` endpoint
- Add `CoinDetails` type for API response
- Display coin header (name, symbol, image, price)

### Story 2: Coin Information & Metrics Display
- Integrate/extend `AssetMetricsPanel` for detailed view
- Display coin description
- Add external links section (website, whitepaper, socials)
- Integrate price chart with `AssetChart`

### Story 3: Navigation & Discovery
- Add "View Details" links from portfolio asset rows
- Add "View Details" links from market listings
- Implement back navigation
- Add related coins section (optional, if API supports)

---

## Story Folders

```
docs/backlog-items/backlog-item-26/
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
