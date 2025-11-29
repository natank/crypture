# Implementation Plan - Story 1

## Story: Summary Data & Logic

**Description**: Create the `useDailySummary` hook and supporting functions to compute daily portfolio metrics, top/worst performers, and notable events.

**Estimated Effort**: 2-3 hours

---

## Task List

- [ ] **TS1.1**: Add `getAssetPerformance24h()` helper to `portfolioAnalyticsService.ts`
- [ ] **TS1.2**: Create `useDailySummary` hook with core calculations
- [ ] **TS1.3**: Integrate triggered alerts from `alertService` for notable events
- [ ] **TS1.4**: Add detection for significant price moves (>10%)
- [ ] **TS1.5**: Write unit tests for `useDailySummary` hook
- [ ] **TS1.6**: Write unit tests for `getAssetPerformance24h()`

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/hooks/useDailySummary.ts` | Create | Main hook for summary data |
| `src/services/portfolioAnalyticsService.ts` | Modify | Add `getAssetPerformance24h()` |
| `src/types/summary.ts` | Create | Type definitions for summary data |
| `src/__tests__/hooks/useDailySummary.test.ts` | Create | Unit tests for hook |

---

## Implementation Details

### TS1.1: `getAssetPerformance24h()`

```typescript
export function getAssetPerformance24h(
  portfolio: PortfolioAsset[],
  coinMetadata: Record<string, CoinMetadata>,
  priceMap: Record<string, number>
): AssetPerformance[] {
  return portfolio
    .map(asset => {
      const meta = coinMetadata[asset.coinInfo.id];
      const price = priceMap[asset.coinInfo.id] || 0;
      return {
        coinId: asset.coinInfo.id,
        coinSymbol: asset.coinInfo.symbol,
        coinName: asset.coinInfo.name,
        change24hPercent: meta?.price_change_percentage_24h ?? 0,
        currentValue: asset.quantity * price,
      };
    })
    .filter(a => a.change24hPercent !== 0);
}
```

### TS1.2: `useDailySummary` hook skeleton

```typescript
export function useDailySummary(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  totalValue: number
): DailySummary {
  // 1. Calculate 24h change from history or metadata
  // 2. Get top 3 performers (sorted by change24h desc)
  // 3. Get bottom 3 performers (sorted by change24h asc)
  // 4. Compile notable events
  // 5. Return DailySummary object
}
```

---

## Acceptance Criteria

- [ ] `useDailySummary` returns valid summary for portfolio with assets
- [ ] `useDailySummary` returns empty state for empty portfolio
- [ ] Top performers are sorted correctly (highest gains first)
- [ ] Worst performers are sorted correctly (biggest losses first)
- [ ] Notable events include today's triggered alerts
- [ ] All unit tests pass
