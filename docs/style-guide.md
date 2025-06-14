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


## 6. Traceability
- Each component and pattern references its section in `ui-wireframes.md` and related backlog stories (see checklist in wireframes)
- Updates to tokens/components should be reflected in both the style guide and wireframes

---

_Last updated: 2025-06-14 by Windsurf Design System Review_