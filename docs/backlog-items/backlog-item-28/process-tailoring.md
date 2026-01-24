# Process Tailoring

**Backlog Item**: 28 - Educational Tooltips & Contextual Help  
**Assessed Complexity**: **Medium**

---

## Justification

This backlog item is assessed as **Medium** complexity based on:

| Criteria           | Assessment                                                                          |
| ------------------ | ----------------------------------------------------------------------------------- |
| Components         | Multiple: New reusable tooltip component, help icon, content store                  |
| Patterns           | Known: Follows existing Icon component pattern, accessibility utilities             |
| Estimated Lines    | ~150-250 lines of new code                                                          |
| Integration Points | Multiple: CoinMetrics, AssetRow, CoinDetailPage, ComparisonTable, Market components |
| Risk               | Low: Tooltips are a common UI pattern, no external dependencies                     |

**Why not Simple?**

- Requires new reusable component with proper accessibility
- Multiple integration points across different components
- Content store/type definitions needed for maintainability
- Need to ensure consistent UX across all tooltip instances

**Why not Complex?**

- No new architectural patterns
- Leverages existing design system and accessibility utilities
- No API integration (static content)
- No external dependencies beyond existing ones
- Straightforward implementation following common tooltip patterns

---

## Tailored Deliverables

- [x] Requirements Analysis: **Yes** (completed)
- [x] Preliminary Design: **Yes** (needed for component design and integration strategy)
- [x] Detailed Design: **Skip** (not needed for medium complexity)
- [ ] Stories: **2 stories** (to be created)

---

## Tailored Tasks

### Story 1: Tooltip Component & Content Infrastructure

- Create `EducationalTooltip.tsx` reusable component
- Create `TooltipContent.ts` with type definitions and content store
- Create `HelpIcon.tsx` standardized help icon component
- Implement accessibility features (keyboard navigation, ARIA labels)
- Add unit tests for tooltip component

### Story 2: Integration Across Components

- Integrate tooltips into `CoinMetrics` component
- Integrate tooltips into `AssetRow` component (portfolio page)
- Integrate tooltips into `CoinDetailPage` components
- Integrate tooltips into `ComparisonTable` component
- Add E2E tests for tooltip interactions

---

## Story Folders

```
docs/backlog-items/backlog-item-28/
├── requirements-analysis.md ✓
├── process-tailoring.md ✓
├── Preliminary Design/
│   └── preliminary-design-report.md (to be created)
├── story-1/
│   ├── story.md (to be created)
│   └── implementation-plan.md (to be created)
└── story-2/
    ├── story.md (to be created)
    └── implementation-plan.md (to be created)
```
