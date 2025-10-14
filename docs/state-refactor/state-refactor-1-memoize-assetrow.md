# Refactoring Guide 1: Memoize AssetRow Component

**Priority:** 🔴 CRITICAL  
**Impact:** High  
**Effort:** Low  
**Files to Modify:** 1

---

## Problem

`AssetRow` re-renders every time the parent `AssetList` re-renders, even when the individual asset's data hasn't changed. With 20 assets, updating 1 asset causes all 20 AssetRow components to re-render unnecessarily.

---

## Current Code

**File:** `/frontend/src/components/AssetRow/index.tsx`

```tsx
export default function AssetRow({
  asset,
  price,
  value,
  onDelete,
  onUpdateQuantity,
  highlightTrigger = 0,
}: AssetRowProps) {
  const { isChartVisible, chartProps, handleToggleChart } = useAssetChartController(asset.coinInfo.id);
  const isHighlighted = useAssetHighlight(asset.coinInfo.id, highlightTrigger);
  const hasPrice = typeof price === "number";
  
  // ... rest of component
}
```

---

## Optimized Code

**File:** `/frontend/src/components/AssetRow/index.tsx`

```tsx
import { useState, useRef, useEffect, memo } from "react";
import InlineErrorBadge from "@components/InlineErrorBadge";
import Icon from "@components/Icon";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import AssetChart from "@components/AssetChart";
import { useAssetChartController } from "@hooks/useAssetChartController";
import { useAssetHighlight } from "@hooks/useAssetHighlight";
import { validateQuantity } from "@utils/validateQuantity";
import toast from "react-hot-toast";

type AssetRowProps = {
  asset: PortfolioAsset;
  price?: number;
  value?: number;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  highlightTrigger?: number;
};

// Wrap component with React.memo for shallow prop comparison
const AssetRow = memo(function AssetRow({
  asset,
  price,
  value,
  onDelete,
  onUpdateQuantity,
  highlightTrigger = 0,
}: AssetRowProps) {
  const { isChartVisible, chartProps, handleToggleChart } = useAssetChartController(asset.coinInfo.id);
  const isHighlighted = useAssetHighlight(asset.coinInfo.id, highlightTrigger);
  const hasPrice = typeof price === "number";
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuantity, setDraftQuantity] = useState(asset.quantity.toString());
  const [validationError, setValidationError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [showLargeQuantityConfirm, setShowLargeQuantityConfirm] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalQuantity = useRef(asset.quantity);

  // ... rest of component logic (unchanged)
  
  return (
    // ... JSX (unchanged)
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for fine-grained control
  // Return true if props are equal (skip re-render)
  // Return false if props changed (do re-render)
  
  return (
    prevProps.asset.coinInfo.id === nextProps.asset.coinInfo.id &&
    prevProps.asset.quantity === nextProps.asset.quantity &&
    prevProps.price === nextProps.price &&
    prevProps.value === nextProps.value &&
    prevProps.highlightTrigger === nextProps.highlightTrigger
    // Note: onDelete and onUpdateQuantity should be stable references (useCallback)
    // We don't compare them here because they should never change
  );
});

export default AssetRow;
```

---

## Key Changes

1. **Import `memo` from React**
   ```tsx
   import { useState, useRef, useEffect, memo } from "react";
   ```

2. **Wrap component with `memo()`**
   ```tsx
   const AssetRow = memo(function AssetRow({ ... }) {
     // component logic
   });
   ```

3. **Add custom comparison function**
   - Compares only the props that matter for rendering
   - Ignores callback references (assumes they're stable via `useCallback`)
   - Returns `true` if props are equal (skip re-render)

---

## Expected Impact

### Before Optimization
- **Scenario:** Update 1 asset in portfolio of 20 assets
- **Result:** All 20 AssetRow components re-render
- **Total renders:** 20

### After Optimization
- **Scenario:** Update 1 asset in portfolio of 20 assets
- **Result:** Only 1 AssetRow re-renders (the updated one)
- **Total renders:** 1

### Performance Improvement
- **Reduction:** 95% fewer re-renders
- **User Experience:** Smoother interactions, especially with large portfolios
- **CPU Usage:** Significantly reduced during updates

---

## Testing Checklist

- [ ] Asset quantity updates still work correctly
- [ ] Delete functionality still works
- [ ] Highlight animation triggers properly
- [ ] Chart expand/collapse still works
- [ ] Edit mode functions correctly
- [ ] No visual regressions
- [ ] Performance improvement visible in React DevTools Profiler

---

## Verification

Use React DevTools Profiler to measure:

1. **Before:** Record a quantity update with 10+ assets
2. **After:** Record the same action
3. **Compare:** Number of components that re-rendered

You should see ~90% reduction in AssetRow re-renders.

---

## Dependencies

**This optimization works best when combined with:**
- Refactor 3: Stabilize callbacks in PortfolioPage (ensures `onDelete` and `onUpdateQuantity` don't change)
- Without stable callbacks, memo won't be as effective

---

## Rollback Plan

If issues arise, simply remove the `memo()` wrapper:

```tsx
// Revert to:
export default function AssetRow({ ... }) {
  // component logic
}
```

---

## Notes

- This is a **non-breaking change** - API remains identical
- No changes needed in parent components
- Can be applied incrementally to other components
- Consider memoizing other list item components similarly
