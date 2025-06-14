# TD-04 Initial Checklist: Visual/UX Review of `ui-mockups.md`

_Last updated: 2025-06-14_

This checklist records the initial findings from the review of the "Portfolio Overview Page" section in `ui-mockups.md` for alignment with the latest wireframes and style guide. It will be expanded as further sections are reviewed.

---

## 📋 Visual/UX Alignment Checklist (Portfolio Overview Page)

- [X] **Asset Row displays both symbol and full name**
  - Show e.g., `BTC (Bitcoin)`, not just `BTC`.
- [X] **Consistent typography for quantity, price, value**
  - Use `font-base`, `font-semibold` as in style guide.
- [X] **Action button includes visible label or tooltip**
  - Delete action should have a visible label or `aria-label`.
- [X] **Sort/Filter bar has explicit labels/tooltips**
  - Filter input and sort dropdown must have labels/tooltips for accessibility.
- [X] **Sort dropdown visually indicates direction and toggling**
  - Show ⬆/⬇, highlight active state.
- [X] **Sort input placeholder matches wireframes**
  - Use: `"Filter assets by name or value"`.
- [X] **Footer buttons have tooltips/aria-labels**
  - E.g., "Add a new crypto asset", "Export as CSV or JSON".
- [X] **Button classes use style guide tokens**
  - E.g., `font-button`, `rounded-md`.
- [X] **Persistence indicator present in header**
  - Show `[✔️ Saved]` or similar as in wireframes.
- [X] **Per-component loading/error indicators**
  - Asset rows have space for inline spinners or error badges.
- [X] **All icon-only buttons have `aria-label`**
- [X] **Color contrast meets accessibility standard**
- [X] **Utility snippet uses exact class names/markup from style guide**
- [X] **Responsive layout matches wireframes and style guide**

---
## 📋 Visual/UX Alignment Checklist (Add Asset Modal/Form)
 - [X] **Asset dropdown shows both symbol and name (e.g., BTC (Bitcoin))**
 - [X] **All inputs have accessible labels and placeholders per style guide**
 - [X] **Field-level error messages are inline and styled as per guide**
 - [X] **Both buttons use font-button, correct color, and hover states**
 - [X] **“Add Asset” button shows spinner with aria-live during loading**
 - [X] **All interactive elements are keyboard accessible with visible focus**
 - [X] **Accessibility: All icon-only buttons have aria-label (if present)**
 - [X] **Annotations include tooltips/helper text if present in wireframes/style guide**
 - [X] **Modal and contents are responsive**

## 📋 Visual/UX Alignment Checklist (Asset List Row)
 - [X] **Delete button has visible focus and optional tooltip**
 - [X] **All text/button colors meet accessibility contrast standards**
 - [X] **Responsive stacking and spacing matches style guide**
 - [X] **Utility classes match latest design tokens**
 - [X] **Space reserved for per-row loading/error indicators**
## 📋 Visual/UX Alignment Checklist (Inline Error State)
 - [X] **Error styling uses style guide tokens (e.g., bg-red-50)**
 - [X] **Error message is accessible (aria-live)**
 - [X] **Placeholders for price/value use correct classes and spacing**
 - [X] **Error message and row background have sufficient contrast**

## 📋 Visual/UX Alignment Checklist (Global Loading & Error Banners)
 - [X] **Spinner uses exact color tokens and is visually accessible**
 - [X] **Spinner has aria-label for screen readers**
 - [X] **Loading label uses style guide tokens for color/size**
 - [X] **Error banner colors meet contrast/accessibility standards**
 - [X] **Error banner is dismissible if specified in wireframes**
 - [X] **Retry button has aria-label and visible focus**
 - [X] **All elements are keyboard accessible**
 - [X] **Layout is responsive at all breakpoints**
 - [X] **Banner position matches wireframes**

## 📋 Visual/UX Alignment Checklist (Sort/Filter Bar)
 - [X] **Search input and sort dropdown have accessible labels or aria-label**
 - [X] **Placeholder text and color match style guide**
 - [X] **Sort direction toggle is visually highlighted per wireframes**
 - [X] **All controls meet contrast and accessibility standards**
 - [X] **Responsive stacking and spacing matches style guide**
 - [X] **Utility classes match latest design tokens**
 - [X] **Keyboard navigation and focus states are visible**

 ## 📋 Visual/UX Alignment Checklist (Export/Import Buttons)
 - [X] **Buttons have tooltips or helper text per style guide**
 - [X] **Button contrast meets accessibility standards**
 - [X] **Buttons are responsive and maintain layout on all screen sizes**
 - [X] **Buttons have visible focus indicators**
 - [X] **Non-functional (stub) status is visually clear if applicable**
_This checklist will be expanded as additional mockup sections are reviewed._
