# Story 2: Comparative Metrics Table

## User Story
**As a** crypto investor  
**I want to** see key metrics displayed side-by-side for selected coins  
**So that** I can quickly compare their performance and fundamentals

## Acceptance Criteria

1. **Metrics Display**
   - [ ] Display comparison table with metrics as rows, coins as columns
   - [ ] Show the following metrics:
     - Current price
     - Market cap
     - 24h volume
     - 24h price change %
     - 7d price change %
     - 30d price change %
     - All-time high (with date)
     - All-time low (with date)
     - Circulating supply
     - Total supply
     - Max supply

2. **Visual Indicators**
   - [ ] Highlight best performer for each metric (e.g., highest market cap, best 24h change)
   - [ ] Use green/red colors for positive/negative changes
   - [ ] Show coin images and names in column headers

3. **Responsive Layout**
   - [ ] Table scrolls horizontally on mobile
   - [ ] Metric labels remain visible while scrolling
   - [ ] Touch-friendly tap targets

4. **States**
   - [ ] Loading skeleton while fetching data
   - [ ] Empty state when no coins selected
   - [ ] Error handling for failed fetches

## Technical Notes
- Reuse formatting utilities from `CoinMetrics.tsx`
- Use existing `CoinDetails` type for data structure
- Follow existing table patterns in the codebase

## Dependencies
- Story 1 (page structure and coin selection)
- Existing `CoinDetails` type and `fetchCoinDetails` service

## Traceability
- **Requirement**: FR-2 (Comparative Metrics Display)
- **Backlog Item**: 27
