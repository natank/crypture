# Story 1: Comparison Page Structure & Coin Selection

## User Story
**As a** crypto investor  
**I want to** select multiple coins for comparison  
**So that** I can evaluate different cryptocurrencies side-by-side

## Acceptance Criteria

1. **Comparison Page Route**
   - [ ] Navigate to `/compare` to access the comparison page
   - [ ] Page displays a header with "Compare Coins" title
   - [ ] Back navigation returns to previous page

2. **Coin Selection**
   - [ ] Search for coins by name or symbol
   - [ ] Select up to 3 coins for comparison
   - [ ] Display selected coins as chips/badges
   - [ ] Remove coins from selection with ✕ button

3. **Entry Points**
   - [ ] "Compare" button on Coin Detail Page adds coin and navigates to comparison
   - [ ] Empty state shows instructions when no coins selected

4. **State Management**
   - [ ] Selected coins persist during page session
   - [ ] Loading states shown while fetching coin data

## Technical Notes
- Reuse existing `fetchCoinDetails` service with caching
- Use existing coin search from market data if available
- Follow existing page patterns from `CoinDetailPage.tsx`

## Dependencies
- Existing `fetchCoinDetails` service
- Existing routing setup in `App.tsx`

## Traceability
- **Requirement**: FR-1 (Coin Selection for Comparison)
- **Backlog Item**: 27
