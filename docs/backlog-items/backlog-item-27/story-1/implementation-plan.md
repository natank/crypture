# Implementation Plan: Story 1 - Comparison Page Structure & Coin Selection

**Story**: Comparison Page Structure & Coin Selection  
**Estimated Effort**: 3-4 hours

---

## Task List

- [x] **Task 1**: Create basic `CoinComparisonPage.tsx` with layout structure
- [x] **Task 2**: Add `/compare` route to `App.tsx`
- [x] **Task 3**: Create `CoinSelector.tsx` component for searching coins
- [x] **Task 4**: Create `SelectedCoinsBar.tsx` for displaying selected coins
- [x] **Task 5**: Implement comparison state management (selected coins, loading)
- [x] **Task 6**: Add "Compare" button to `CoinDetailPage.tsx`
- [x] **Task 7**: Create barrel export `components/CoinComparison/index.ts`
- [ ] **Task 8**: Add navigation link to comparison page (header or nav) - Deferred, accessible via CoinDetailPage

---

## Files to Create/Modify

### New Files
- `frontend/src/pages/CoinComparisonPage.tsx` - Main comparison page
- `frontend/src/components/CoinComparison/CoinSelector.tsx` - Coin search/select
- `frontend/src/components/CoinComparison/SelectedCoinsBar.tsx` - Selected coins display
- `frontend/src/components/CoinComparison/index.ts` - Barrel export

### Modified Files
- `frontend/src/App.tsx` - Add `/compare` route
- `frontend/src/pages/CoinDetailPage.tsx` - Add "Compare" button

---

## Implementation Notes

### CoinSelector Component
```typescript
interface CoinSelectorProps {
  onSelect: (coinId: string, coinName: string, coinImage: string) => void;
  excludeIds: string[];  // Already selected coins
  disabled?: boolean;    // When max coins reached
}
```

### SelectedCoinsBar Component
```typescript
interface SelectedCoin {
  id: string;
  name: string;
  image: string;
}

interface SelectedCoinsBarProps {
  coins: SelectedCoin[];
  onRemove: (coinId: string) => void;
  maxCoins: number;
}
```

### State Structure
```typescript
const [selectedCoins, setSelectedCoins] = useState<SelectedCoin[]>([]);
const [coinDetails, setCoinDetails] = useState<Map<string, CoinDetails>>(new Map());
const [isLoading, setIsLoading] = useState(false);
```
