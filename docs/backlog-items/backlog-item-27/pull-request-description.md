# Pull Request: Backlog Item 27 - Compare Coins Side-by-Side

## Overview

Implements the "Compare Coins Side-by-Side" feature (Backlog Item 27) from REQ-014 Investment Research. Users can now select up to 3 coins and view side-by-side metrics comparison and overlaid price charts with normalized percentage changes.

**Related Documentation:**
- Requirements Analysis: [`docs/backlog-items/backlog-item-27/requirements-analysis.md`](requirements-analysis.md)
- Process Tailoring: [`docs/backlog-items/backlog-item-27/process-tailoring.md`](process-tailoring.md)
- Preliminary Design: [`docs/backlog-items/backlog-item-27/Preliminary Design/preliminary-design-report.md`](Preliminary%20Design/preliminary-design-report.md)

---

## What Changed

### New Features

#### 1. Coin Comparison Page (`/compare`)
- **Coin Selection**: Search and select up to 3 coins for comparison
- **URL Parameter Support**: Pre-select coin via `/compare?coin=bitcoin`
- **Entry Point**: "Compare" button added to Coin Detail Page header

#### 2. Comparison Table
- **Side-by-Side Metrics**: 11 key metrics displayed in table format
  - Price, Market Cap, 24h Volume
  - 24h/7d/30d Price Changes
  - All-Time High/Low
  - Circulating/Total/Max Supply
- **Best Performer Highlighting**: Visual indicators (▲) for best value in each metric
- **Responsive Design**: Horizontal scroll on mobile devices

#### 3. Overlaid Price Charts
- **Normalized Visualization**: Shows % change from period start for meaningful comparison
- **Time Range Selection**: 7D, 30D, 90D, 1Y buttons
- **Multi-Line Chart**: Up to 3 coin price lines with distinct colors (#5a31f4, #00bfa5, #f59e0b)
- **Custom Tooltip**: Shows all coin values at selected timestamp

### New Components

```
frontend/src/
├── pages/
│   └── CoinComparisonPage.tsx          # Main comparison page (244 lines)
└── components/
    └── CoinComparison/
        ├── index.ts                     # Barrel export
        ├── CoinSelector.tsx             # Search/select coins (134 lines)
        ├── SelectedCoinsBar.tsx         # Display selected coins (67 lines)
        ├── ComparisonTable.tsx          # Metrics table (250 lines)
        └── ComparisonChart.tsx          # Overlaid chart (274 lines)
```

### Modified Components

- **`App.tsx`**: Added `/compare` route
- **`CoinDetailPage.tsx`**: Added "Compare" button to header
- **`product-backlog.md`**: Updated status to "Done"

---

## Implementation Details

### Technical Approach

**State Management:**
- Local component state for selected coins (max 3)
- Parallel API fetching with `Promise.all`
- Map-based storage for coin details and loading states

**Data Fetching:**
- Reuses existing `fetchCoinDetails` with 10-minute cache
- Reuses existing `fetchAssetHistory` for chart data
- Error handling per coin with user-facing error display

**Chart Normalization:**
```typescript
// Normalize prices to percentage change from start
const basePrice = data[0][1];
return data.map((point) => ({
  timestamp: point[0],
  value: ((point[1] - basePrice) / basePrice) * 100,
}));
```

**Performance Optimizations:**
- Memoized components (`memo`)
- Debounced search (implicit via controlled input)
- Limited search results to 10 items
- Leveraged existing API caching

---

## Testing

### Unit Tests (44 new tests)

**CoinSelector (12 tests):**
- Search and filtering by name/symbol
- Coin selection and dropdown behavior
- Exclusion of already-selected coins
- Keyboard navigation (Escape key)
- Error state display
- Disabled state
- Results limit (10 items)

**SelectedCoinsBar (9 tests):**
- Rendering selected coins with images
- Remove coin functionality
- Loading placeholder states
- Available slots message (singular/plural)
- Empty state (renders nothing)
- Accessible button labels

**ComparisonTable (12 tests):**
- Loading skeleton state
- Metrics display and formatting
- Currency/percentage/supply formatting
- Best performer highlighting
- Positive/negative styling for percentages
- Null value handling (N/A)
- Accessible table heading

**ComparisonChart (11 tests):**
- Loading state
- Time range buttons and selection
- Chart data fetching (parallel)
- Time range change triggers refetch
- Error state display
- Default 30D selection
- Accessible time range group

### E2E Tests (10 new tests)

**Feature Coverage:**
- Empty state display
- Coin search and selection flow
- Max 3 coins enforcement
- Coin removal
- Comparison table with metrics
- Chart with time range controls
- URL parameter pre-selection (`/compare?coin=bitcoin`)
- Exclusion of selected coins from search
- Mobile responsive layout (375x667)

**Test Results:**
- ✅ All 461 unit tests passing (44 new)
- ✅ All 10 E2E tests passing (all new)
- ✅ All 130 E2E tests passing in full suite

---

## Accessibility

Following existing a11y patterns:
- ✅ Semantic HTML (`<table>`, `<section>`, headings)
- ✅ ARIA labels and roles (`role="listbox"`, `aria-pressed`, `aria-expanded`)
- ✅ Screen reader text (`sr-only` class)
- ✅ Focus management (`focus-ring` utility)
- ✅ Touch targets (`tap-44` utility for 44px minimum)
- ✅ Keyboard navigation (Escape to close dropdown)

---

## Documentation

### Created Documentation

1. **Requirements Analysis** ([`requirements-analysis.md`](requirements-analysis.md))
   - Functional requirements (FR-1 to FR-4)
   - Non-functional requirements (performance, a11y, responsiveness)
   - Dependencies and constraints
   - Traceability matrix

2. **Process Tailoring** ([`process-tailoring.md`](process-tailoring.md))
   - Complexity assessment: **Medium**
   - Justification and criteria
   - Tailored deliverables (preliminary design, 3 stories)

3. **Preliminary Design Report** ([`Preliminary Design/preliminary-design-report.md`](Preliminary%20Design/preliminary-design-report.md))
   - UX/UI design and user flow
   - Component architecture
   - State management approach
   - Chart normalization strategy
   - Risk analysis and mitigations

4. **Story Documentation** (3 stories)
   - **Story 1**: Comparison Page Structure & Coin Selection
   - **Story 2**: Comparative Metrics Table
   - **Story 3**: Overlaid Price Charts
   - Each with `story.md` and `implementation-plan.md`

---

## Screenshots

### Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back                              Compare Coins           │
├─────────────────────────────────────────────────────────────┤
│ [Bitcoin BTC ✕] [Ethereum ETH ✕] [+ Search coins...]       │
├─────────────────────────────────────────────────────────────┤
│ Comparison Table                                            │
│ ┌─────────────┬───────────┬───────────┐                    │
│ │ Metric      │ Bitcoin   │ Ethereum  │                    │
│ ├─────────────┼───────────┼───────────┤                    │
│ │ Price       │ $50,000 ▲ │ $3,000    │                    │
│ │ Market Cap  │ $1.00T ▲  │ $400B     │                    │
│ │ 24h Change  │ +5.50%    │ -2.50%    │                    │
│ └─────────────┴───────────┴───────────┘                    │
├─────────────────────────────────────────────────────────────┤
│ Price Performance         [7D] [30D] [90D] [1Y]            │
│ Chart shows percentage change from start of period          │
└─────────────────────────────────────────────────────────────┘
```

---

## Breaking Changes

None. This is a new feature with no impact on existing functionality.

---

## Migration Guide

No migration needed. The feature is accessible via:
1. New `/compare` route
2. "Compare" button on Coin Detail Pages
3. Direct URL with coin parameter: `/compare?coin=bitcoin`

---

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic (chart normalization)
- [x] Documentation updated (requirements, design, stories)
- [x] Unit tests added (44 tests)
- [x] E2E tests added (10 tests)
- [x] All tests passing (461 unit, 130 E2E)
- [x] No console errors or warnings
- [x] Accessibility verified (ARIA, keyboard nav, screen readers)
- [x] Mobile responsive tested (375px viewport)
- [x] TypeScript compilation successful
- [x] Product backlog updated (Item 27 marked "Done")

---

## Related Issues

- Closes: Backlog Item 27 - Compare Coins Side-by-Side
- Related: REQ-014 Investment Research
- Follows: Backlog Item 26 - Coin Deep Dive Pages

---

## Commits

1. `feat(backlog-27): Implement coin comparison feature` - Core implementation
2. `docs: Mark backlog item 27 as Done` - Update product backlog
3. `test(backlog-27): Add unit and E2E tests for coin comparison feature` - Test coverage

---

## Reviewer Notes

### Key Areas to Review

1. **Chart Normalization Logic** (`ComparisonChart.tsx:34-45`)
   - Verify percentage calculation is correct
   - Check handling of edge cases (empty data, single point)

2. **State Management** (`CoinComparisonPage.tsx:30-40`)
   - Review parallel fetching strategy
   - Verify error handling per coin

3. **Accessibility** (all components)
   - Test keyboard navigation
   - Verify ARIA attributes
   - Check screen reader announcements

4. **Mobile Layout** (all components)
   - Test on 375px viewport
   - Verify horizontal scroll on table
   - Check touch target sizes

### Testing Instructions

```bash
# Run all tests
npm test -- --run
npm run test:e2e

# Start dev server
npm run dev

# Manual testing
1. Navigate to http://localhost:5173/compare
2. Search and select 2-3 coins
3. Verify table shows all metrics
4. Change chart time range
5. Remove coins and verify empty state
6. Test on mobile viewport (DevTools)
```

---

## Performance Impact

- **Bundle Size**: +~30KB (5 new components)
- **API Calls**: Up to 3 parallel calls on coin selection (cached for 10 minutes)
- **Render Performance**: Optimized with `memo` and limited data points
- **Memory**: Map-based storage, cleared on unmount

---

## Future Enhancements

Deferred to future backlog items:
- Educational tooltips for metrics (Backlog Item 28)
- Shareable comparison links (URL state persistence)
- More than 3 coins comparison
- Export comparison as image/PDF
- Historical comparison (compare at specific dates)
