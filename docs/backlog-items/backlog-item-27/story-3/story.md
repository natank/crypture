# Story 3: Overlaid Price Charts

## User Story
**As a** crypto investor  
**I want to** see price performance charts overlaid for selected coins  
**So that** I can visually compare their price movements over time

## Acceptance Criteria

1. **Chart Display**
   - [ ] Display line chart with all selected coins overlaid
   - [ ] Each coin has a distinct color
   - [ ] Legend shows coin name and color

2. **Price Normalization**
   - [ ] Normalize prices to percentage change from start of period
   - [ ] Y-axis shows "% Change" (e.g., -10%, 0%, +20%)
   - [ ] Allows meaningful comparison of coins with different price ranges

3. **Time Range Selection**
   - [ ] Time range buttons: 7D, 30D, 90D, 1Y
   - [ ] Default to 30D
   - [ ] Chart updates when time range changes

4. **Interactivity**
   - [ ] Tooltip shows values for all coins at hovered point
   - [ ] Responsive chart sizing

5. **States**
   - [ ] Loading state while fetching chart data
   - [ ] Handle partial data (some coins loaded, others pending)
   - [ ] Error state for failed fetches

## Technical Notes
- Use Recharts `LineChart` with multiple `Line` components
- Reuse `useAssetHistory` hook for fetching price data
- Normalize data before passing to chart

## Dependencies
- Story 1 (page structure and coin selection)
- Existing `useAssetHistory` hook
- Existing Recharts setup

## Traceability
- **Requirement**: FR-3 (Overlaid Price Charts)
- **Backlog Item**: 27
