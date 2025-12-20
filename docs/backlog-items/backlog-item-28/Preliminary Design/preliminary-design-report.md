# Preliminary Design Report: Backlog Item 28 - Educational Tooltips & Contextual Help

## 1. UX/UI Design

### 1.1 User Flow

```
[User views metric/term] → [Hovers/focuses on help icon] → [Tooltip appears]
                                                              ↓
[User reads explanation] → [Moves mouse away/presses ESC] → [Tooltip dismisses]
```

### 1.2 Tooltip Design

**Visual Design:**
- Help icon: Small "ⓘ" icon or question mark icon next to metric labels
- Tooltip container: White background, subtle shadow, rounded corners
- Positioning: Above or below trigger (auto-position to stay in viewport)
- Typography: Clear, readable text (text-sm), beginner-friendly language
- Spacing: Adequate padding for readability

**Example Layout:**
```
Market Cap ⓘ
     ↓ (on hover/focus)
┌─────────────────────────────────────┐
│ Market Cap                          │
│                                     │
│ The total value of all coins in     │
│ circulation. Calculated by          │
│ multiplying current price by        │
│ circulating supply.                 │
└─────────────────────────────────────┘
```

### 1.3 Integration Points

**Where tooltips appear:**
1. **CoinMetrics component** - All metric labels (Market Cap, Volume, Supply, ATH/ATL, etc.)
2. **AssetRow component** - Portfolio asset metrics (market cap, change %)
3. **ComparisonTable** - All comparative metric labels
4. **AssetMetricsPanel** - Market position and supply metrics
5. **Market overview components** - Market data displays
6. **Category filters** - Category definitions (DeFi, Layer 1/2, etc.)

### 1.4 Mobile Considerations

- Touch to show/hide (tap help icon to toggle)
- Tooltip positioned to avoid viewport edges
- Larger touch targets (44x44px minimum)
- Full-width tooltips on small screens if needed

---

## 2. Technical Approach

### 2.1 Component Architecture

```
EducationalTooltip (reusable component)
├── HelpIcon (trigger element)
└── TooltipContent (positioned tooltip)
    └── Content from TooltipContent.ts (static content store)
```

### 2.2 Data Structure

```typescript
// TooltipContent.ts
export type TooltipKey = 
  | 'market_cap'
  | 'circulating_supply'
  | 'total_supply'
  | 'max_supply'
  | 'ath'
  | 'atl'
  | 'volume'
  | 'liquidity'
  | 'market_cap_rank'
  | 'category_defi'
  | 'category_layer1'
  | 'category_layer2'
  | 'category_nft'
  | 'category_gaming'
  | // ... other categories

export interface TooltipContent {
  title: string;
  description: string;
  example?: string; // Optional example
}

export const TOOLTIP_CONTENT: Record<TooltipKey, TooltipContent> = {
  market_cap: {
    title: 'Market Cap',
    description: 'The total value of all coins in circulation. Calculated by multiplying the current price by the circulating supply.',
    example: 'If Bitcoin costs $50,000 and there are 19M coins in circulation, the market cap is $950B.'
  },
  // ... more content
};
```

### 2.3 Component Props

```typescript
// EducationalTooltip.tsx
interface EducationalTooltipProps {
  contentKey: TooltipKey;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  children?: React.ReactNode; // Optional custom trigger
}

// HelpIcon.tsx
interface HelpIconProps {
  contentKey: TooltipKey;
  className?: string;
  ariaLabel?: string;
}
```

### 2.4 State Management

- Tooltip visibility managed locally with React state
- No global state needed (tooltips are independent)
- Use `useState` for show/hide
- Use `useRef` for positioning calculations

---

## 3. Component Overview

### 3.1 New Components

**EducationalTooltip.tsx**
- Reusable tooltip wrapper component
- Handles positioning, visibility, keyboard events
- Integrates with HelpIcon or custom trigger
- Accessibility features (ARIA, keyboard navigation)

**HelpIcon.tsx**
- Standardized help icon component
- Consistent styling and behavior
- Wraps EducationalTooltip for convenience
- Accessible button/icon pattern

**TooltipContent.ts**
- Type definitions for tooltip content
- Static content store with all educational terms
- Type-safe content access
- Easy to maintain and update

### 3.2 Modified Components

**CoinMetrics.tsx**
- Add HelpIcon next to each metric label
- Map metric labels to tooltip content keys
- Maintain existing layout and styling

**ComparisonTable.tsx**
- Add HelpIcon to metric column headers
- Tooltips explain metrics in comparison context

**AssetRow.tsx** (PortfolioPage)
- Add tooltips to displayed metrics
- Ensure tooltips don't interfere with row interactions

**AssetMetricsPanel.tsx**
- Add tooltips to all metric labels
- Consistent with CoinMetrics styling

**Market Overview Components**
- Add tooltips to market data displays
- Category tooltips for filters

---

## 4. Integration Points

### 4.1 Component Integration Pattern

```tsx
// Example: CoinMetrics integration
<div className="flex items-center gap-1">
  <dt className="text-xs text-text-secondary uppercase tracking-wide">
    Market Cap
  </dt>
  <HelpIcon contentKey="market_cap" />
</div>
```

### 4.2 Content Mapping

| Component | Metrics | Tooltip Keys |
|-----------|---------|--------------|
| CoinMetrics | Market Cap, Volume, Supply, ATH/ATL | `market_cap`, `volume`, `circulating_supply`, `ath`, `atl` |
| ComparisonTable | All comparison metrics | Same as CoinMetrics |
| AssetRow | Market cap, Change % | `market_cap`, `volume` |
| AssetMetricsPanel | Rank, Market Cap, Volume | `market_cap_rank`, `market_cap`, `volume` |
| Category Filters | Category names | `category_defi`, `category_layer1`, etc. |

---

## 5. API Changes

**No API changes required** - All content is static and stored in application code.

---

## 6. Risks & Mitigations

### Risk 1: Tooltip Positioning Issues
- **Risk**: Tooltips may appear off-screen or overlap content
- **Mitigation**: Implement auto-positioning logic, check viewport bounds, use CSS positioning utilities

### Risk 2: Accessibility Concerns
- **Risk**: Tooltips may not be accessible to keyboard/screen reader users
- **Mitigation**: Follow WCAG guidelines, implement proper ARIA attributes, test with screen readers, ensure keyboard navigation works

### Risk 3: Mobile UX Issues
- **Risk**: Hover-based tooltips don't work on touch devices
- **Mitigation**: Implement tap-to-toggle behavior for mobile, ensure touch targets are large enough (44x44px)

### Risk 4: Content Maintenance
- **Risk**: Educational content may become outdated or need updates
- **Mitigation**: Centralize content in TooltipContent.ts, make it easy to update, document content guidelines

### Risk 5: Performance Impact
- **Risk**: Many tooltips could impact rendering performance
- **Mitigation**: Tooltips only render when visible, use React.memo where appropriate, lazy load if needed

### Risk 6: Visual Clutter
- **Risk**: Too many help icons may clutter the UI
- **Mitigation**: Use subtle styling for help icons, consider grouping related tooltips, test with users

---

## 7. Design System Alignment

- Use existing design tokens (colors, spacing, typography)
- Follow existing accessibility patterns (`focus-ring`, `tap-44`, `sr-only`)
- Match existing component styling patterns
- Use existing Icon component if applicable
- Follow existing responsive design patterns

---

## 8. Testing Strategy

### Unit Tests
- Tooltip component renders correctly
- Content store structure is valid
- HelpIcon triggers tooltip correctly
- Keyboard navigation works
- Accessibility attributes are correct

### Integration Tests
- Tooltips appear in all integrated components
- Tooltips don't break existing functionality
- Positioning works correctly

### E2E Tests
- Tooltips appear on hover/focus
- Tooltips dismiss correctly
- Keyboard navigation works end-to-end
- Mobile tap-to-toggle works
- Content is displayed correctly

---

## 9. Implementation Order

1. **Story 1**: Create tooltip infrastructure (component, content store, help icon)
2. **Story 2**: Integrate tooltips into components (CoinMetrics, AssetRow, etc.)

This order ensures the foundation is solid before integration work begins.

