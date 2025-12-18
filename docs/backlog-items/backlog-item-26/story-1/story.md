# Story 1: Core Coin Detail Page Structure

## Description
As a user, I want to view a dedicated page for any cryptocurrency so that I can see detailed information about it in one place.

## Acceptance Criteria
- [ ] Route `/coin/:coinId` exists and renders `CoinDetailPage`
- [ ] Page displays coin header with name, symbol, image, and current price
- [ ] Loading state shown while fetching data
- [ ] Error state shown if coin not found or API fails
- [ ] Page is responsive (mobile-friendly)

## Technical Tasks
1. Create `CoinDetails` type in `types/market.ts`
2. Create `fetchCoinDetails` function in `coinService.ts`
3. Create `useCoinDetails` hook
4. Create `CoinDetailPage.tsx` component
5. Add route to `App.tsx`

## Traceability
- **Requirement**: FR-1 (Detailed Coin Page)
- **Backlog Item**: 26

## Estimated Effort
2-3 hours
