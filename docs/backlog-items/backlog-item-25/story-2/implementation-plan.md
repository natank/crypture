# Implementation Plan - Story 2

## Story: Summary UI Component

**Description**: Create the `DailySummaryCard` component with responsive layout, dismiss functionality, and integrate it into the Portfolio page.

**Estimated Effort**: 3-4 hours

---

## Task List

- [ ] **TS2.1**: Create `DailySummaryCard` main component
- [ ] **TS2.2**: Create `PerformersSection` subcomponent
- [ ] **TS2.3**: Create `NotableEventsSection` subcomponent
- [ ] **TS2.4**: Implement dismiss functionality with localStorage persistence
- [ ] **TS2.5**: Add responsive styling (mobile/desktop)
- [ ] **TS2.6**: Integrate into `PortfolioPage.tsx`
- [ ] **TS2.7**: Add empty state for portfolios with no assets
- [ ] **TS2.8**: Write E2E tests for summary card

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/DailySummaryCard/index.tsx` | Create | Main card component |
| `src/components/DailySummaryCard/PerformersSection.tsx` | Create | Top/worst performers list |
| `src/components/DailySummaryCard/NotableEventsSection.tsx` | Create | Events feed |
| `src/pages/PortfolioPage.tsx` | Modify | Integrate summary card |
| `src/e2e/specs/features/daily-summary.spec.ts` | Create | E2E tests |

---

## Implementation Details

### TS2.1: `DailySummaryCard` structure

```tsx
<section
  data-testid="daily-summary-card"
  role="region"
  aria-labelledby="summary-heading"
  className="card mb-6"
>
  <header className="flex justify-between items-center">
    <h2 id="summary-heading">📊 Today's Summary</h2>
    <button onClick={onDismiss} aria-label="Dismiss today's summary">×</button>
  </header>
  
  <div className="summary-metrics">
    <PortfolioValueDisplay value={summary.portfolioValue} change={summary.change24h} />
  </div>
  
  <div className="performers-grid md:grid-cols-2">
    <PerformersSection title="Top Performers" items={summary.topPerformers} variant="positive" />
    <PerformersSection title="Needs Attention" items={summary.worstPerformers} variant="negative" />
  </div>
  
  {summary.notableEvents.length > 0 && (
    <NotableEventsSection events={summary.notableEvents} />
  )}
</section>
```

### TS2.4: Dismiss logic

```typescript
const STORAGE_KEY = 'crypture_summary_dismissed';

function useSummaryDismiss() {
  const [isDismissed, setIsDismissed] = useState(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) return false;
    return new Date(dismissed).toDateString() === new Date().toDateString();
  });

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setIsDismissed(true);
  }, []);

  return { isDismissed, dismiss };
}
```

---

## Acceptance Criteria

- [ ] Summary card displays on Portfolio page above performance chart
- [ ] Card shows total value and 24h change with correct colors
- [ ] Top 3 performers displayed with green indicators
- [ ] Worst 3 performers displayed with red indicators  
- [ ] Notable events section shows triggered alerts
- [ ] Dismiss button hides card until next day
- [ ] Dismissed state persists across page reloads
- [ ] Card is fully responsive on mobile
- [ ] All accessibility requirements met (ARIA, keyboard nav)
- [ ] E2E tests pass
