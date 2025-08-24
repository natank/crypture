# Accessibility Utilities

This project provides a small set of global CSS utilities to improve accessibility and mobile UX consistency. These are defined in `frontend/src/index.css` under `@layer utilities`.

- __sr-only__
  - Hides content visually while keeping it available to screen readers.
  - Usage: `<span class="sr-only">Detailed instruction for screen readers</span>`

- __focus-ring__
  - Applies a consistent `:focus-visible` outline using the brand primary color.
  - Usage: `<button class="focus-ring">...</button>`
  - Notes: Works only when the element itself receives focus.

- __tap-44__
  - Ensures minimum 44x44 px hit area recommended for touch targets.
  - Adds inline-flex centering to keep icons/text centered.
  - Usage: `<button class="tap-44">...</button>`

## Examples

```tsx
<button className="focus-ring tap-44" aria-label="Delete">
  <span aria-hidden>🗑️</span>
</button>

<p id="export-help" className="sr-only">
  Export downloads your portfolio in the selected format.
</p>
```

## Rationale
- Meets WCAG and platform guidance for focus visibility and touch target sizes.
- Reduces per-component CSS duplication and drift.
