# 🎨 Step 5: High-Fidelity Mockups – Unified Plan

This plan outlines the objective, scope, design strategy, and production checklist for generating high-fidelity UI mockups for the Crypto Portfolio Tracker.

---

## 🎯 Objective

To create detailed, styled UI mockups for all key screens using the established wireframes and design system. These mockups will guide frontend development and ensure consistency, clarity, and usability for the target user base.

---

## 🗂 Inputs

- `ui-wireframes.md` – Low-fidelity layouts
- `style-guide.md` – Design tokens and components
- `product-vision.md` – User goals and usability principles
- `product-backlog.md` – User stories and acceptance criteria
- `designer-activity-plan.md` – Step-by-step design responsibilities

---

## 🧩 Screens & Components to Mock

These mockups correspond to the most critical user flows and UI areas:

1. **Portfolio Overview Page**
2. **Add Asset Modal/Form**
3. **Asset List Row**
4. **Inline Error State**
5. **Global Loading & Error Banners**
6. **Sort/Filter Bar**
7. **Export/Import Buttons (Stub)**

---

## 🎨 Design Approach

### Visual Style

- Tailwind CSS-compatible classes for layout, spacing, typography, and color
- Use of Heroicons for actions (add, delete, refresh, error)
- Realistic content examples (e.g., BTC, ETH, USD values)
- Responsive layout with mobile-first breakpoints

### Accessibility & Responsiveness

- WCAG AA-compliant colors and contrast
- Font and button sizes accessible on mobile
- Layout adapts using `sm:`, `md:`, `lg:` Tailwind breakpoints

---

## 📦 Deliverables

- One markdown file: `ui-mockups.md`
- Each section includes:
  - Fully styled screen or component (text-based mockup or image)
  - Short annotation notes
  - Reference to design tokens and utility classes used

---

## ✅ Production Checklist

| #   | Screen / Component Name            | Description                                                                | Related User Stories | Status  |
| --- | ---------------------------------- | -------------------------------------------------------------------------- | -------------------- | ------- |
| 1   | **Portfolio Overview Page**        | Main dashboard: total portfolio value, asset list, sort/filter, actions    | 3, 6, 8              | ✅ Done |
| 2   | **Add Asset Modal/Form**           | Modal for entering asset name and quantity, including validation & loading | 1, 7, 8              | ✅ Done |
| 3   | **Asset List Row**                 | Styled row showing asset info (name, qty, price, value, delete button)     | 2, 3, 4, 5           | ✅ Done |
| 4   | **Inline Error State**             | Price fetch failure message shown within asset list row                    | 4, 7                 | ✅ Done |
| 5   | **Global Loading & Error Banners** | Full-screen spinner, global error banner with retry                        | 5, 7                 | ✅ Done |
| 6   | **Sort/Filter Bar**                | Inputs for searching and sorting the asset list                            | 6, 8                 | ✅ Done |
| 7   | **Export/Import Buttons (Stub)**   | Button styles and layout for export/import actions (no modal yet)          | 10                   | ✅ Done |

---

## 🛠 Execution Steps

1. Translate each wireframe into high-fidelity visuals using design system.
2. Annotate design behaviors, responsiveness, and key interactions.
3. Finalize layout and utility class mappings.
4. Review for consistency and alignment with user goals.
5. Save results to `docs/ui-mockups.md`.

---

## mockups

## 📄 1. Portfolio Overview Page

| 💰 Total Portfolio Value [✔️ Saved]                              |         |             |             |                    |
| ---------------------------------------------------------------- | ------- | ----------- | ----------- | ------------------ |
| $12,345.67                                                      |         |             |             |                    |
| +--------------------------------------------------------------+ |         |             |             |                    |
| 🔍 [ <span aria-label="Search assets" class="sr-only">Search</span> <input type="text" placeholder="Search assets…" class="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full sm:w-64 text-base text-gray-900 placeholder:text-gray-500" aria-label="Filter assets by name or value" /> ]  
| <label class="text-base text-gray-700">Sort:</label> <select class="px-3 py-2 border rounded-md bg-white text-base sm:w-48 w-full" aria-label="Sort assets"><option selected>Value ⬆</option><option>Name ⬆</option><option>Name ⬇</option><option>Value ⬇</option></select> |         |             |             |                    |
| +--------------------------------------------------------------+ |         |             |             |                    |
| Asset (Symbol & Name)                                          | Qty     | Price       | Value       | Action             |
| --------------------------                                     | ------- | ----------- | ----------- | ------------------ |
| BTC (Bitcoin)                                                  | 0.5     | $30,000     | $15,000     | <button class="p-2 rounded-full hover:bg-gray-100 text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600" aria-label="Delete BTC" title="Delete BTC">🗑️ <span class="sr-only">Delete BTC</span></button> <span class="ml-2 animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" aria-label="Loading" style="display:none;"></span> <span class="ml-2 text-sm text-red-600" style="display:none;">⚠️ Error</span> |
| ETH (Ethereum)                                                 | 1.2     | $2,000      | $2,400      | <button class="p-2 rounded-full hover:bg-gray-100 text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600" aria-label="Delete ETH" title="Delete ETH">🗑️ <span class="sr-only">Delete ETH</span></button> <span class="ml-2 animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" aria-label="Loading" style="display:none;"></span> <span class="ml-2 text-sm text-red-600" style="display:none;">⚠️ Error</span> |
| +--------------------------------------------------------------+ |         |             |             |                    |
| <button class="bg-blue-600 text-white font-button px-4 py-2 rounded-md hover:bg-blue-700" aria-label="Add a new crypto asset" title="Add a new crypto asset">➕ Add Asset</button> 
  <button class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-label="Export portfolio as CSV or JSON" title="Export portfolio">📤 Export</button>
  <button class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-label="Import portfolio from CSV or JSON" title="Import portfolio">📥 Import</button>
  <span class="text-sm text-gray-600 ml-2">(Stub - Not functional)</span>
| +--------------------------------------------------------------+ |         |             |             |                    |

### 🧩 Annotations

- **Top Value Header:**

  - `text-xl font-semibold text-gray-900`
  - Positioned in a full-width `div` with `bg-white shadow-md p-4 rounded-lg`

- **Sort/Filter Bar:**

  - Filter input: `border px-3 py-2 rounded-md w-full sm:w-64`
  - Sort dropdown: `border px-3 py-2 rounded-md bg-white`

- **Asset Table Rows:**

  - Use `divide-y divide-gray-200` with flex rows (`flex justify-between items-center py-2`)
  - Each row contains:
    - Name: `text-base font-medium text-gray-900`
    - Qty: `text-sm text-gray-600`
    - Price/Value: `text-right font-semibold`
    - Action Button: `text-red-600 p-2 rounded-full hover:bg-gray-100` with `aria-label="Delete BTC"`

- **Footer Buttons:**

  - “Add Asset” – `bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700`
  - “Export” – `bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200`
  - “Import” – same as Export

- **Responsiveness:**
  - Entire layout inside `max-w-4xl mx-auto p-4 space-y-6`
  - Sort/filter switches to stacked `flex-col` under `sm:` breakpoint

---

### 📦 Utility Snippets (for developer reference)

```html
<div class="max-w-4xl mx-auto p-4 space-y-6">
  <div class="text-xl font-semibold text-gray-900">
    💰 Total Value: $12,345.67
  </div>

  <div class="flex flex-wrap items-center gap-4 mb-4">
    <input
      type="text"
      class="px-3 py-2 border rounded-md w-full sm:w-64 text-base text-gray-900 placeholder:text-gray-500"
      placeholder="Filter assets..."
    />
    <select class="px-3 py-2 border rounded-md bg-white text-base sm:w-48 w-full">
      <option>Sort by Value ⬆</option>
      <option selected>Sort by Value ⬇</option>
    </select>
  </div>

  <div class="divide-y divide-gray-200">
    <!-- Example row -->
    <div class="flex justify-between items-center py-2">
      <div>
        <div class="text-base font-medium text-gray-900">BTC</div>
        <div class="text-sm text-gray-600">Qty: 0.5</div>
      </div>
      <div class="text-right">
        <div class="text-base font-semibold">$30,000</div>
        <div class="text-base font-semibold">$15,000</div>
      </div>
      <button
        aria-label="Delete BTC"
        class="p-2 rounded-full text-red-600 hover:bg-gray-100"
      >
        🗑️
      </button>
    </div>
  </div>

  <div class="flex gap-4 justify-end mt-4">
    <button
      class="bg-blue-600 text-white font-button px-4 py-2 rounded-md hover:bg-blue-700"
    >
      ➕ Add Asset
    </button>
    <button
      class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
    >
      📤 Export
    </button>
    <button
      class="bg-gray-100 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200"
    >
```
## 📄 2. Add Asset Modal/Form

+---------------------------- Add Crypto Asset ----------------------------+
| Asset: [ 🔽 BTC - Bitcoin ] |
| Qty: [ 0.5 ] |
| |
| [➕ Add Asset] [❌ Cancel] |
| |
| ⚠️ Error: Invalid quantity. |
+-------------------------------------------------------------------------+

### 🧩 Annotations

🔹 Modal Container
bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto

Centers on screen with modal overlay and focus trap

🔹 Inputs
Asset Input:

border border-gray-200 rounded-md px-3 py-2 w-full

Supports dropdown/autocomplete behavior

Quantity Input:

Same styling

Validates numeric values (e.g., no negative or non-numeric input)

🔹 Error State
text-sm text-red-600 mt-2

Appears below relevant input with icon (⚠️) and validation message

🔹 Buttons
Add Asset (Primary):

bg-blue-600 text-white font-button px-4 py-2 rounded-md hover:bg-blue-700

Shows a spinner (animate-spin) during async submit

Cancel (Secondary):

bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200

🔹 Loading Behavior
During submit:

Inputs are disabled: disabled:opacity-50 cursor-not-allowed

Button label becomes spinner: animate-spin w-4 h-4 border-2

### Developer Snippet (HTML)

<div
  class="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto space-y-4"
  role="dialog"
  aria-modal="true"
>
  <div class="text-xl font-semibold text-gray-900">➕ Add Crypto Asset</div>

  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700" for="asset-select"
      >Asset</label
    >
    <select
      id="asset-select"
      class="border border-gray-200 rounded-md px-3 py-2 w-full"
    >
      <option value="BTC">BTC - Bitcoin</option>
      <option value="ETH">ETH - Ethereum</option>
    </select>
  </div>

  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700" for="quantity-input"
      >Quantity</label
    >
    <input
      id="quantity-input"
      type="number"
      placeholder="0.5"
      class="border border-gray-200 rounded-md px-3 py-2 w-full"
    />
    <!-- Example error message -->
    <span class="text-sm text-red-600">⚠️ Invalid quantity.</span>
  </div>

  <div class="flex justify-end gap-4 pt-4">
    <button
      class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
      aria-label="Cancel adding asset"
    >
      ❌ Cancel
    </button>
    <button
      class="bg-blue-600 text-white font-button px-4 py-2 rounded-md hover:bg-blue-700"
      aria-label="Add asset"
    >
      ➕ Add Asset
      <span class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" aria-hidden="true"></span>
    </button>
  </div>
</div>

Delete button

(Optional) Inline error badge if price fails

### 🎨 High-Fidelity Mockup – Asset List Row

+--------------------------------------------------------------------+
| BTC (Bitcoin) |
| Qty: 0.5 Price: $30,000 Total: $15,000 |
| [🗑️ Delete] |
+--------------------------------------------------------------------+

### 🧩 Annotations

🔹 Container
Layout: flex justify-between items-center py-2 border-b border-gray-200

Responsive stacking on mobile: sm:flex-row flex-col gap-2

🔹 Left Column: Asset Identity
Name: text-base font-medium text-gray-900

Symbol (e.g., BTC): text-sm text-gray-600

🔹 Center: Price and Quantity
Price: text-right text-sm text-gray-600

Quantity: text-sm text-gray-600

Total Value: text-right text-base font-semibold text-gray-900

🔹 Right Column: Action Button
Delete: p-2 rounded-full hover:bg-gray-100 text-red-600

Aria label: "Delete BTC"

🔹 Inline Error (Optional)
⚠️ Price fetch failed as text-sm text-red-600 ml-2

### 📦 Developer Snippet

<div class="flex justify-between items-center py-2 border-b border-gray-200">
  <div class="flex-1">
    <div class="text-base font-medium text-gray-900">BTC (Bitcoin)</div>
    <div class="text-sm text-gray-600">Qty: 0.5</div>
  </div>
  <div class="text-right flex-1">
    <div class="text-sm text-gray-600">Price: $30,000</div>
    <div class="text-base font-semibold text-gray-900">Total: $15,000</div>
  </div>
  <button
    aria-label="Delete BTC"
    class="p-2 rounded-full hover:bg-gray-100 text-red-600"
  >
    🗑️
  </button>
</div>

---

## 📄 4. Inline Error State

### High-Fidelity Mockup

+--------------------------------------------------------------------+
| BTC (Bitcoin) ⚠️ Price fetch failed |
| Qty: 0.5 Price: — Total: — |
| [🗑️ Delete] |
+--------------------------------------------------------------------+

### 🧩 Annotations

🔹 Inline Error Message
Message: ⚠️ Price fetch failed

Style: text-sm text-red-600 ml-2

Position: Appended next to asset name or in a new line below it (depending on layout)

🔹 Price & Value Placeholders
When price fetch fails:

Price: show —

Total: show —

Apply text-gray-400 italic to both placeholders

🔹 Asset Row Adjustments
Add error styling state class to row container if desired (e.g., bg-red-50)

Keep Delete button fully functional

### 📦 Developer Snippet

<div class="flex justify-between items-center py-2 border-b border-gray-200">
  <div class="flex-1">
    <div class="flex items-center gap-2">
      <span class="text-base font-medium text-gray-900">BTC (Bitcoin)</span>
      <span class="text-sm text-red-600">⚠️ Price fetch failed</span>
    </div>
    <div class="text-sm text-gray-600">Qty: 0.5</div>
  </div>
  <div class="text-right flex-1">
    <div class="text-sm text-gray-400 italic">Price: —</div>
    <div class="text-base text-gray-400 italic">Total: —</div>
  </div>
  <button
    aria-label="Delete BTC"
    class="p-2 rounded-full hover:bg-gray-100 text-red-600"
  >
    🗑️
  </button>
</div>

---

## 📄 5. Global Loading & Error Banners

With the **Inline Error State** now completed and confirmed in `ui-mockups.md`, we can move on to:

### 📄 Purpose

These components provide global feedback during key app states:

- Initial data loading
- Price fetch failures across the app
- Retry option for recoverable errors

### 🔁 Global Loading Spinner (Initial Load)

```
+------------------------------------------------------+
| 🔄 Loading portfolio...                              |
| [spinner animation centered on screen]               |
+------------------------------------------------------+
```

### ⚠️ Global Error Banner (API Failure)

```
+------------------------------------------------------+
| ⚠️ Error loading data. Please try again later.       |
| [🔁 Retry]                                            |
+------------------------------------------------------+
```

### 🧩 Annotations

#### 🔹 Loading State

- Spinner container: `flex justify-center items-center h-screen`
- Spinner: `animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full`
- Optional label: `text-gray-600 text-sm mt-4`

#### 🔹 Error State Banner

- Banner container: `bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4`
- Retry button: `underline text-blue-600 ml-2 hover:text-blue-800`
- Use `aria-live="assertive"` for accessibility

#### 🔹 Behavior

- Banner appears if initial fetch fails or if retry also fails
- Retry button should refetch data and clear banner if successful

### 📦 Developer Snippet

```html
<!-- Global Loading Spinner -->
<div class="flex flex-col justify-center items-center h-screen text-center" aria-label="Loading portfolio...">
  <div
    class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
  ></div>
  <div class="text-gray-600 text-sm mt-4">🔄 Loading portfolio...</div>
</div>

<!-- Global Error Banner -->
<div
  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4"
  role="alert"
  aria-live="assertive"
>
  ⚠️ Error loading data. Please try again later.
  <button class="underline text-blue-600 ml-2 hover:text-blue-800" aria-label="Retry">
    🔁 Retry
  </button>
</div>
```

---

Great—since the **Global Loading & Error Banners** are complete and updated in `ui-mockups.md`, we now move on to:

---

## 📄 6. Sort/Filter Bar\*\*

### 📄 Purpose

Provides tools for users to organize and navigate their asset list by filtering by name and sorting by value or name. This supports **User Stories 6 and 8**.

### 🎨 High-Fidelity Mockup – Sort/Filter Bar

```
+---------------------------------------------------------+
| 🔍 [ Search assets...           ]   ⬇ Sort: [ Value ⬇ ] |
+---------------------------------------------------------+
```

### 🧩 Annotations

#### 🔹 Layout & Responsiveness

- Wrapper: `flex flex-wrap items-center gap-4 mb-4`
- On small screens: stack vertically via `sm:flex-row flex-col`

#### 🔹 Search Input

- Placeholder: “Search assets...”
- Icon: `🔍` positioned using `relative pl-10`
- Styles:

  - `px-3 py-2 border rounded-md w-full sm:w-64`
  - Use `text-base text-gray-900 placeholder:text-gray-500`

#### 🔹 Sort Dropdown

- Label: “Sort:”
- Options:

  - Name (A–Z), Name (Z–A)
  - Value (Low–High), Value (High–Low)

- Styles:

  - `px-3 py-2 border rounded-md bg-white text-base`
  - Width: `sm:w-48`, full-width fallback on mobile

#### 🔹 Behavior

- Filter:

  - Partial match as user types
  - Debounce input to avoid lag

- Sort:

  - Triggers real-time resort of asset list
  - Arrow reflects sort direction (⬇/⬆)

### 📦 Developer Snippet

```html
<div class="flex flex-wrap items-center gap-4 mb-4">
  <!-- Search Input -->
  <div class="relative w-full sm:w-64">
    <span class="absolute inset-y-0 left-3 flex items-center text-gray-500"
      >🔍</span
    >
    <input
      type="text"
      placeholder="Search assets..."
      class="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full text-base text-gray-900 placeholder:text-gray-500"
    />
  </div>

  <!-- Sort Dropdown -->
  <div class="flex items-center gap-2">
    <label class="text-base text-gray-700">Sort:</label>
    <select
      class="px-3 py-2 border border-gray-200 rounded-md bg-white text-base sm:w-48 w-full"
    >
      <option>Value ⬇</option>
      <option>Value ⬆</option>
      <option>Name A–Z</option>
      <option>Name Z–A</option>
    </select>
  </div>
</div>
```

---

## 7. Final Item: **7. Export/Import Buttons (Stub)**

> 🎯 Purpose: Provide clear action buttons for exporting and importing portfolio data in the future.
> These are currently _non-functional stubs_ to establish layout and UI consistency.

### 🎨 High-Fidelity Mockup – Export/Import Buttons

```
+----------------------------------------------+
| 📤 Export Portfolio   📥 Import Portfolio     |
+----------------------------------------------+
```

### 🧩 Annotations

#### 🔹 Container

- Layout: `flex justify-end gap-4 mt-6`
- Positioned below asset list or in footer area

#### 🔹 Buttons

- Export Button:

  - Label: `📤 Export Portfolio`
  - Style: `bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200`

- Import Button:

  - Label: `📥 Import Portfolio`
  - Same styling as Export

#### 🔹 Behavior

- Click events are currently no-ops (to be implemented in a future sprint)
- Can be replaced with a modal or file picker in future iterations
- Use `aria-label` attributes for accessibility

### 📦 Developer Snippet

```html
<div class="flex justify-end gap-4 mt-6">
  <button
    class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
    aria-label="Export Portfolio"
  >
    📤 Export Portfolio
  </button>
  <button
    class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
    aria-label="Import Portfolio"
  >
    📥 Import Portfolio
  </button>
</div>
```
