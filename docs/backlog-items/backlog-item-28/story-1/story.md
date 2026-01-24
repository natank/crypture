# Story 1: Tooltip Component & Content Infrastructure

## User Story

**As a** crypto investor  
**I want to** see educational tooltips explaining technical terms  
**So that** I can understand metrics and make informed investment decisions

## Acceptance Criteria

1. **Reusable Tooltip Component**

   - [x] `EducationalTooltip` component displays tooltip content on hover/focus
   - [x] Tooltip appears positioned near the trigger element
   - [x] Tooltip is dismissible (auto-dismiss on mouse leave, ESC key)
   - [x] Component follows existing design system tokens

2. **Help Icon Component**

   - [x] `HelpIcon` component provides consistent visual indicator for tooltips
   - [x] Icon is accessible (keyboard focusable, ARIA labels)
   - [x] Icon uses existing design system styling

3. **Content Store**

   - [x] `TooltipContent.ts` defines type-safe content structure
   - [x] Content store includes all educational terms from requirements:
     - Market cap
     - Circulating/Total/Max supply
     - ATH/ATL
     - Volume and liquidity
     - Market cap rank
     - Category definitions (DeFi, Layer 1/2, etc.)
   - [x] Content is clear, beginner-friendly, and concise

4. **Accessibility**

   - [x] Tooltips accessible via keyboard navigation (Tab to focus, Enter/Space to show)
   - [x] Proper ARIA attributes (aria-describedby, role="tooltip")
   - [x] Screen reader support with appropriate announcements
   - [x] Focus management (tooltip doesn't trap focus)

5. **Mobile Support**

   - [x] Tooltips work on touch devices (tap to show/hide)
   - [x] Tooltip positioning adapts to screen size
   - [x] Touch-friendly target sizes (44x44px minimum)

6. **Testing**
   - [x] Unit tests for tooltip component behavior
   - [x] Unit tests for content store structure
   - [x] Accessibility tests (keyboard navigation, screen reader)

## Technical Notes

- Use React state for tooltip visibility
- Position tooltip using CSS (absolute positioning) or a positioning library if needed
- Follow existing accessibility patterns from `a11y-utilities.md`
- Reuse existing Icon component patterns
- Content should be static (no API calls)

## Dependencies

- Existing design system tokens
- Existing accessibility utilities (`sr-only`, `focus-ring`, `tap-44`)
- React hooks for state management

## Traceability

- **Requirement**: FR-1 (Educational Tooltips), FR-3 (Accessibility), FR-4 (Content Quality)
- **Backlog Item**: 28

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
- ✅ All unit tests passing (28/28 tests)

### Testing Results

- ✅ All 28 unit tests passing
- ✅ TooltipContent: 8 tests (structure, content retrieval, type guards)
- ✅ EducationalTooltip: 12 tests (visibility, keyboard, positioning, accessibility)
- ✅ HelpIcon: 8 tests (rendering, tooltip integration, accessibility)
