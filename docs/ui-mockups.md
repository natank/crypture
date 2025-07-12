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

<header class="bg-white shadow-md rounded-b-lg px-6 py-4 flex items-center justify-between">
  <h1 class="font-brand flex items-center gap-3 text-brand-primary text-2xl">
    <span class="text-3xl">🔐</span> Crypture
    <span class="text-sm text-gray-500 font-subtle ml-2">Track your crypto clearly</span>
  </h1>
</header>

| 💰 Total Portfolio Value [✔️ Saved]                                   |
| --------------------------------------------------------------------- |
| <span class="text-xl font-brand text-brand-primary">$12,345.67</span> |

---

<div class="flex flex-wrap items-center gap-4 mb-4">
  <!-- Search Input -->
  <div class="relative w-full sm:w-64">
    <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">🔍</span>
    <input
      type="text"
      placeholder="Search assets..."
      class="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full text-base text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary focus:outline-none"
    />
  </div>

  <!-- Sort Dropdown -->
  <div class="flex items-center gap-2">
    <label class="text-base text-gray-700">Sort:</label>
    <select
      class="px-3 py-2 border border-gray-200 rounded-md bg-white text-base sm:w-48 w-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
    >
      <option selected>Value ⬇</option>
      <option>Value ⬆</option>
      <option>Name A–Z</option>
      <option>Name Z–A</option>
    </select>
  </div>
</div>

---

<table class="w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th>Asset</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Value</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>BTC <span class="text-gray-500">(Bitcoin)</span></td>
      <td>0.5</td>
      <td>$30,000</td>
      <td>$15,000</td>
      <td>
        <button class="p-2 rounded-full hover:bg-gray-100 text-red-600" aria-label="Delete BTC">🗑️</button>
      </td>
    </tr>
    <tr>
      <td>ETH <span class="text-gray-500">(Ethereum)</span></td>
      <td>1.2</td>
      <td>$2,000</td>
      <td>$2,400</td>
      <td>
        <button class="p-2 rounded-full hover:bg-gray-100 text-red-600" aria-label="Delete ETH">🗑️</button>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="flex justify-end gap-4 mt-6">
  <button class="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700" aria-label="Add Asset">➕ Add Asset</button>
  <button class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200" aria-label="Export Portfolio">📤 Export</button>
  <button class="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200" aria-label="Import Portfolio">📥 Import</button>
</div>

<footer class="text-center text-sm text-gray-500 border-t border-gray-200 py-4 mt-12">
  Crypture • Clarity for every coin · <a class="hover:text-brand-accent" href="#">About</a> · <a class="hover:text-brand-accent" href="#">Privacy</a>
</footer>

\*\* Annotations

```
| Element            | Design Tokens Applied                       |
| ------------------ | ------------------------------------------- |
| Header             | `font-brand`, `text-brand-primary`          |
| Total Value        | `font-brand`, `text-brand-primary`          |
| Inputs / Dropdowns | `focus:ring-brand-primary`, consistent tone |
| Buttons            | CTA uses `bg-brand-primary`, others neutral |
| Footer             | Brand messaging, links use accent hover     |
```

## 📄 2. Add Asset Modal/Form

### Developer Snippet

<div
  class="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto space-y-4"
  role="dialog"
  aria-modal="true"
>
  <div class="text-xl font-brand text-brand-primary">➕ Add Crypto Asset</div>

  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700" for="asset-select">
      Asset
    </label>
    <select
      id="asset-select"
      class="border border-gray-200 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
    >
      <option value="BTC">BTC – Bitcoin</option>
      <option value="ETH">ETH – Ethereum</option>
    </select>
  </div>

  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700" for="quantity-input">
      Quantity
    </label>
    <input
      id="quantity-input"
      type="number"
      placeholder="0.5"
      class="border border-gray-200 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
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
      class="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700"
      aria-label="Add asset"
    >
      ➕ Add Asset
      <span
        class="animate-spin w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full ml-2"
        aria-hidden="true"
      ></span>
    </button>
  </div>
</div>

### Annotations

| Element          | Token/Class Applied                       | From                        |
| ---------------- | ----------------------------------------- | --------------------------- |
| Modal heading    | `font-brand`, `text-brand-primary`        | `style-guide.md` §1.1, §3.1 |
| Select/Input     | `focus:ring-brand-primary`                | `style-guide.md` §2.2       |
| Add button (CTA) | `bg-brand-primary`, `hover:bg-purple-700` | `style-guide.md` §2.1       |
| Spinner          | `border-brand-primary`                    | `style-guide.md` §3.4       |
| Error message    | `text-red-600`, inline with ⚠️            | `style-guide.md` §5         |

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

### Developer Snippet

<!-- Global Loading Spinner -->
<div
  class="flex flex-col justify-center items-center h-screen text-center"
  aria-label="Loading portfolio..."
>
  <div
    class="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"
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
  <button
    class="ml-2 text-brand-primary underline hover:text-brand-accent font-button"
    aria-label="Retry data fetch"
  >
    🔁 Retry
  </button>
</div>

### 🧩 Updated Annotations

| Element       | Design Tokens Applied                                          | Notes                                 |
| ------------- | -------------------------------------------------------------- | ------------------------------------- |
| Spinner       | `border-brand-primary`                                         | Uses custom brand token from §1.2     |
| Error Banner  | `bg-red-100`, `text-red-700`                                   | No change, already matched brand tone |
| Retry Button  | `text-brand-primary`, `hover:text-brand-accent`, `font-button` | Aligned with branded CTA style        |
| Accessibility | `aria-live="assertive"`                                        | Meets WCAG for screen readers         |
| Copy Tone     | “Please try again later.” / “Retry”                            | Friendly, clear                       |

---

## 📄 6. Sort/Filter Bar\*\*

### 📄 Purpose

Provides tools for users to organize and navigate their asset list by filtering by name and sorting by value or name. This supports **User Stories 6 and 8**.

### 🎨 High-Fidelity Mockup – Sort/Filter Bar

<div class="flex flex-wrap items-center gap-4 mb-4">
  <!-- Search Input -->
  <div class="relative w-full sm:w-64">
    <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">🔍</span>
    <input
      type="text"
      placeholder="Search assets..."
      aria-label="Filter assets"
      class="pl-10 pr-3 py-2 border border-gray-200 rounded-md w-full text-base text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary focus:outline-none"
    />
  </div>

  <!-- Sort Dropdown -->
  <div class="flex items-center gap-2">
    <label for="sort-select" class="text-base text-gray-700 font-subtle">Sort:</label>
    <select
      id="sort-select"
      aria-label="Sort asset list"
      class="px-3 py-2 border border-gray-200 rounded-md bg-white text-base sm:w-48 w-full focus:ring-2 focus:ring-brand-primary focus:outline-none"
    >
      <option selected>Value ⬇</option>
      <option>Value ⬆</option>
      <option>Name A–Z</option>
      <option>Name Z–A</option>
    </select>
  </div>
</div>

### ✅ Token & Style Highlights

| Element       | Design Tokens Applied                                 |
| ------------- | ----------------------------------------------------- |
| Input/Select  | `focus:ring-brand-primary`, `text-base`, `rounded-md` |
| Labels        | `font-subtle`, `text-gray-700`                        |
| Icon          | `🔍`, positioned with utility classes                 |
| Accessibility | `aria-label`, `label[for]` associations               |

---

## 7. Final Item: **7. Export/Import Buttons (Stub)**

✨ Goals
Use brand styling for high-visibility actions

Differentiate primary (Export) and secondary (Import) CTA tone

Align with style-guide.md Sections 2.1 and 3.3

> 🎯 Purpose: Provide clear action buttons for exporting and importing portfolio data in the future.
> These are currently _non-functional stubs_ to establish layout and UI consistency.

### 🎨 Developer snippet High-Fidelity Mockup – Export/Import Buttons

<div class="flex justify-end gap-4 mt-6">
  <!-- Branded Export Button -->
  <button
    class="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700"
    aria-label="Export Portfolio"
  >
    📤 Export Portfolio
  </button>

  <!-- Branded Accent Import Button -->

<button
class="bg-brand-accent text-white font-button px-4 py-2 rounded-md hover:bg-emerald-600"
aria-label="Import Portfolio"

>

    📥 Import Portfolio

  </button>
</div>

### 🧩 Annotations

| Element       | Class/Token                               | Purpose                               |
| ------------- | ----------------------------------------- | ------------------------------------- |
| Export Button | `bg-brand-primary`, `hover:bg-purple-700` | Primary CTA styling                   |
| Import Button | `bg-brand-accent`, `hover:bg-emerald-600` | Branded secondary CTA styling         |
| Both          | `font-button`, `rounded-md`               | Consistent button styling per system  |
| Accessibility | `aria-label` for both buttons             | Supports keyboard/screen reader users |

```

```
