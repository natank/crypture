# Implementation Plan: Story 2 - Comparative Metrics Table

**Story**: Comparative Metrics Table  
**Estimated Effort**: 2-3 hours

---

## Task List

- [x] **Task 1**: Create `ComparisonTable.tsx` component structure
- [x] **Task 2**: Define metrics configuration array (label, accessor, formatter)
- [x] **Task 3**: Implement table header with coin images and names
- [x] **Task 4**: Implement metric rows with formatted values
- [x] **Task 5**: Add "best performer" highlighting logic
- [x] **Task 6**: Add loading skeleton state
- [x] **Task 7**: Add empty state UI
- [x] **Task 8**: Implement responsive horizontal scroll for mobile
- [x] **Task 9**: Integrate into `CoinComparisonPage.tsx`

---

## Files to Create/Modify

### New Files
- `frontend/src/components/CoinComparison/ComparisonTable.tsx` - Comparison table

### Modified Files
- `frontend/src/components/CoinComparison/index.ts` - Add export
- `frontend/src/pages/CoinComparisonPage.tsx` - Integrate table

---

## Implementation Notes

### Metrics Configuration
```typescript
interface MetricConfig {
  key: string;
  label: string;
  accessor: (coin: CoinDetails) => number | null;
  formatter: (value: number | null) => string;
  higherIsBetter: boolean;  // For highlighting best performer
}

const metricsConfig: MetricConfig[] = [
  {
    key: 'price',
    label: 'Price',
    accessor: (c) => c.market_data.current_price.usd,
    formatter: formatCurrency,
    higherIsBetter: true,
  },
  // ... more metrics
];
```

### Best Performer Logic
```typescript
function getBestPerformerIndex(
  coins: CoinDetails[],
  accessor: (c: CoinDetails) => number | null,
  higherIsBetter: boolean
): number {
  const values = coins.map(accessor);
  const validValues = values.filter(v => v !== null) as number[];
  if (validValues.length === 0) return -1;
  
  const best = higherIsBetter 
    ? Math.max(...validValues) 
    : Math.min(...validValues);
  return values.indexOf(best);
}
```

### Table Structure
```html
<div class="overflow-x-auto">
  <table>
    <thead>
      <tr>
        <th>Metric</th>
        <th>Bitcoin</th>
        <th>Ethereum</th>
        <th>...</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Price</td>
        <td class="best">$67,234</td>
        <td>$3,456</td>
      </tr>
      ...
    </tbody>
  </table>
</div>
```
