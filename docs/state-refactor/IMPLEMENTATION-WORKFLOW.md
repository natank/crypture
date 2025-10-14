# Implementation Workflow: Epic 01

**Quick reference guide for implementing the State Performance Optimization Epic**

---

## 🚀 Getting Started

### 1. Create Feature Branch

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create epic branch
git checkout -b epic/state-performance-optimization

# Push to remote
git push -u origin epic/state-performance-optimization
```

### 2. Set Up Performance Baseline

```bash
# Before making any changes, measure current performance
npm test  # Ensure all tests pass
npm start # Start dev server
```

**In Browser:**
1. Open React DevTools
2. Go to "Profiler" tab
3. Click "Record" (blue circle)
4. Perform action: Update 1 asset quantity
5. Click "Stop profiling"
6. Take screenshot and save as `docs/state-refactor/baseline-performance.png`
7. Note metrics:
   - Total render time
   - Number of components that rendered
   - Which components rendered

**Example baseline:**
```
Action: Update BTC quantity from 1.0 to 1.5
- Total renders: 43
- PortfolioPage: 1 render
- AssetList: 1 render
- AssetRow: 20 renders (all assets)
- Total time: ~45ms
```

---

## 📋 Story 3: Stabilize Event Callbacks (Day 1)

**Why first?** Stories 1 & 2 depend on stable callbacks to work properly.

### Task Checklist

- [ ] **T3.1** Import `useCallback` (2 min)
  ```bash
  # Edit file, add import, commit
  git add frontend/src/pages/PortfolioPage.tsx
  git commit -m "refactor(portfolio): import useCallback hook (T3.1)"
  ```

- [ ] **T3.2** Wrap `triggerHighlight` (10 min)
  ```bash
  npm test  # Verify tests pass
  git add frontend/src/pages/PortfolioPage.tsx
  git commit -m "refactor(portfolio): memoize triggerHighlight callback (T3.2)"
  ```

- [ ] **T3.3-T3.9** Wrap remaining callbacks (1.5 hours)
  ```bash
  # After each callback:
  npm test
  git add frontend/src/pages/PortfolioPage.tsx
  git commit -m "refactor(portfolio): memoize [callbackName] (T3.X)"
  ```

- [ ] **T3.10** Verify dependency arrays (20 min)
  ```bash
  # Check each useCallback dependencies
  # Ensure no missing deps
  ```

- [ ] **T3.11** Run ESLint (15 min)
  ```bash
  npm run lint
  # Fix any exhaustive-deps warnings
  git add .
  git commit -m "refactor(portfolio): fix dependency array warnings (T3.11)"
  ```

- [ ] **T3.12-T3.16** Manual testing (1 hour)
  ```bash
  npm start
  # Test each feature manually:
  # - Add asset
  # - Update asset
  # - Delete asset
  # - Export CSV/JSON
  # - Import merge/replace
  ```

- [ ] **T3.17** Verify callback stability (15 min)
  ```bash
  # Add console.log to verify same reference
  # Or use React DevTools to inspect props
  ```

- [ ] **T3.18** Run full test suite (5 min)
  ```bash
  npm test
  npm run test:e2e  # If you have e2e tests
  ```

- [ ] **Push Story 3**
  ```bash
  git push origin epic/state-performance-optimization
  ```

**Story 3 Complete! ✅**

---

## 📋 Story 1: Memoize AssetRow (Day 1-2)

### Task Checklist

- [ ] **T1.1** Import `memo` (5 min)
  ```bash
  git add frontend/src/components/AssetRow/index.tsx
  git commit -m "perf(assetrow): import memo from React (T1.1)"
  ```

- [ ] **T1.2** Wrap component with memo (10 min)
  ```bash
  npm test
  git add frontend/src/components/AssetRow/index.tsx
  git commit -m "perf(assetrow): wrap component with React.memo (T1.2)"
  ```

- [ ] **T1.3** Add comparison function (15 min)
  ```bash
  npm test
  git add frontend/src/components/AssetRow/index.tsx
  git commit -m "perf(assetrow): add custom comparison function (T1.3)"
  ```

- [ ] **T1.4-T1.6** Manual testing (30 min)
  ```bash
  npm start
  # Test:
  # - Edit quantity
  # - Delete asset
  # - Expand/collapse chart
  # - Verify highlight animation
  ```

- [ ] **T1.7** Measure with Profiler (15 min)
  ```bash
  # React DevTools Profiler:
  # 1. Record
  # 2. Update 1 asset
  # 3. Stop
  # 4. Verify only 1 AssetRow rendered (not all 20)
  # 5. Take screenshot
  ```

- [ ] **T1.8** Run tests (5 min)
  ```bash
  npm test
  ```

- [ ] **T1.9** Document improvement (10 min)
  ```bash
  # Add screenshot to docs/state-refactor/story1-results.md
  git add docs/state-refactor/story1-results.md
  git commit -m "docs(perf): document Story 1 performance improvements (T1.9)"
  ```

- [ ] **Push Story 1**
  ```bash
  git push origin epic/state-performance-optimization
  ```

**Story 1 Complete! ✅**

---

## 📋 Story 2: Optimize AssetList (Day 2)

### Task Checklist

- [ ] **T2.1** Import `useMemo` (2 min)
  ```bash
  git add frontend/src/components/AssetList/index.tsx
  git commit -m "perf(assetlist): import useMemo hook (T2.1)"
  ```

- [ ] **T2.2-T2.4** Create enriched assets memo (35 min)
  ```bash
  npm test
  git add frontend/src/components/AssetList/index.tsx
  git commit -m "perf(assetlist): memoize enriched assets calculation (T2.2-T2.4)"
  ```

- [ ] **T2.5-T2.7** Manual testing (30 min)
  ```bash
  npm start
  # Verify:
  # - Prices display correctly
  # - Values display correctly
  # - Missing prices show "—"
  # - Empty state works
  ```

- [ ] **T2.8** Measure memo effectiveness (15 min)
  ```bash
  # React DevTools Profiler:
  # 1. Open/close modal (triggers render)
  # 2. Verify AssetList doesn't recalculate
  # 3. Take screenshot
  ```

- [ ] **T2.9** Run tests (5 min)
  ```bash
  npm test
  ```

- [ ] **Push Story 2**
  ```bash
  git push origin epic/state-performance-optimization
  ```

**Story 2 Complete! ✅**

---

## 🎯 Epic Completion

### Final Performance Measurement

```bash
npm start
```

**In Browser:**
1. Open React DevTools Profiler
2. Record same action as baseline: Update 1 asset quantity
3. Stop profiling
4. Take screenshot and save as `docs/state-refactor/final-performance.png`
5. Compare with baseline

**Expected final metrics:**
```
Action: Update BTC quantity from 1.0 to 1.5
- Total renders: ~8 (was 43)
- PortfolioPage: 1 render
- AssetList: 1 render
- AssetRow: 1 render (only updated asset)
- Total time: ~12ms (was ~45ms)

Improvement:
- 81% fewer renders (43 → 8)
- 73% faster (45ms → 12ms)
```

### Create Performance Comparison Document

```bash
# Create comparison doc
cat > docs/state-refactor/PERFORMANCE-RESULTS.md << 'EOF'
# Performance Results: Epic 01

## Baseline (Before)
[Screenshot]
- Total renders: 43
- Render time: 45ms
- Efficiency: 10-20%

## Final (After)
[Screenshot]
- Total renders: 8
- Render time: 12ms
- Efficiency: 85-90%

## Improvement
- **81% reduction in renders**
- **73% faster render time**
- **4.5x better efficiency**

## Test Scenarios
1. Update 1 asset in portfolio of 20
2. Add new asset
3. Delete existing asset
4. Filter assets
5. Sort assets

All scenarios show similar improvements.
EOF

git add docs/state-refactor/PERFORMANCE-RESULTS.md
git commit -m "docs(perf): add Epic 01 performance results"
```

### Run Full Test Suite

```bash
# Unit tests
npm test

# E2E tests (if you have them)
npm run test:e2e

# Lint
npm run lint

# Build
npm run build
```

**All tests should pass! ✅**

---

## 🔀 Merge to Main

### Pre-merge Checklist

- [ ] All 3 stories complete
- [ ] All tasks checked off
- [ ] All tests passing
- [ ] Performance improvement validated (>70%)
- [ ] Documentation updated
- [ ] No console errors/warnings

### Merge Process

```bash
# Update local main
git checkout main
git pull origin main

# Merge epic branch
git checkout epic/state-performance-optimization
git rebase main  # Resolve any conflicts

# Final tests
npm test
npm run build

# Merge
git checkout main
git merge epic/state-performance-optimization

# Push
git push origin main

# Clean up
git branch -d epic/state-performance-optimization
git push origin --delete epic/state-performance-optimization
```

### Post-merge Validation

```bash
# Pull fresh main
git checkout main
git pull origin main

# Install & test
npm install
npm test
npm start

# Smoke test in browser:
# - Add asset
# - Update asset
# - Delete asset
# - Verify performance with Profiler
```

---

## 🐛 Troubleshooting

### Issue: Tests failing after memoization

**Cause:** Memoization changes component behavior in tests

**Fix:**
```tsx
// In tests, ensure props change to trigger re-render
const { rerender } = render(<AssetRow {...props} />);
rerender(<AssetRow {...props} quantity={2} />); // New value
```

### Issue: Callbacks still unstable

**Cause:** Missing or incorrect dependencies

**Fix:**
```bash
npm run lint  # Check for exhaustive-deps warnings
# Add missing dependencies to useCallback array
```

### Issue: Memo not working

**Cause:** Parent passes new object/function reference

**Fix:**
```tsx
// Ensure parent memoizes objects/functions
const config = useMemo(() => ({ ... }), [deps]);
const handler = useCallback(() => { ... }, [deps]);
```

### Issue: Performance not improved

**Cause:** Other components causing re-renders

**Fix:**
```bash
# Use React DevTools Profiler to identify culprit
# Check "Ranked" view to see slowest components
# Apply similar optimizations
```

---

## 📊 Daily Standup Template

**Format for updates:**

```
🎯 Epic: State Performance Optimization

Yesterday:
- ✅ Completed Story 3, Tasks T3.1-T3.18
- ✅ All callbacks now memoized
- ✅ Tests passing

Today:
- 📋 Starting Story 1 (Memoize AssetRow)
- 📋 Will complete Tasks T1.1-T1.9
- 📋 Target: Finish Story 1 by EOD

Blockers:
- ⚠️ None (or list any blockers)

Metrics:
- Story Points Completed: 5/13
- Stories Completed: 1/3
- Estimated Completion: Tomorrow
```

---

## 🎉 Sprint Review Demo Script

### 1. Show Problem (Before)

"Our app was re-rendering all 20 assets whenever we updated just 1 asset. Let me show you the Profiler..."

**[Show baseline screenshot]**

"You can see 43 components rendered, taking 45ms. That's 95% wasted work."

### 2. Show Solution (After)

"After our optimizations, updating 1 asset now only re-renders that asset..."

**[Show final screenshot]**

"Now only 8 components render, taking just 12ms. That's an 81% improvement."

### 3. Show Code Changes

"We made 3 key changes:

1. **Memoized AssetRow** - Prevents unchanged assets from re-rendering
2. **Optimized calculations** - Price/value computed once and cached
3. **Stabilized callbacks** - Function references stay consistent

All non-breaking changes, fully tested."

### 4. Demo Live

**[Live demo in browser]**

"Watch how smooth this is now with 20 assets..."
- Update quantity
- Add asset
- Delete asset
- Filter/sort

"Much more responsive!"

---

## 📝 Retrospective Discussion Points

### What Went Well?
- Incremental approach allowed safe progress
- Performance gains exceeded expectations (81% vs 70% target)
- Documentation helped guide implementation
- Git workflow kept changes organized

### What Could Be Improved?
- [Team fills in]
- Consider automated performance regression tests?
- Should we apply similar optimizations to other pages?

### Action Items
- [ ] Add performance budgets to CI/CD
- [ ] Document memoization patterns for future features
- [ ] Consider Lighthouse CI for performance monitoring

---

## 🎓 Learning Resources

### React Memoization
- [React.memo docs](https://react.dev/reference/react/memo)
- [useCallback docs](https://react.dev/reference/react/useCallback)
- [useMemo docs](https://react.dev/reference/react/useMemo)

### Performance Profiling
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Profiling guide](https://react.dev/learn/render-and-commit)

---

**Workflow Guide Created:** October 13, 2025  
**Epic:** State Performance Optimization  
**Estimated Duration:** 2 days  
**Target Sprint:** TBD
