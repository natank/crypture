# 📐 UI Wireframes – Low Fidelity

> Created by Designer Agent · Based on `product-vision.md`, `product-backlog.md`, and `designer-activity-plan.md`

---

## Empty State (New Branded Section)

```
+------------------------------------------------------+
| [🪙 Crypture logo or mascot icon] | ← Visual Identity |
| Your portfolio is empty. |
| Start by adding a crypto asset below. |
| [➕ Add Asset] |
+------------------------------------------------------+
Annotations:

Mascot/icon reinforces app identity (e.g., minimalist vault, coin symbol)

Use text-gray-600, bg-gray-50, or soft highlight for empty state background

CTA button should use brand color token (see style-guide.md)
```

## 🧾 Portfolio Overview Page

```
+-------------------------------------------------------------+
| 🔐 Crypture | Track your crypto clearly                    | ← Branded Header |
+-------------------------------------------------------------+
| 💰 Total Portfolio Value: $12,345.67                       |
+-------------------------------------------------------------+
| 🔍 [ Filter assets...        ]  ⬇ Sort: [Value ⬆]         |
+-------------------------------------------------------------+
| Asset    | Qty   | Price     | Value     | [🗑️] Delete     |
|----------|-------|-----------|-----------|----------------|
| BTC      | 0.5   | $30,000   | $15,000   | [🗑️]            |
| ETH      | 1.2   | $2,000    | $2,400    | [🗑️]            |
+-------------------------------------------------------------+
| ➕ Add Asset | 📤 Export | 📥 Import                        |
+-------------------------------------------------------------+
| © 2025 Crypture · Powered by 🧠 Clarity Engine             | ← Footer w/ Brand |
+-------------------------------------------------------------+

```

Annotations:

Header: Includes app logo (🔐), brand name, and tagline (e.g., “Track your crypto clearly”).

Footer: Lightweight footer with copyright.

## Visual Style: Use bg-white, text-blue-600, rounded-b-lg, and shadow-md per mockup guidelines.

## ➕ Add Asset Modal/Form

```
+----------------- Add Crypto Asset ------------------+
| Asset: [ 🔽 BTC          ]                         |
|           (⚠️ Error: Select an asset)              |
| Qty:   [ 0.5           ]                          |
|           (⚠️ Error: Invalid quantity)             |
| [➕ Add Asset]   [❌ Cancel]                        |
+----------------------------------------------------+

// Field-level error messages: errors are shown next to the relevant field.
// Button style/placement matches asset list: primary action left, secondary right. [➕ Add Asset] uses same style as [🗑️ Delete] in lists.
```

**Annotations**:

- Dropdown or autocomplete for asset selection.
- Numeric input for quantity.
- Validation errors displayed inline, next to the relevant field (field-level error messages, not just global).
- Loading state on "Add" action, fields disabled during submit.
- **Button style/placement harmonized:**
  - [➕ Add Asset] and [🗑️ Delete] use the same button style (primary action left, secondary right) as in asset lists.
  - Placement and style are consistent across modals and lists.

---

## 📃 Asset List (Expanded View)

```
+-------------------------------------------------------------+
| BTC (Bitcoin)                                              |
| Quantity: 0.5      Price: $30,000     Total: $15,000       |
| [🗑️ Delete]   [🔄 Loading...] [⚠️ Price Fetch Failed] (if error state)      |
+-------------------------------------------------------------+
| ETH (Ethereum)                                             |
| Quantity: 1.2      Price: $2,000     Total: $2,400         |
| [🗑️ Delete]   [🔄 Loading...] [⚠️ Price Fetch Failed] (if error state)      |
+-------------------------------------------------------------+
```

**Annotations**:

- Each asset card shows key info, including both symbol and full name (e.g., "BTC (Bitcoin)").
- Inline delete button.
- Inline error badge for failed price fetch.
- **Per-component loading/error indicators:**
  - Each asset row/card can show a loading spinner ([🔄 Loading...]) or error ([⚠️ Price Fetch Failed]) individually, not just globally.

---

## 🔁 Loading and Error States

```
+------------------------------------------------------+
| [🔄 Crypture Spinner Icon]                           | ← Visual Identity |
| Loading portfolio...                                 |
+------------------------------------------------------+

+------------------------------------------------------+
| ⚠️ Error loading prices. Try again later.           |
| [🧩 Branded Retry Button]                            |
+------------------------------------------------------+

```

**Annotations**:

- Add stylized loader: use branded spinner icon or color (brand.primary)

- Retry button can optionally include logo or brand color border

- Use aria-live="assertive" and WCAG-compliant styling

---

## 🔍 Sort/Filter Bar

```
[ 🔍 Filter assets by name or value... ]   Sort by: [⬇ Name | ⬆ Value]
// Clicking the sort icon toggles between ascending (⬆) and descending (⬇) order. The active sort direction is visually highlighted.
(Label/tooltips match Portfolio Overview Bar. UI pattern is consistent across app.)
```

**Annotations**:

---

## ➕ Footer/Footer Links Zone (New)

```
+-------------------------------------------------------------+
| Crypture • Clarity for every coin                          |
| About • Privacy • Contact                                   |
+-------------------------------------------------------------+
```

Annotations:

- Placed at bottom of page (<footer> zone)

- Font: text-sm text-gray-500, layout: text-center, space-x-4

- Optional: add soft divider (border-t border-gray-200)

## 🕵️‍♂️ Windsurf Visibility Review Checklist (2025-06-14)

**This section documents clarity, consistency, and backlog alignment issues identified in the wireframes. Each item is mapped to a backlog story and cites the relevant lines above.**

### 📋 Checklist

- [x] **Add explicit labels/tooltips for sort/filter controls**  
       _Lines 11, 13, 96 – relates to Story 6_  
       The sort dropdown and filter input should have clear labels/tooltips for accessibility and clarity.

- [x] **Add text label to delete buttons**  
       _Lines 15, 17–18, 60, 64 – relates to Story 2, 8_  
       The delete (🗑️) icon should be accompanied by a text label for clarity and accessibility.

- [x] **Add tooltips or explanations for footer actions**  
       _Line 20 – relates to Story 10_  
       Footer buttons (Add, Export, Import) should have tooltips or brief text explaining their function and supported formats.

- [x] **Standardize sort/filter bar UI across all screens**  
       _Lines 13, 96 – relates to Story 6, 8_  
       Ensure a consistent sort/filter UI pattern throughout the app.

- [x] **Harmonize button styles/placement in modals and lists**  
       _Lines 35–43, 57–66 – relates to Story 1, 2_  
       Use consistent button placement, style, and labeling for actions like Add and Delete.

- [x] **Add wireframe/annotation for portfolio persistence**  
       _Lines 9–22 – relates to Story 9_  
       Indicate how/when portfolio data is saved (e.g., "Saved" indicator or sync status).

- [x] **Show field-level error messages in Add Asset modal**  
       _Line 41 – relates to Story 1, 7_  
       Display error messages next to invalid fields, not just globally.

- [x] **Explicitly display both asset symbol and name in all views**  
       _Lines 15–22, 57–66 – relates to Story 0, 8_  
       Always show asset symbol and full name together for clarity.

- [x] **Clarify sort order and toggling in UI**  
       _Lines 13, 96 – relates to Story 6_  
       Make sort order and toggling direction visually clear.

- [x] **Add per-component loading/error indicators**  
       _Lines 79–83 – relates to Story 7_  
       Show loading/error states not just globally but also for individual components (e.g., per asset).

---

_Last updated: 2025-06-14 by Windsurf review_

- Text input filters asset list (partial matches). Label or tooltip should clarify filtering (e.g., "Filter assets by name or value").
- Dropdown toggles sort order and type. Label or tooltip should clarify sorting (e.g., "Sort by").

---

## 📤 Export / 📥 Import Controls (Stub)

```
[📤 Export Portfolio]   [📥 Import Portfolio]
```

**Annotations**:

- Export triggers file download (CSV/JSON).
- Import opens modal for file upload (future design).

---

## ✅ Next Step

- Proceed to **Step 4: Establish Design System** (`style-guide.md`)
