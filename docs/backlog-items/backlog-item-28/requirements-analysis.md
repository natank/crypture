# Requirements Analysis: Backlog Item 28 - Educational Tooltips & Contextual Help

## Source Requirement

**REQ-014: Investment Research** - [Link](../../requirements/REQ-014-research.md)

---

## Key Functional Requirements

### FR-1: Educational Tooltips for Technical Terms

- Users shall be able to access tooltips explaining technical terms and metrics
- Tooltips should appear on hover/focus for terms such as:
  - Market cap
  - Circulating vs. total vs. max supply
  - ATH (All-Time High) / ATL (All-Time Low) significance
  - Volume and liquidity
  - Market cap rank
  - Category definitions (DeFi, Layer 1/2, etc.)

### FR-2: Contextual Help Integration

- Tooltips shall be integrated into existing components displaying metrics:
  - Portfolio asset rows (market cap, value, change %)
  - Coin detail pages (all metrics)
  - Comparison pages (comparative metrics)
  - Market overview pages (market data)
- Help icons or indicators should be visible near relevant terms

### FR-3: Accessibility Requirements

- Tooltips shall be accessible via keyboard navigation (focus)
- Screen reader support with appropriate ARIA labels
- Tooltips should not block content or interfere with interactions
- Clear visual indicators for interactive help elements

### FR-4: Educational Content Quality

- Content shall be clear and beginner-friendly
- Explanations should be concise but informative
- Use plain language, avoiding excessive jargon
- Include examples where helpful

---

## Non-Functional Requirements

### NFR-1: Performance

- Tooltips should load instantly (no API calls needed)
- Static content stored in application code
- No impact on page load times

### NFR-2: User Experience

- Tooltips should be non-intrusive
- Dismissible or auto-dismiss on mouse leave
- Consistent styling across all tooltips
- Mobile-friendly (touch to show/hide)

### NFR-3: Maintainability

- Educational content should be centralized for easy updates
- Reusable tooltip component
- Type-safe content definitions

---

## Dependencies

### Existing Components to Leverage

- `Icon` component - Already used for tooltips (ⓘ icon with title)
- Design system tokens - For consistent styling
- Accessibility utilities - `sr-only`, `focus-ring`, `tap-44` patterns

### New Components Required

- `EducationalTooltip.tsx` - Reusable tooltip component with educational content
- `TooltipContent.ts` - Type definitions and content store for educational terms
- `HelpIcon.tsx` - Standardized help icon component

### Integration Points

- `CoinMetrics` component - Add tooltips to metric labels
- `AssetRow` component - Add tooltips to displayed metrics
- `CoinDetailPage` - Add tooltips throughout
- `ComparisonTable` - Add tooltips to comparison metrics
- Market overview components - Add tooltips to market data

---

## Assumptions & Constraints

### Assumptions

1. Tooltip content is static (no dynamic content from API)
2. Users will primarily access tooltips via hover on desktop, tap on mobile
3. Existing design system patterns will be followed
4. No authentication required for accessing tooltips

### Constraints

1. Must work within existing app architecture
2. Must follow accessibility guidelines (WCAG 2.1 AA)
3. Must be mobile-responsive
4. Content must be maintainable and easy to update
5. No external dependencies beyond existing ones

---

## Educational Content Areas (from REQ-014)

The following terms need educational tooltips:

1. **Market Cap**: Total value of all coins in circulation
2. **Circulating Supply**: Number of coins currently available in the market
3. **Total Supply**: Total number of coins that exist (including locked/unreleased)
4. **Max Supply**: Maximum number of coins that will ever exist
5. **ATH (All-Time High)**: Highest price the coin has ever reached
6. **ATL (All-Time Low)**: Lowest price the coin has ever reached
7. **Volume**: Total value of coins traded in a given period (24h)
8. **Liquidity**: How easily a coin can be bought/sold without affecting price
9. **Market Cap Rank**: Coin's position by market capitalization
10. **Category Definitions**:
    - DeFi (Decentralized Finance)
    - Layer 1/2 (Blockchain infrastructure layers)
    - NFT (Non-Fungible Tokens)
    - Gaming
    - etc.

---

## Out of Scope (Deferred to Other Backlog Items)

- Interactive tutorials or guided tours
- Video content or external links in tooltips
- User-customizable tooltip preferences
- Analytics tracking for tooltip usage

---

## Traceability

| Requirement                       | Stories          |
| --------------------------------- | ---------------- |
| FR-1: Educational Tooltips        | Story 1          |
| FR-2: Contextual Help Integration | Story 2          |
| FR-3: Accessibility               | Story 1, Story 2 |
| FR-4: Content Quality             | Story 1          |
