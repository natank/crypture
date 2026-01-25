# E2E Test Mock Migration for Backend Proxy

## Overview

After migrating from direct CoinGecko API calls to backend proxy, E2E tests need to mock the new proxy endpoints instead of direct API calls.

## Changes Required

### ✅ Completed

- `src/e2e/mocks/coinGecko.ts` - Updated to use `/api/coingecko/**` paths
- `src/e2e/mocks/mockCoinGecko.ts` - Partially updated (3 functions)

### ⚠️ Remaining Work

The following test files still use old API paths and need updating:

#### Pattern to Replace:

- **OLD**: `**/api/v3/**` or `**/api.coingecko.com/api/v3/**`
- **NEW**: `**/api/coingecko/**`

#### Response Format:

Backend proxy wraps responses in:

```json
{
  "data": <original_response>,
  "timestamp": "2026-01-25T...",
  "requestId": "..."
}
```

#### Files Needing Updates:

1. **src/e2e/mocks/mockCoinGecko.ts** (remaining functions):
   - `mockCoinGeckoGlobal()` - Line 153
   - `mockCoinGeckoCategories()` - Line 186
   - `mockCoinGeckoCoinDetails()` - Lines 214, 273

2. **src/e2e/specs/flows/**:
   - `retry-reenable-controls.spec.ts` - Line 6
   - `refreshing-disabled-controls.spec.ts` - Lines 6, 12

3. **src/e2e/specs/features/**:
   - `category-exploration.spec.ts` - Lines 53, 62
   - `value-calculation.spec.ts` - Line 56
   - `coin-comparison.spec.ts` - Lines 70, 79, 89, 99, 108
   - `market-overview.spec.ts` - Lines 24, 75, 97, 109

## Migration Steps

For each file:

1. **Update route pattern**:

   ```typescript
   // OLD
   await page.route('**/api/v3/coins/markets*', ...)

   // NEW
   await page.route('**/api/coingecko/coins/markets*', ...)
   ```

2. **Update response format**:

   ```typescript
   // OLD
   route.fulfill({
     status: 200,
     contentType: 'application/json',
     body: JSON.stringify(data),
   });

   // NEW
   route.fulfill({
     status: 200,
     contentType: 'application/json',
     body: JSON.stringify({
       data: data,
       timestamp: new Date().toISOString(),
       requestId: 'mock-request-id',
     }),
   });
   ```

## Testing After Migration

Run E2E tests to verify:

```bash
npm run test:e2e
```

Expected result: All 169 tests should pass with mocked backend proxy responses.

## Current Status

- **Unit Tests**: ✅ 520/520 passing
- **E2E Tests**: ⚠️ 166/169 failing (need mock migration)
- **T3.3 Core Functionality**: ✅ Complete (backend proxy integration working)

## Notes

- This work is **not blocking T3.3 deployment**
- Frontend-backend integration is functional in production
- E2E test fixes can be completed in a follow-up task
- Consider creating a helper function to standardize proxy response wrapping
