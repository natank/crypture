# Implementation Plan: Story 1 - Tooltip Component & Content Infrastructure

## Story

**Story 1**: Tooltip Component & Content Infrastructure

## Estimated Effort

4-6 hours

---

## Task List

### Task 1: Create TooltipContent.ts

- [ ] Define `TooltipKey` type with all educational terms
- [ ] Define `TooltipContent` interface
- [ ] Create `TOOLTIP_CONTENT` object with all content
- [ ] Add helper function to get content by key
- [ ] Ensure content is clear, beginner-friendly, and concise

### Task 2: Create EducationalTooltip.tsx Component

- [ ] Create component with props interface
- [ ] Implement tooltip visibility state management
- [ ] Implement positioning logic (auto-position to stay in viewport)
- [ ] Add hover/focus event handlers
- [ ] Add keyboard support (ESC to dismiss)
- [ ] Add ARIA attributes for accessibility
- [ ] Style tooltip using design system tokens
- [ ] Handle mobile touch events (tap to toggle)

### Task 3: Create HelpIcon.tsx Component

- [ ] Create component that wraps EducationalTooltip
- [ ] Use consistent help icon (ⓘ or ?)
- [ ] Ensure keyboard accessibility
- [ ] Apply design system styling
- [ ] Ensure touch-friendly size (44x44px minimum)

### Task 4: Write Unit Tests

- [ ] Test TooltipContent structure and content retrieval
- [ ] Test EducationalTooltip visibility toggle
- [ ] Test EducationalTooltip keyboard navigation
- [ ] Test EducationalTooltip positioning
- [ ] Test HelpIcon integration
- [ ] Test accessibility attributes

---

## Files to Create/Modify

### New Files

- `frontend/src/components/EducationalTooltip/TooltipContent.ts` - Content store
- `frontend/src/components/EducationalTooltip/EducationalTooltip.tsx` - Main tooltip component
- `frontend/src/components/EducationalTooltip/HelpIcon.tsx` - Help icon wrapper
- `frontend/src/components/EducationalTooltip/index.ts` - Barrel export
- `frontend/src/__tests__/components/EducationalTooltip/TooltipContent.test.ts` - Content tests
- `frontend/src/__tests__/components/EducationalTooltip/EducationalTooltip.test.tsx` - Component tests
- `frontend/src/__tests__/components/EducationalTooltip/HelpIcon.test.tsx` - HelpIcon tests

---

## Implementation Notes

### TooltipContent.ts

- Include all terms from requirements:
  - Market cap, Volume, Liquidity
  - Circulating/Total/Max supply
  - ATH/ATL
  - Market cap rank
  - Category definitions (DeFi, Layer 1/2, NFT, Gaming, etc.)
- Content should be 2-3 sentences max
- Use plain language, avoid jargon
- Include examples where helpful

### EducationalTooltip.tsx

- Use React hooks: `useState`, `useRef`, `useEffect`
- Position tooltip using absolute positioning
- Check viewport bounds to avoid off-screen tooltips
- Use z-index: 20 (from design system)
- Support both hover and focus triggers
- Auto-dismiss on mouse leave or ESC key
- Mobile: tap to toggle instead of hover

### HelpIcon.tsx

- Simple wrapper around EducationalTooltip
- Uses ⓘ icon (info symbol) or ? icon
- Accessible button with proper ARIA labels
- Follows existing Icon component patterns

---

## Testing Strategy

### Unit Tests

1. **TooltipContent.test.ts**

   - All tooltip keys have content
   - Content structure is valid
   - Helper function returns correct content

2. **EducationalTooltip.test.tsx**

   - Tooltip shows/hides on hover
   - Tooltip shows/hides on focus
   - ESC key dismisses tooltip
   - Tooltip positions correctly
   - ARIA attributes are correct
   - Mobile tap toggles tooltip

3. **HelpIcon.test.tsx**
   - HelpIcon renders correctly
   - HelpIcon triggers tooltip
   - Keyboard navigation works
   - Accessibility attributes present

---

## Dependencies

- React hooks (useState, useRef, useEffect)
- Design system tokens (from index.css)
- Accessibility utilities (focus-ring, tap-44, sr-only)
- Existing Icon component patterns

---

## Acceptance Criteria Checklist

- [x] Requirements understood
- [x] TooltipContent.ts created with all educational terms
- [x] EducationalTooltip component created
- [x] HelpIcon component created
- [x] Accessibility features implemented
- [x] Mobile support implemented
- [x] Unit tests written and passing (28 tests, all passing)
- [x] Code follows existing patterns

## Implementation Notes

### Files Created

- `frontend/src/components/EducationalTooltip/TooltipContent.ts` - Content store with 22 educational terms
- `frontend/src/components/EducationalTooltip/EducationalTooltip.tsx` - Main tooltip component
- `frontend/src/components/EducationalTooltip/HelpIcon.tsx` - Help icon wrapper
- `frontend/src/components/EducationalTooltip/index.ts` - Barrel export
- `frontend/src/__tests__/components/EducationalTooltip/TooltipContent.test.ts` - Content tests (8 tests)
- `frontend/src/__tests__/components/EducationalTooltip/EducationalTooltip.test.tsx` - Component tests (12 tests)
- `frontend/src/__tests__/components/EducationalTooltip/HelpIcon.test.tsx` - HelpIcon tests (8 tests)

### Key Features Implemented

- ✅ 22 educational tooltip content entries covering all required terms
- ✅ Auto-positioning tooltip that stays in viewport
- ✅ Keyboard accessible (Tab to focus, Enter/Space to show, ESC to dismiss)
- ✅ Mobile-friendly (tap to toggle)
- ✅ Proper ARIA attributes (role="tooltip", aria-describedby)
- ✅ Hover and focus support
- ✅ Design system token integration
- ✅ All unit tests passing (28/28)

### Accessibility Features

- ✅ Keyboard navigation support
- ✅ Screen reader support with ARIA labels
- ✅ Focus management (doesn't trap focus)
- ✅ Touch-friendly target sizes (44x44px via tap-44 class)
- ✅ Proper semantic HTML (role="tooltip", role="button")
