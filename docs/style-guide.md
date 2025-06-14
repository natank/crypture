# 🎨 Crypture Design System

A living reference for UI tokens, components, and patterns—ensuring clarity, consistency, and accessibility across the product. All elements are mapped to wireframes and product backlog stories for traceability.

---

## 1. Design Tokens

### 1.1 Typography
| Token           | Description        | Tailwind Utility            |
|-----------------|-------------------|-----------------------------|
| `font-base`     | Body text         | `text-base font-normal`     |
| `font-heading`  | Section headings  | `text-xl font-semibold`     |
| `font-subtle`   | Hints, placeholder| `text-sm text-gray-500`     |
| `font-button`   | Button labels     | `text-sm font-medium uppercase` |

### 1.2 Color Palette
| Role         | Value      | Tailwind Utility   |
|--------------|------------|--------------------|
| Primary      | `#2563eb`  | `bg-blue-600`      |
| Accent       | `#22c55e`  | `bg-green-500`     |
| Error        | `#dc2626`  | `bg-red-600`       |
| Background   | `#f9fafb`  | `bg-gray-50`       |
| Foreground   | `#111827`  | `text-gray-900`    |
| Subtle Text  | `#6b7280`  | `text-gray-500`    |
| Border/Lines | `#e5e7eb`  | `border-gray-200`  |

### 1.3 Spacing
| Token       | Pixels | Tailwind Utility |
|-------------|--------|-----------------|
| `space-xs`  | 4px    | `p-1`, `m-1`    |
| `space-sm`  | 8px    | `p-2`, `m-2`    |
| `space-md`  | 16px   | `p-4`, `m-4`    |
| `space-lg`  | 24px   | `p-6`, `m-6`    |
| `space-xl`  | 32px   | `p-8`, `m-8`    |

### 1.4 Border Radius & Shadow
| Element           | Tailwind Utility    |
|-------------------|--------------------|
| General           | `rounded-lg`        |
| Button            | `rounded-md`        |
| Modal/Card        | `rounded-2xl`       |
| Shadow (default)  | `shadow-md`         |
| Shadow (elevated) | `shadow-lg`         |

### 1.5 Accessibility
- Text contrast: **≥4.5:1** (body), **≥3:1** (large/bold)
- All icons and buttons: `aria-label` or visible label
- Keyboard navigable, focus-visible styles

---

## 2. Atomic Components

### 2.1 Buttons
| Type      | Tailwind Classes                                                               | Usage                       |
|-----------|-------------------------------------------------------------------------------|-----------------------------|
| Primary   | `bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200` | Main actions                |
| Secondary | `bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200` | Cancel, neutral             |
| Danger    | `bg-red-600 text-white font-button px-4 py-2 rounded-md hover:bg-red-700`      | Delete                      |
| Icon-only | `p-2 rounded-full hover:bg-gray-100`                                           | Icon actions, needs aria    |

**Example:**
```jsx
<button className="bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200">Add Asset</button>
<button aria-label="Delete" className="p-2 rounded-full hover:bg-gray-100"><TrashIcon /></button>
```

### 2.2 Inputs & Labels
- Use `text-base`, `rounded-md`, `border`, `focus:ring-blue-600`
- Error: `border-red-600`, error text below field
- Disabled: `bg-gray-100`, `text-gray-400`

**Example:**
```jsx
<label htmlFor="qty" className="block font-subtle">Quantity</label>
<input id="qty" className="text-base rounded-md border border-gray-200 p-2 focus:ring-blue-600" />
<span className="text-sm text-red-600">Invalid quantity</span>
```

### 2.3 Icons
- Use consistent icon set (e.g., Heroicons, Lucide)
- All icon-only controls must have `aria-label`

---

## 3. Molecules

### 3.1 Asset Row
**Wireframe:** See Portfolio Table in `ui-wireframes.md`
```jsx
<tr>
  <td>BTC <span className="text-gray-500">(Bitcoin)</span></td>
  <td>0.5</td>
  <td>$30,000</td>
  <td>$15,000</td>
  <td><button aria-label="Delete" className="p-2 rounded-full hover:bg-gray-100"><TrashIcon /></button></td>
</tr>
```

### 3.2 Sort/Filter Bar
```jsx
<div className="flex gap-2 items-center">
  <input type="text" placeholder="Filter assets by name or value" className="p-2 rounded-md border border-gray-200" aria-label="Filter assets" />
  <label className="sr-only" htmlFor="sort">Sort by</label>
  <select id="sort" className="p-2 rounded-md border border-gray-200">
    <option value="value">Value ⬆/⬇</option>
    <option value="name">Name ⬆/⬇</option>
  </select>
</div>
```

### 3.3 Modal (Add Asset)
```jsx
<div className="rounded-2xl bg-white shadow-lg p-6 w-full max-w-md">
  <h2 className="font-heading mb-4">Add Crypto Asset</h2>
  <form>
    <label htmlFor="asset" className="block font-subtle">Asset</label>
    <select id="asset" className="w-full p-2 rounded-md border border-gray-200 mb-2">
      <option>BTC</option>
      <option>ETH</option>
    </select>
    <span className="text-sm text-red-600">Error: Select an asset</span>
    <label htmlFor="qty" className="block font-subtle mt-2">Quantity</label>
    <input id="qty" type="number" className="w-full p-2 rounded-md border border-gray-200" />
    <span className="text-sm text-red-600">Error: Invalid quantity</span>
    <div className="flex gap-2 mt-4">
      <button type="submit" className="bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200">Add Asset</button>
      <button type="button" className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200">Cancel</button>
    </div>
  </form>
</div>
```

### 3.4 Loading & Error Indicators
- **Global:** Centered spinner or error banner
- **Per-asset:** Inline spinner or error badge in asset row/card

---

## 4. Patterns & Layout
- Consistent use of spacing, color, and border tokens
- Responsive design: use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`)
- All interactive elements are accessible via keyboard and have visible focus

---

## 5. Traceability
- Each component and pattern references its section in `ui-wireframes.md` and related backlog stories (see checklist in wireframes)
- Updates to tokens/components should be reflected in both the style guide and wireframes

---

_Last updated: 2025-06-14 by Windsurf Design System Review_


## 1. Design Tokens - DONE

Design tokens are the foundational visual styles used consistently across the product UI. These support a simple, readable interface tailored for casual and new crypto investors.

---

### 🎚 Typography

| Token          | Description        | Tailwind Utility                      |
| -------------- | ------------------ | ------------------------------------- |
| `font-base`    | Default body text  | `text-base`, `font-normal`            |
| `font-heading` | Section headings   | `text-xl`, `font-semibold`            |
| `font-subtle`  | Hints, placeholder | `text-sm`, `text-gray-500`            |
| `font-button`  | Button labels      | `text-sm`, `font-medium`, `uppercase` |

---

### 🎨 Color Palette

| Role         | Color Value | Tailwind Utility  |
| ------------ | ----------- | ----------------- |
| Primary      | `#2563eb`   | `bg-blue-600`     |
| Accent       | `#22c55e`   | `bg-green-500`    |
| Error        | `#dc2626`   | `bg-red-600`      |
| Background   | `#f9fafb`   | `bg-gray-50`      |
| Foreground   | `#111827`   | `text-gray-900`   |
| Subtle Text  | `#6b7280`   | `text-gray-500`   |
| Border/Lines | `#e5e7eb`   | `border-gray-200` |

---

### 📏 Spacing Scale

| Token      | Pixels | Tailwind Utility |
| ---------- | ------ | ---------------- |
| `space-xs` | `4px`  | `p-1`, `m-1`     |
| `space-sm` | `8px`  | `p-2`, `m-2`     |
| `space-md` | `16px` | `p-4`, `m-4`     |
| `space-lg` | `24px` | `p-6`, `m-6`     |
| `space-xl` | `32px` | `p-8`, `m-8`     |

Use `gap-*` for consistent spacing between components in layouts.

---

### 🧱 Border Radius & Shadows

| Element Type      | Tailwind Utility               |
| ----------------- | ------------------------------ |
| General Elements  | `rounded-lg`                   |
| Buttons           | `rounded-md` or `rounded-full` |
| Modals / Cards    | `rounded-2xl`                  |
| Shadows (default) | `shadow-md`                    |
| Elevated Elements | `shadow-lg`                    |

Smooth corners and soft shadows contribute to a clean, user-friendly aesthetic.

### 1.1 Accessibility Contrast Standards

To meet WCAG 2.1 AA accessibility requirements:

- Text must have a **minimum contrast ratio of 4.5:1** against its background.
- Large text (≥18pt or 14pt bold) requires **3.0:1** contrast.

#### ✅ Approved Combinations:

| Text Color      | Background Color | Tailwind Utility               | Contrast Ratio | Use Case               |
| --------------- | ---------------- | ------------------------------ | -------------- | ---------------------- |
| `text-gray-900` | `bg-white`       | `text-gray-900`, `bg-white`    | 21:1           | Body, headings         |
| `text-blue-900` | `bg-blue-100`    | `text-blue-900`, `bg-blue-100` | 12.6:1         | CTA buttons (light UI) |
| `text-red-600`  | `bg-white`       | `text-red-600`, `bg-white`     | 5.4:1          | Error text             |

🚫 Avoid using:

- `text-white` on blue backgrounds (`bg-blue-600` to `bg-blue-950`) unless paired with a dark page container.
- `text-gray-500` or lighter on `bg-white` or `bg-gray-50` for body text or buttons.

---

## 2. Components – Atoms ✅ Done

Atomic components are the smallest reusable UI elements. These establish consistency across the design system and are used to build more complex components (molecules, organisms).

---

### 🔘 Buttons

| Type      | Tailwind Classes                                                               | Use Case                    |
| --------- | ------------------------------------------------------------------------------ | --------------------------- |
| + Primary | `bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200` |
| Secondary | `bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200` | Cancel, Neutral UI controls |
| Danger    | `bg-red-600 text-white font-button px-4 py-2 rounded-md hover:bg-red-700`      | Delete actions              |
| Icon-only | `p-2 rounded-full hover:bg-gray-100`                                           | Trash/delete, import/export |

- All buttons must meet 4.5:1 contrast minimum on the page background. Use light background buttons with dark text for optimal readability on white or gray interfaces.
- Buttons use action-oriented labels (e.g., “Add Asset”, “Cancel”).
- Icon-only buttons must include `aria-label` for accessibility.
- Maintain consistent padding and font usage (`font-button`).

---

### 📝 Inputs

| Type        | Tailwind Classes                                                                      | Use Case                      |
| ----------- | ------------------------------------------------------------------------------------- | ----------------------------- |
| Text Input  | `border border-gray-200 rounded-md px-3 py-2 text-base focus:outline-none focus:ring` | Quantity field, filter bar    |
| Dropdown    | `border border-gray-200 rounded-md px-3 py-2 text-base bg-white`                      | Asset selector (autocomplete) |
| Error State | `border-red-600 text-red-600` with `text-sm text-red-600 mt-1` error message span     | Invalid input feedback        |

- Inputs include visible labels and `placeholder:text-gray-700` for contrast compliance.
- Show error states with border and text color changes.
- Use `disabled:opacity-50 cursor-not-allowed` during loading.

---

### 🧩 Icons

| Icon                  | Usage                           | Style Recommendation                 |
| --------------------- | ------------------------------- | ------------------------------------ |
| ➕ Add                | On buttons to add asset         | Use filled icon, match primary color |
| 🗑️ Delete             | Inline with each asset row      | Icon-only button, danger color       |
| 🔍 Search             | In filter bar                   | Prepend icon inside input field      |
| ⚠️ Error              | Inline with fetch or validation | Red text/icon combo                  |
| 🔁 Loading            | Spinner during async actions    | `animate-spin`, center-aligned       |
| 📤 Export / 📥 Import | On footer action buttons        | Use paired icon-text button          |

- Use scalable icons (e.g., `w-5 h-5`) from Heroicons or similar libraries.
- Maintain consistent placement (before or after label).
- Align icons with `flex items-center gap-2` when used with text.

---

## 3. Components – Molecules ✅ Done

Molecules are combinations of atomic components that form functional UI units. These reflect common user flows and are used throughout the app to build consistent interaction patterns.

---

### 📃 Asset Row

Displays a single crypto asset in the portfolio list, including real-time price, value, and actions.

| Element       | Tailwind Utility Example                                               |
| ------------- | ---------------------------------------------------------------------- |
| Container     | `flex items-center justify-between border-b border-gray-200 py-2`      |
| Name + Symbol | `text-base font-medium text-gray-900`                                  |
| Quantity      | `text-sm text-gray-600`                                                |
| Price & Value | `text-right text-base font-semibold`                                   |
| Delete Button | `p-2 rounded-full hover:bg-gray-100 text-red-600` (icon-only w/ label) |
| Error Badge   | `text-sm text-red-600 ml-2` (shown only on fetch failure)              |

- Responsive stacking on mobile (e.g., name above quantity/price).
- Use transition for price/value updates (`transition-colors`, `duration-300`).
- Ensure `aria-label` on delete button for accessibility.

---

### ➕ Add Asset Form (Modal)

Enables users to input a cryptocurrency and quantity manually.

| Element        | Tailwind Utility Example                                               |
| -------------- | ---------------------------------------------------------------------- |
| Form Container | `bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto`                  |
| Asset Input    | `border px-3 py-2 rounded-md w-full` + dropdown/autocomplete support   |
| Quantity Input | `border px-3 py-2 rounded-md w-full mt-4`                              |
| Action Buttons | `flex gap-2 justify-end mt-6` – uses `Primary` and `Secondary` buttons |
| Error Message  | `text-sm text-red-600 mt-2` (appears below relevant field)             |

- Submit disables inputs and shows spinner on add.
- Reset form after success; close modal on cancel or add.

---

### 🔁 Loading / Error Indicators

Visual feedback components to communicate async states clearly.

#### Global Loading Overlay

```html
<div class="flex justify-center items-center h-screen">
  <div
    class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
  ></div>
</div>
```

#### Inline Loading Spinner

```html
<div
  class="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
></div>
```

#### Error Message Banner

```html
<div
  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4"
>
  ⚠️ Error fetching data. <button class="underline ml-2">Retry</button>
</div>
```

- Use `aria-live="polite"` on dynamic status areas.
- Apply spinners inline next to price or submit buttons.

---

### 🔍 Sort & Filter Bar

Molecule for navigating large asset lists.

| Element       | Tailwind Utility Example                     |
| ------------- | -------------------------------------------- |
| Container     | `flex flex-wrap items-center gap-4 mb-4`     |
| Search Input  | `px-3 py-2 border rounded-md w-full sm:w-64` |
| Sort Dropdown | `px-3 py-2 border rounded-md bg-white`       |

- Add icons inside search field (`🔍`) using `relative` + `pl-10`.
- Stack on smaller screens with `flex-col` or `sm:flex-row`.

---

## 4. Layout Guidelines ✅ Done

Consistent layout rules ensure a clean, predictable experience across screen sizes and help guide users through portfolio management tasks with clarity.

---

### 🧱 Page Structure

| Section           | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Header            | Fixed or sticky display of total portfolio value (`💰 Total Value: $XX`) |
| Main Content      | Asset list, sort/filter bar, and action buttons                          |
| Modal Layer       | Add Asset form appears as a centered overlay                             |
| Footer (optional) | For export/import actions or mobile CTA bar                              |

- Layout should minimize visual clutter and prioritize hierarchy.
- Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`) for accessibility.

---

### 📐 Grid & Flex Rules

| Component Area       | Layout Strategy Example                  |
| -------------------- | ---------------------------------------- |
| Overall App Wrapper  | `max-w-4xl mx-auto p-4`                  |
| Asset List Container | `divide-y divide-gray-200`               |
| Asset Row            | `flex justify-between items-center py-2` |
| Sort/Filter Controls | `flex flex-wrap gap-4 items-center mb-4` |
| Add Form Layout      | `grid gap-4` or `flex flex-col gap-4`    |

- Default spacing between blocks: `space-y-6`
- Group controls and fields using `gap-4` or `gap-6`

---

### 📱 Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Devices            | Usage Examples                      |
| ---------- | --------------- | ------------------ | ----------------------------------- |
| `sm`       | `sm:`           | ≥ 640px (phones)   | Horizontal layout for sort/filter   |
| `md`       | `md:`           | ≥ 768px (tablets)  | 2-column layout in modals if needed |
| `lg`       | `lg:`           | ≥ 1024px (desktop) | Maximum width, full UI grid         |

- Use `sm:flex-row` and `flex-col` toggles to adapt layouts.
- Ensure all modals, buttons, and inputs remain usable on small screens.
- Avoid horizontal scroll on any screen size.

---

### 🪟 Modal Design Rules

| Feature           | Guideline                                                           |
| ----------------- | ------------------------------------------------------------------- |
| Position          | Centered both vertically and horizontally (`mx-auto my-20`)         |
| Size              | `max-w-md`, responsive to fit on small screens                      |
| Dismiss           | “Cancel” button and backdrop click should both close modal          |
| Scroll Management | Body scroll lock when modal is open                                 |
| Accessibility     | Focus trap inside modal, with `aria-modal="true"` and role="dialog" |

---

### 🧭 Visual Flow

- Visual hierarchy: Total Value → Filter/Sort → Asset List → Action Buttons
- Use `font-heading` for section labels and `font-base` for detail text.
- Use whitespace to separate logical blocks (e.g., asset list vs. footer).

---

## 5. UX Language Guidelines ✅

The language used in UI elements must be simple, action-oriented, and intuitive for non-technical users. Our tone should reflect the product vision: empowering casual crypto investors with clarity and confidence.

---

### 🏷 Labels & Placeholders

| Context        | Example Text                                                      | Guidance                                             |
| -------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| Asset Input    | Label: “Asset” <br> Placeholder: “e.g. BTC, ETH”                  | Use cryptocurrency name/symbol examples.             |
| Quantity Input | Label: “Quantity” <br> Placeholder: “e.g. 1.5”                    | Use plain units, no symbols like `$` or `Ξ`.         |
| Search Field   | Placeholder: “Search assets…”                                     | Keep concise; encourage exploratory filtering.       |
| Sort Dropdown  | Label: “Sort by” <br> Options: “Name (A–Z)”, “Value (High → Low)” | Use clear, user-facing terms instead of tech labels. |

---

### 🧠 Action-Oriented Buttons

| Button Text    | Purpose                     | Guidelines                                 |
| -------------- | --------------------------- | ------------------------------------------ |
| “➕ Add Asset” | Confirm add form submission | Always pair icon with verb                 |
| “❌ Cancel”    | Close modal without saving  | Use consistently in modals                 |
| “🗑️ Delete”    | Remove asset from portfolio | Combine with confirmation before executing |
| “📤 Export”    | Trigger CSV/JSON download   | Make explicit what action does             |
| “📥 Import”    | Open file upload modal      | Clarify format support via tooltip or copy |
| “Retry”        | Retry failed fetch          | Only show on error banners                 |

---

### 💡 Tooltips & Help Text

| Element           | Tooltip or Help Text Example                          |
| ----------------- | ----------------------------------------------------- |
| Asset Field       | “Select from top 100 coins (BTC, ETH, etc.)”          |
| Quantity Field    | “Enter how much you own or plan to simulate”          |
| Price Fetch Error | “Unable to load price. Please check your connection.” |
| Export Button     | “Download your portfolio as a CSV or JSON file.”      |
| Import Button     | “Upload a CSV or JSON with ‘asset’ and ‘quantity’.”   |

- Keep tooltips brief (max 12 words).
- Use sentence case and avoid jargon.
- Prefer natural phrasing over system-like terms.

---

### 🤝 Tone & Voice

- **Tone**: Clear, friendly, supportive
- **Voice**: Human, confident, non-technical
- **Avoid**: Financial jargon, abbreviations (e.g., ROI, API, UX)
- **Use**: Plain terms like “add”, “delete”, “value”, “price”

---

### 📣 Error Messaging Patterns

| Scenario               | Example Message                               |
| ---------------------- | --------------------------------------------- |
| Invalid input          | “Please enter a valid quantity.”              |
| Missing asset/quantity | “Both asset and quantity are required.”       |
| Price fetch failure    | “⚠️ Couldn’t load price. Try again later.”    |
| Invalid import file    | “File format not supported. Use CSV or JSON.” |

- Show only one error per field at a time.
- Display errors near the relevant control.
- Prefix with emoji (⚠️) when space permits, to improve scannability.

---
