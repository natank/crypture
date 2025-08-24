# Pull Request Title

> Example: feat(ui-usability): clearer labels, action copy, tooltips, and mobile polish

## Summary

Briefly describe the purpose and context of this PR. Link the user story and problem it solves.

- User Story: [Story ID/Name]
- Context: What changed and why

## Changes

- [ ] UI: ...
- [ ] Logic: ...
- [ ] Accessibility: (see docs/a11y-utilities.md and docs/icon-component.md)
- [ ] Docs: ...
- [ ] Tests: ...

## Files Changed

List notable files or directories touched (group by area):

- Frontend
  - path/to/file.tsx – what changed
- Tests
  - path/to/test.spec.ts – what added/updated
- Docs
  - docs/file.md – summary of doc updates

## Acceptance Criteria

Reference acceptance criteria from the backlog or sprint plan. Check off what this PR fulfills.

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## How to Test

- Unit: command(s) and expected outcomes
- E2E: command(s) and expected outcomes
- Manual: steps to verify behavior in the app

### A11y & Mobile Smoke (if UI changed)

- Run: `npm run test:e2e` (runs full suite) or `npx playwright test src/e2e/specs/a11y-mobile-smoke.spec.ts`
- Pass criteria: no CRITICAL axe violations; key controls visible and ≥44x44 on mobile viewport

## Screenshots / Recordings (optional)

Attach relevant screenshots or short videos for UI changes.

## Linked Work

- Sprint Planning: docs/sprint-planning.md (section)
- Product Backlog: docs/product-backlog.md (story)
- Issue/Ticket: link

## Checklist

- [ ] Lint/Typecheck pass locally
- [ ] Unit/Integration tests added or updated
- [ ] E2E tests added/updated (if applicable)
- [ ] A11y & Mobile checklist completed (UI changes)
  - [ ] Axe smoke passes (no CRITICAL violations) on affected pages
  - [ ] Keyboard navigable (Tab/Shift+Tab) and `focus-visible` clearly shown
  - [ ] Sufficient color contrast (WCAG AA) or documented rationale/issue link
  - [ ] Primary interactive controls have ≥44x44 tap targets (use `tap-44`)
  - [ ] Interactive elements have accessible names/labels (`aria-label`, visible text)
  - [ ] Uses `focus-ring` utility on focusable custom controls
  - [ ] Decorative icons are `aria-hidden`; meaningful icons have labels
- [ ] Docs updated (sprint planning / backlog / PR docs)
- [ ] No breaking changes without migration notes
