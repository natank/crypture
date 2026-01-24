# Implementation Plan: Story 3 - Overlaid Price Charts

**Story**: Overlaid Price Charts  
**Estimated Effort**: 3-4 hours

---

## Task List

- [x] **Task 1**: Create `ComparisonChart.tsx` component structure
- [x] **Task 2**: Implement price normalization function
- [x] **Task 3**: Define color palette for coin lines
- [x] **Task 4**: Implement multi-line Recharts configuration
- [x] **Task 5**: Add time range selector buttons
- [x] **Task 6**: Implement custom tooltip for multi-coin display
- [x] **Task 7**: Add legend component
- [x] **Task 8**: Add loading and error states
- [x] **Task 9**: Integrate into `CoinComparisonPage.tsx`
- [x] **Task 10**: Fetch chart data for all selected coins in parallel

---

## Files to Create/Modify

### New Files
- `frontend/src/components/CoinComparison/ComparisonChart.tsx` - Overlaid chart

### Modified Files
- `frontend/src/components/CoinComparison/index.ts` - Add export
- `frontend/src/pages/CoinComparisonPage.tsx` - Integrate chart, manage chart data

---

## Implementation Notes

### Price Normalization
```typescript
interface NormalizedPoint {
  timestamp: number;
  [coinId: string]: number;  // percentage change
}

function normalizeChartData(
  coinId: string,
  data: PriceHistoryPoint[]
): { timestamp: number; value: number }[] {
  if (data.length === 0) return [];
  
  const basePrice = data[0].price;
  return data.map(point => ({
    timestamp: point.timestamp,
    value: ((point.price - basePrice) / basePrice) * 100
  }));
}
```

### Merging Data for Recharts
```typescript
// Merge normalized data from multiple coins into single array
function mergeChartData(
  coinDataMap: Map<string, NormalizedPoint[]>
): MergedDataPoint[] {
  // Align by timestamp, fill missing values with null
  // Return array suitable for Recharts
}
```

### Color Palette
```typescript
const COIN_COLORS = [
  '#5a31f4',  // Primary violet
  '#00bfa5',  // Accent teal
  '#f59e0b',  // Amber
];
```

### Recharts Structure
```tsx
<LineChart data={mergedData}>
  <XAxis dataKey="timestamp" />
  <YAxis tickFormatter={(v) => `${v}%`} />
  <Tooltip content={<CustomTooltip coins={coins} />} />
  <Legend />
  {coins.map((coin, i) => (
    <Line
      key={coin.id}
      dataKey={coin.id}
      stroke={COIN_COLORS[i]}
      name={coin.name}
      dot={false}
    />
  ))}
</LineChart>
```

### Custom Tooltip
```tsx
function CustomTooltip({ active, payload, coins }) {
  if (!active || !payload) return null;
  
  return (
    <div className="bg-surface p-3 rounded shadow-lg border">
      <p className="text-sm text-text-secondary mb-2">
        {formatDate(payload[0]?.payload.timestamp)}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}
```
