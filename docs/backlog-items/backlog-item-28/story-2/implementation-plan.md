# Implementation Plan: Story 2 - Integration Across Components

## Story

**Story 2**: Integration Across Components

## Estimated Effort

3-4 hours

---

## Task List

### Task 1: Integrate Tooltips into CoinMetrics Component

- [ ] Import HelpIcon component
- [ ] Map metric labels to tooltip content keys
- [ ] Add HelpIcon next to each metric label
- [ ] Ensure layout doesn't break
- [ ] Test tooltips appear correctly

### Task 2: Integrate Tooltips into ComparisonTable Component

- [ ] Import HelpIcon component
- [ ] Map metric labels to tooltip content keys
- [ ] Add HelpIcon to metric column headers
- [ ] Ensure table layout doesn't break
- [ ] Test tooltips appear correctly

### Task 3: Integrate Tooltips into AssetMetricsPanel Component

- [ ] Import HelpIcon component
- [ ] Map metric labels to tooltip content keys
- [ ] Add HelpIcon to metric labels
- [ ] Ensure grid layout doesn't break
- [ ] Test tooltips appear correctly

### Task 4: Check and Integrate into Market Overview Components

- [ ] Find market overview components
- [ ] Identify metrics that need tooltips
- [ ] Add HelpIcon to relevant metrics
- [ ] Test tooltips appear correctly

### Task 5: Write E2E Tests

- [ ] E2E test for tooltips on Coin Detail Page
- [ ] E2E test for tooltips on Comparison Page
- [ ] E2E test for tooltips on Portfolio Page (AssetMetricsPanel)
- [ ] Verify keyboard navigation works
- [ ] Verify tooltip content is correct

---

## Files to Modify

### Components

- `frontend/src/components/CoinDetail/CoinMetrics.tsx` - Add tooltips to all metrics
- `frontend/src/components/CoinComparison/ComparisonTable.tsx` - Add tooltips to metric headers
- `frontend/src/components/AssetMetricsPanel/index.tsx` - Add tooltips to metrics
- Market overview components (if applicable)

### Tests

- `frontend/src/e2e/specs/educational-tooltips.spec.ts` - New E2E test file

---

## Metric to Tooltip Key Mapping

### CoinMetrics

- "Market Cap" → `market_cap`
- "24h Volume" → `volume`
- "Circulating Supply" → `circulating_supply`
- "Total Supply" → `total_supply`
- "Max Supply" → `max_supply`
- "All-Time High" → `ath`
- "All-Time Low" → `atl`
- "7d Change" → `price_change_7d`
- "30d Change" → `price_change_30d`

### ComparisonTable

- "Market Cap" → `market_cap`
- "24h Volume" → `volume`
- "24h Change" → `price_change_24h`
- "7d Change" → `price_change_7d`
- "30d Change" → `price_change_30d`
- "All-Time High" → `ath`
- "All-Time Low" → `atl`
- "Circulating Supply" → `circulating_supply`
- "Total Supply" → `total_supply`
- "Max Supply" → `max_supply`

### AssetMetricsPanel

- "Market Cap" → `market_cap`
- "24h Volume" → `volume`
- "Rank" → `market_cap_rank`
- "Circulating Supply" → `circulating_supply`
- "Total Supply" → `total_supply`
- "Max Supply" → `max_supply`
- "All-Time High" → `ath`
- "All-Time Low" → `atl`

---

## Implementation Notes

- Use HelpIcon component for consistent styling
- Place help icons inline with metric labels
- Ensure tooltips don't break existing layouts
- Test on different screen sizes
- Verify accessibility (keyboard navigation, screen readers)

---

## Acceptance Criteria Checklist

- [x] Tooltips added to CoinMetrics component
- [x] Tooltips added to ComparisonTable component
- [x] Tooltips added to AssetMetricsPanel component
- [x] Tooltips added to market overview components (MarketMetricCard)
- [x] All tooltips use HelpIcon component
- [x] Layouts don't break with tooltips
- [x] E2E tests written
- [x] Keyboard navigation works
- [x] Tooltip content is correct

## Implementation Summary

### Components Modified

1. **CoinMetrics.tsx** - Added HelpIcon to 8 metrics
2. **ComparisonTable.tsx** - Added HelpIcon to 9 metric headers
3. **AssetMetricsPanel/index.tsx** - Added HelpIcon to 7 metrics
4. **MarketMetricCard.tsx** - Added tooltipKey prop support
5. **MarketMetricsGrid.tsx** - Added tooltip keys to Market Cap and Volume

### E2E Tests Created

- `educational-tooltips.spec.ts` - Comprehensive E2E tests covering:
  - Coin Detail Page tooltips
  - Comparison Page tooltips
  - Portfolio Page tooltips
  - Market Overview tooltips
  - Keyboard navigation

### Metrics with Tooltips

- **CoinMetrics**: Market Cap, Volume, Circulating/Total/Max Supply, ATH, ATL, 7d/30d Change
- **ComparisonTable**: All 9 comparison metrics
- **AssetMetricsPanel**: Market Cap, Rank, Volume, ATH, ATL, Supply metrics
- **MarketMetricCard**: Market Cap, Volume

### Build Status

✅ TypeScript compilation successful
✅ No linting errors
✅ All components properly typed
