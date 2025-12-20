# Pull Request: Backlog Item 28 - Educational Tooltips & Contextual Help

## Overview

Implements the "Educational Tooltips & Contextual Help" feature (Backlog Item 28) from REQ-014 Investment Research. Users can now access beginner-friendly explanations for crypto metrics and technical terms throughout the application via hover/focus tooltips with consistent help icons.

**Related Documentation:**
- Requirements Analysis: [`docs/backlog-items/backlog-item-28/requirements-analysis.md`](requirements-analysis.md)
- Process Tailoring: [`docs/backlog-items/backlog-item-28/process-tailoring.md`](process-tailoring.md)
- Preliminary Design: [`docs/backlog-items/backlog-item-28/Preliminary Design/preliminary-design-report.md`](Preliminary%20Design/preliminary-design-report.md)

---

## What Changed

### New Features

#### 1. Educational Tooltip System
- **Reusable Tooltip Component**: `EducationalTooltip` with auto-positioning, keyboard support, and mobile-friendly tap-to-toggle
- **Help Icon Component**: Consistent ⓘ icon wrapper (`HelpIcon`) for standardized tooltip triggers
- **Content Store**: Type-safe content store with 22 educational terms covering all crypto metrics

#### 2. Tooltip Integration Across Pages
- **Coin Detail Page**: Tooltips for all 8 metrics in `CoinMetrics` component
- **Comparison Page**: Tooltips for all 9 comparison metrics in `ComparisonTable`
- **Portfolio Page**: Tooltips for 7 metrics in `AssetMetricsPanel` (expanded asset rows)
- **Market Overview**: Tooltips for Market Cap and Volume in `MarketMetricCard`

#### 3. Educational Content
- **22 Tooltip Entries**: Comprehensive explanations for:
  - Market metrics (Market Cap, Volume, Liquidity, Market Cap Rank)
  - Supply metrics (Circulating, Total, Max Supply)
  - Price metrics (ATH, ATL, 24h/7d/30d Changes)
  - Category definitions (DeFi, Layer 1/2, NFT, Gaming, Meme, Stablecoin, Exchange Token, Metaverse, Web3)
- **Beginner-Friendly**: Plain language, concise explanations, examples included

### New Components

```
frontend/src/
├── components/
│   └── EducationalTooltip/
│       ├── index.ts                     # Barrel export
│       ├── TooltipContent.ts           # Content store (22 terms, 200+ lines)
│       ├── EducationalTooltip.tsx      # Main tooltip component (215 lines)
│       └── HelpIcon.tsx                # Help icon wrapper (39 lines)
└── __tests__/
    └── components/
        └── EducationalTooltip/
            ├── TooltipContent.test.ts   # Content tests (8 tests)
            ├── EducationalTooltip.test.tsx  # Component tests (12 tests)
            └── HelpIcon.test.tsx       # HelpIcon tests (8 tests)
```

### Modified Components

- **`CoinMetrics.tsx`**: Added `HelpIcon` to 8 metrics (Market Cap, Volume, Supply metrics, ATH/ATL, Price changes)
- **`ComparisonTable.tsx`**: Added `HelpIcon` to 9 metric headers
- **`AssetMetricsPanel/index.tsx`**: Added `HelpIcon` to 7 metrics (Market Position, Price Extremes, Supply Info)
- **`MarketMetricCard.tsx`**: Added `tooltipKey` prop support
- **`MarketMetricsGrid.tsx`**: Added tooltip keys to Market Cap and Volume cards
- **`product-backlog.md`**: Updated status to "Done"

---

## Implementation Details

### Technical Approach

**Tooltip Component:**
- React state management for visibility (`useState`)
- Auto-positioning logic to keep tooltips in viewport (prefers bottom, then top, then right, then left)
- Event handlers for hover, focus, blur, and click (mobile tap-to-toggle)
- ESC key support for dismissal
- Click-outside detection for mobile

**Content Store:**
- Type-safe `TooltipKey` union type
- Centralized `TOOLTIP_CONTENT` object with all educational content
- Helper functions: `getTooltipContent()`, `hasTooltipContent()` (type guard)

**Positioning Algorithm:**
```typescript
// Auto-position based on available viewport space
if (spaceBelow >= tooltipHeight) → position: 'bottom'
else if (spaceAbove >= tooltipHeight) → position: 'top'
else if (spaceRight >= tooltipWidth) → position: 'right'
else → position: 'left'
```

**Accessibility:**
- ARIA attributes: `role="tooltip"`, `aria-describedby`, `aria-label`
- Keyboard navigation: Tab to focus, Enter/Space to show, ESC to dismiss
- Screen reader support with proper announcements
- Focus management (doesn't trap focus)

**Mobile Support:**
- Tap-to-toggle behavior (click handler)
- Touch-friendly targets (44x44px via `tap-44` class)
- Responsive positioning adapts to screen size

---

## Testing

### Unit Tests (28 new tests)

**TooltipContent (8 tests):**
- All required tooltip keys have content
- Content structure validation (title, description, optional example)
- Helper function returns correct content
- Type guard functionality

**EducationalTooltip (12 tests):**
- Tooltip shows/hides on hover
- Tooltip shows/hides on focus
- ESC key dismisses tooltip
- Click toggles tooltip (mobile)
- Tooltip positioning logic
- ARIA attributes correctness
- Keyboard accessibility

**HelpIcon (8 tests):**
- HelpIcon renders correctly
- HelpIcon triggers tooltip
- Custom aria label support
- Keyboard navigation
- Mobile tap-to-toggle

### E2E Tests (11 new tests)

**Feature Coverage:**
- Coin Detail Page tooltips (hover, focus, ESC key)
- Comparison Page tooltips
- Portfolio Page tooltips (AssetMetricsPanel)
- Market Overview tooltips
- Keyboard navigation across pages

**Test Results:**
- ✅ All 28 unit tests passing (all new)
- ✅ All 11 E2E tests passing (all new)
- ✅ All existing tests still passing

---

## Accessibility

Following existing a11y patterns:
- ✅ Semantic HTML (`role="tooltip"`, `role="button"`)
- ✅ ARIA attributes (`aria-describedby`, `aria-label`, `aria-hidden`)
- ✅ Keyboard navigation (Tab, Enter/Space, ESC)
- ✅ Focus management (doesn't trap focus, returns focus on dismiss)
- ✅ Touch targets (`tap-44` utility for 44px minimum)
- ✅ Screen reader support (proper announcements)
- ✅ Color contrast (follows design system tokens)

---

## Documentation

### Created Documentation

1. **Requirements Analysis** ([`requirements-analysis.md`](requirements-analysis.md))
   - Functional requirements (FR-1 to FR-4)
   - Non-functional requirements (performance, a11y, UX)
   - Dependencies and constraints
   - Educational content areas
   - Traceability matrix

2. **Process Tailoring** ([`process-tailoring.md`](process-tailoring.md))
   - Complexity assessment: **Medium**
   - Justification and criteria
   - Tailored deliverables (preliminary design, 2 stories)

3. **Preliminary Design Report** ([`Preliminary Design/preliminary-design-report.md`](Preliminary%20Design/preliminary-design-report.md))
   - UX/UI design and user flow
   - Component architecture
   - Integration points
   - Risk analysis and mitigations
   - Design system alignment

4. **Story Documentation** (2 stories)
   - **Story 1**: Tooltip Component & Content Infrastructure
   - **Story 2**: Integration Across Components
   - Each with `story.md` and `implementation-plan.md`

---

## Screenshots

### Coin Detail Page - CoinMetrics
```
┌─────────────────────────────────────────────────────────────┐
│ Key Metrics                                                  │
├─────────────────────────────────────────────────────────────┤
│ Market Cap ⓘ       24h Volume ⓘ     Circulating Supply ⓘ   │
│ $1.32T            $45.2B            19.5M BTC              │
│                                                              │
│ All-Time High ⓘ   All-Time Low ⓘ   7d Change ⓘ            │
│ $69,000           $0.05             +5.2%                   │
│ Nov 10, 2021      Jul 6, 2013                               │
└─────────────────────────────────────────────────────────────┘
```

### Tooltip Example (on hover/focus)
```
Market Cap ⓘ
     ↓
┌─────────────────────────────────────┐
│ Market Cap                          │
│                                     │
│ The total value of all coins in     │
│ circulation. Calculated by          │
│ multiplying current price by        │
│ circulating supply.                 │
│                                     │
│ Example: If Bitcoin costs $50,000   │
│ and there are 19 million coins in  │
│ circulation, the market cap is      │
│ $950 billion.                       │
└─────────────────────────────────────┘
```

### Comparison Table
```
┌─────────────────────────────────────────────────────────────┐
│ Comparison Table                                             │
├─────────────┬───────────┬───────────┬───────────┤
│ Metric      │ Bitcoin   │ Ethereum  │ Solana    │
├─────────────┼───────────┼───────────┼───────────┤
│ Market Cap ⓘ│ $1.32T    │ $400B     │ $50B      │
│ 24h Volume ⓘ│ $45.2B    │ $12.5B    │ $2.1B     │
│ 24h Change ⓘ│ +2.3%     │ -0.5%     │ +5.1%     │
└─────────────┴───────────┴───────────┴───────────┘
```

---

## Breaking Changes

None. This is a new feature with no impact on existing functionality. All tooltips are additive and don't modify existing component behavior.

---

## Migration Guide

No migration needed. The feature is automatically available on:
1. Coin Detail Pages (`/coin/{id}`) - All metrics have tooltips
2. Comparison Page (`/compare`) - All comparison metrics have tooltips
3. Portfolio Page (`/portfolio`) - Metrics in expanded asset rows have tooltips
4. Market Overview Page (`/market`) - Market Cap and Volume have tooltips

---

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic (positioning algorithm)
- [x] Documentation updated (requirements, design, stories)
- [x] Unit tests added (28 tests)
- [x] E2E tests added (11 tests)
- [x] All tests passing (28 unit, 11 E2E)
- [x] No console errors or warnings
- [x] Accessibility verified (ARIA, keyboard nav, screen readers)
- [x] Mobile responsive tested (touch targets, tap-to-toggle)
- [x] TypeScript compilation successful
- [x] Product backlog updated (Item 28 marked "Done")

---

## Related Issues

- Closes: Backlog Item 28 - Educational Tooltips & Contextual Help
- Related: REQ-014 Investment Research
- Follows: Backlog Item 27 - Compare Coins Side-by-Side

---

## Commits

1. `feat(backlog-28): Implement educational tooltip infrastructure` - Story 1: Components and content store
2. `feat(backlog-28): Integrate tooltips across components` - Story 2: Integration
3. `test(backlog-28): Add unit and E2E tests for educational tooltips` - Test coverage
4. `docs: Mark backlog item 28 as Done` - Update product backlog

---

## Reviewer Notes

### Key Areas to Review

1. **Tooltip Positioning Logic** (`EducationalTooltip.tsx:42-70`)
   - Verify auto-positioning algorithm handles edge cases
   - Check viewport boundary detection
   - Test on different screen sizes

2. **Content Quality** (`TooltipContent.ts`)
   - Review educational content for accuracy
   - Verify beginner-friendly language
   - Check examples are helpful

3. **Accessibility** (all components)
   - Test keyboard navigation (Tab, Enter, ESC)
   - Verify ARIA attributes with screen reader
   - Check focus management

4. **Mobile Experience** (all components)
   - Test tap-to-toggle behavior
   - Verify touch target sizes (44x44px)
   - Check tooltip positioning on small screens

5. **Integration Points** (modified components)
   - Verify tooltips don't break existing layouts
   - Check help icons are consistently positioned
   - Ensure no layout shifts

### Testing Instructions

```bash
# Run all tests
npm test -- --run
npm run test:e2e

# Start dev server
npm run dev

# Manual testing
1. Navigate to http://localhost:5173/coin/bitcoin
2. Hover over help icons (ⓘ) next to metrics
3. Verify tooltips appear with correct content
4. Test keyboard navigation (Tab to focus, Enter to show, ESC to dismiss)
5. Test on mobile viewport (tap to toggle)
6. Check tooltips on:
   - Coin Detail Page (/coin/bitcoin)
   - Comparison Page (/compare?coinIds=bitcoin,ethereum)
   - Portfolio Page (/portfolio) - expand asset row
   - Market Overview (/market)
```

---

## Performance Impact

- **Bundle Size**: +~8KB (3 new components, content store)
- **Runtime Performance**: Minimal impact (tooltips only render when visible)
- **Memory**: Static content store (no dynamic allocations)
- **API Calls**: None (all content is static)
- **Render Performance**: Optimized with conditional rendering, no unnecessary re-renders

---

## Future Enhancements

Potential improvements for future backlog items:
- Interactive tutorials or guided tours
- Video content or external links in tooltips
- User-customizable tooltip preferences
- Analytics tracking for tooltip usage
- Additional educational content for advanced metrics
- Tooltip content localization (i18n)

