# Asset Row Expansion State Preservation - Follow-up to KI-04

I need you to extend the navigation state preservation solution (KI-04) to handle asset row expansion state.

Applicable Docs: 
- `1 - `../`KI-04-Page-State-Not- Preserved-on-Navigation/pr-description-navigation-state-preservation.md`


**Context:** 
- We've already implemented state preservation for scroll position, filters, and sort (KI-04)
- This is a follow-up to maintain the same architectural approach
- Assets can be expanded to show additional details (see screenshot)

**New Requirement:**
```
When navigating from Portfolio Dashboard → Coin Details → Back:
- Preserve which asset rows were expanded/collapsed
- User should return to see the same expansion state they left
```

**IMPORTANT: Follow the same structured process. Do NOT jump to implementation.**

---

## Phase 1: Integration Analysis (No need to stop for review after this phase. may proceed directly to phase 2)

1. **Review Existing Solution**
   - How does the current KI-04 implementation preserve state?
   - What mechanism/pattern was used? (location state, session storage, etc.)
   - Where is the preservation/restoration logic located?
   - Show the relevant code sections

2. **Current Expansion State Analysis**
   - Locate the component(s) managing asset row expansion
   - How is expansion state currently stored? (component state, array, object?)
   - What triggers expansion/collapse? (click handler, etc.)
   - Document the current data structure for expansion state

3. **Integration Points**
   - Where should expansion state be added to the existing preservation mechanism?
   - Will this require changes to the existing state schema?
   - Are there any conflicts or complications with the current approach?

**DELIVERABLE:** Analysis report showing:
- Current KI-04 implementation summary
- Current expansion state management
- Integration touchpoints
**Proceed to phase 2 if you have no questions or comments.**

---

## Phase 2: Approach Options (STOP for review after this)

Given the existing KI-04 architecture, evaluate approaches for adding expansion state:

**Constraint: Maintain architectural consistency with KI-04 solution**

For each approach, analyze:
- **Consistency with existing solution** (critical)
- **Implementation complexity** (files/LOC to modify)
- **Performance impact** (serialization size, restoration speed)
- **Edge cases** (what if asset list changes between navigation?)
- **Testing additions required**

Consider options like:
1. **Direct Extension** - Add expansion state to existing state object
2. **Separate Mechanism** - Handle expansion state differently (explain why this would be better/worse)
3. **Hybrid Approach** - Combine with existing but with special handling

**DELIVERABLE:** 
- Comparison of approaches with STRONG preference for consistency
- Recommended approach with rationale
- Highlight any deviations from KI-04 pattern (and justify why necessary)
**WAIT for my review before proceeding.**

---

## Phase 3: Detailed Design (No need to stop for review after this)

Based on the approved approach:

1. **Updated State Schema**
   - Show existing KI-04 state structure
   - Show NEW state structure with expansion state added
   - TypeScript interfaces/types

2. **Implementation Plan**
   - Existing files to modify (with specific changes)
   - New code sections to add
   - Preservation logic changes
   - Restoration logic changes

3. **Component Changes**
   - Which components need updates?
   - Where to capture expansion state?
   - Where to restore expansion state?
   - Lifecycle/effect changes needed

4. **Edge Cases & Handling**
   - Asset list changes between navigation (added/removed coins)
   - What if expanded asset is no longer in the list?
   - Multiple assets expanded simultaneously
   - Performance with many expanded rows

5. **Testing Strategy**
   - E2E test scenarios to add/modify
   - How to verify expansion state is preserved
   - Edge case test scenarios
   - Integration with existing KI-04 tests

**DELIVERABLE:** 
- Complete implementation specification
- Code examples showing integration with existing solution
- Test plan additions
**No need to WAIT for my final approval before implementation.**

---

## Constraints & Requirements

- **MUST maintain consistency with KI-04 implementation**
- No new dependencies unless absolutely necessary
- Should not impact performance noticeably
- Must handle edge cases gracefully (degraded experience OK, no errors)
- Should be testable via E2E tests
- TypeScript type safety maintained

## Success Criteria

The solution is successful if:
- [ ] Expansion state preserved on navigation back
- [ ] Consistent with existing KI-04 architecture
- [ ] No regression to existing state preservation
- [ ] Handles edge cases without errors
- [ ] Minimal code changes required
- [ ] Clear and maintainable implementation

## Output Format

For each phase:
- Reference existing KI-04 code clearly
- Use code diffs to show changes
- Highlight integration points
- Use mermaid diagrams for flows
- Provide specific file paths

**Remember: STOP at the end of each phase and WAIT for my explicit approval to continue.**

## Visual Reference

See uploaded screenshot showing expanded asset row with:
- Price extremes (ATH/ATL)
- Market position data
- Supply info
- Price history chart with timeframe tabs (7D, 30D, 1Y)

This expanded view state needs to be preserved.