# Manual Testing Guide: KI-04 Navigation State Preservation

## Current Implementation Status

### ✅ Completed
1. **useScrollRestoration hook** - Created at `frontend/src/hooks/useScrollRestoration.ts`
2. **useFilterSort hook enhanced** - Modified to support URL params
3. **PortfolioPage updated** - Integrated scroll restoration and URL params
4. **E2E tests created** - Comprehensive test suite with test data setup

### 🔍 Testing Required
The feature needs manual verification to ensure it works correctly.

---

## How to Test Manually

### Setup
1. Start the dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open browser to `http://localhost:5173/portfolio`

3. **Add test assets** (if portfolio is empty):
   - Click "Add Asset"
   - Add Bitcoin (quantity: 1)
   - Add Ethereum (quantity: 10)
   - Add Cardano (quantity: 1000)

---

## Test 1: URL Params for Filter

**Steps:**
1. Go to portfolio page: `http://localhost:5173/portfolio`
2. Type "bit" in the search/filter input
3. **Check:** URL should change to `http://localhost:5173/portfolio?filter=bit`
4. **Check:** Asset list should show only filtered results
5. Clear the filter
6. **Check:** URL should change back to `http://localhost:5173/portfolio` (no filter param)

**Expected Behavior:**
- URL updates immediately as you type
- Filter param appears in URL
- Filter param is removed when cleared

**Debug if not working:**
```javascript
// Open browser console and check:
console.log(window.location.href); // Should show URL with params
```

---

## Test 2: URL Params for Sort

**Steps:**
1. Go to portfolio page: `http://localhost:5173/portfolio`
2. Change sort dropdown to "Value ⬇" (value-desc)
3. **Check:** URL should change to `http://localhost:5173/portfolio?sort=value-desc`
4. **Check:** Asset list should be sorted by value descending
5. Change sort back to "Name A–Z" (name-asc)
6. **Check:** URL should change back to `http://localhost:5173/portfolio` (no sort param)

**Expected Behavior:**
- URL updates when sort changes
- Sort param appears in URL
- Sort param is removed when set to default (name-asc)

---

## Test 3: Scroll Position Restoration

**Steps:**
1. Go to portfolio page: `http://localhost:5173/portfolio`
2. Scroll down the page (scroll position ~500px)
3. Click the 🔍 icon on any asset to view details
4. Wait for coin details page to load
5. Click browser back button
6. **Check:** Page should scroll back to ~500px position

**Expected Behavior:**
- Scroll position is restored within ±100px of original position
- Restoration happens smoothly after page loads

**Debug if not working:**
```javascript
// Before navigating away, check sessionStorage:
sessionStorage.getItem('scroll-portfolio'); // Should show scroll position

// After navigating back:
window.scrollY; // Should match saved position
```

---

## Test 4: Combined Filter + Sort + Scroll

**Steps:**
1. Go to portfolio page
2. Type "coin" in filter
3. Change sort to "Value ⬇"
4. Scroll down to position ~500px
5. **Check:** URL should be `http://localhost:5173/portfolio?filter=coin&sort=value-desc`
6. Click any asset to view details
7. Click browser back button
8. **Check:** Filter still shows "coin"
9. **Check:** Sort still shows "Value ⬇"
10. **Check:** Scroll position is restored

**Expected Behavior:**
- All three states (filter, sort, scroll) are preserved
- URL contains both filter and sort params
- Page returns to exact state before navigation

---

## Test 5: Page Refresh Preserves State

**Steps:**
1. Go to portfolio page
2. Type "bitcoin" in filter
3. Change sort to "Value ⬆"
4. **Check:** URL is `http://localhost:5173/portfolio?filter=bitcoin&sort=value-asc`
5. Press F5 or Cmd+R to refresh page
6. **Check:** Filter still shows "bitcoin"
7. **Check:** Sort still shows "Value ⬆"
8. **Check:** URL still has params

**Expected Behavior:**
- Filter and sort state survive page refresh
- URL params are source of truth

---

## Common Issues & Debugging

### Issue 1: URL Params Not Updating

**Possible Causes:**
1. useFilterSort not called with `useUrlParams: true`
2. React Router not wrapping the app correctly

**Check:**
```typescript
// In PortfolioPage.tsx, verify:
useFilterSort(portfolio, "name-asc", "", true); // ← true is important
```

**Debug in Console:**
```javascript
// Check if useSearchParams is working:
const params = new URLSearchParams(window.location.search);
params.get('filter'); // Should return filter value
params.get('sort'); // Should return sort value
```

---

### Issue 2: Scroll Not Restoring

**Possible Causes:**
1. Content not fully loaded before scroll restoration
2. sessionStorage not being set
3. Timing issue with setTimeout

**Check:**
```typescript
// In useScrollRestoration.ts, verify setTimeout is 100ms:
setTimeout(() => {
  requestAnimationFrame(() => {
    window.scrollTo(0, position);
  });
}, 100); // ← Should be 100ms or higher
```

**Debug in Console:**
```javascript
// Before navigating away:
console.log('Saving scroll:', window.scrollY);
console.log('SessionStorage:', sessionStorage.getItem('scroll-portfolio'));

// After navigating back:
console.log('Restoring scroll from:', sessionStorage.getItem('scroll-portfolio'));
console.log('Current scroll:', window.scrollY);
```

---

### Issue 3: State Not Preserved on Back Navigation

**Possible Causes:**
1. URL params not being read on mount
2. Component remounting instead of updating

**Check:**
```typescript
// In useFilterSort.ts, verify URL params are read:
const urlSort = searchParams.get('sort') || initialSort;
const urlFilter = searchParams.get('filter') || initialFilter;

// Initial state should use URL params when useUrlParams is true:
const [sortOption, setSortOption] = useState(useUrlParams ? urlSort : initialSort);
const [filterText, setFilterText] = useState(useUrlParams ? urlFilter : initialFilter);
```

---

## Browser Console Debugging Commands

```javascript
// Check current URL params
console.log('URL:', window.location.href);
console.log('Params:', new URLSearchParams(window.location.search).toString());

// Check sessionStorage
console.log('Scroll saved:', sessionStorage.getItem('scroll-portfolio'));

// Check current scroll position
console.log('Current scroll:', window.scrollY);

// Manually test scroll restoration
sessionStorage.setItem('scroll-portfolio', '500');
window.location.reload();

// Check if useFilterSort is updating URL
// (Add this temporarily to PortfolioPage.tsx)
useEffect(() => {
  console.log('Filter:', filterText, 'Sort:', sortOption);
  console.log('URL:', window.location.href);
}, [filterText, sortOption]);
```

---

## Expected Test Results

| Test | Expected Result | Status |
|------|----------------|--------|
| URL params for filter | ✅ URL updates with ?filter=value | ⏳ Test |
| URL params for sort | ✅ URL updates with ?sort=value | ⏳ Test |
| Scroll restoration | ✅ Scroll position restored ±100px | ⏳ Test |
| Combined state | ✅ All states preserved | ⏳ Test |
| Page refresh | ✅ Filter/sort survive refresh | ⏳ Test |

---

## Next Steps After Manual Testing

1. **If tests pass:** 
   - Remove `test.only` from E2E tests
   - Run full E2E suite
   - Commit changes
   - Create PR

2. **If tests fail:**
   - Note which specific test failed
   - Check browser console for errors
   - Review implementation in failing component
   - Share console logs and error messages

---

## Files to Review if Issues Occur

1. **`frontend/src/hooks/useScrollRestoration.ts`** - Scroll save/restore logic
2. **`frontend/src/hooks/useFilterSort.ts`** - URL params integration
3. **`frontend/src/pages/PortfolioPage.tsx`** - Hook usage (lines 40, 151)
4. **`frontend/src/components/FilterSortControls/index.tsx`** - Input/select handlers

---

## Quick Fix Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Portfolio has at least 3 assets
- [ ] Browser console is open (F12)
- [ ] No console errors on page load
- [ ] React DevTools shows PortfolioPage component
- [ ] URL bar is visible to see param changes
- [ ] Network tab shows no failed requests

---

**Last Updated:** January 4, 2025  
**Branch:** crp-29-t4  
**Status:** Ready for Manual Testing
