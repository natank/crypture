# Process Tailoring

## Backlog Item
- **ID**: 25
- **Title**: Daily Portfolio Summary & Insights
- **Requirement**: [REQ-013-notifications](../../requirements/REQ-013-notifications.md)

## Complexity Assessment

**Assessed Complexity**: ☐ Simple | ☑ Medium | ☐ Complex

### Criteria Evaluation

| Factor | Assessment |
|--------|------------|
| Number of components | 2-3 (SummaryCard, InsightsSection, container) |
| New patterns required | None - follows existing dashboard patterns |
| Estimated lines of code | 150-250 |
| External integrations | None - uses existing services |
| UI/UX complexity | Moderate - scannable card with metrics |

### Justification

This is a **Medium** complexity item because:
1. Builds on existing infrastructure (portfolioAnalyticsService, alertService)
2. Follows established UI patterns from PortfolioCompositionDashboard
3. Requires moderate UI work for clear, scannable summary layout
4. No new API integrations needed - reuses existing data
5. Limited scope - single card component with derived metrics

## Tailored Deliverables

| Deliverable | Required | Reason |
|-------------|----------|--------|
| Requirements Analysis | ☑ Yes | Clarify scope and acceptance criteria |
| Preliminary Design | ☑ Yes | Define UI layout and data flow |
| Detailed Design | ☐ Skip | Patterns are established |
| Story Breakdown | ☑ Yes (2 stories) | Separate UI from logic |

## Tailored Task List

### Phase: Design
- [ ] Create preliminary design with UI mockup
- [ ] Define data structures for summary metrics
- [ ] Identify reusable components

### Phase: Implementation

**Story 1: Summary Data & Logic**
- [ ] Create `useDailySummary` hook to compute metrics
- [ ] Add helper functions for top/worst performers
- [ ] Integrate with alertService for triggered alerts
- [ ] Write unit tests for summary calculations

**Story 2: Summary UI Component**
- [ ] Create `DailySummaryCard` component
- [ ] Implement responsive layout (mobile-first)
- [ ] Add dismiss/minimize functionality
- [ ] Ensure accessibility (ARIA labels, keyboard nav)
- [ ] Integrate into PortfolioPage
- [ ] Write E2E tests

### Phase: Testing
- [ ] Unit tests for useDailySummary hook
- [ ] E2E tests for summary card display
- [ ] Verify accessibility with axe audit
- [ ] Manual smoke test on mobile viewport

## Notes

- Reuse color scheme from PortfolioPerformanceChart (green/red for gains/losses)
- Consider localStorage for dismissal state persistence
- Summary should gracefully handle empty portfolio state
