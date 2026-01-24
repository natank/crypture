# 🎨 Crypture Design System

A living reference for UI tokens, components, and patterns—ensuring clarity, consistency, and accessibility across the product. All elements are mapped to wireframes and product backlog stories for traceability.

---

## 1. Design Tokens

### 1.1 Typography

| Token           | Description               | Tailwind Utility                                          |
| --------------- | ------------------------- | --------------------------------------------------------- |
| `font-base`     | Body text                 | `text-base font-normal`                                   |
| `font-heading`  | Section headings          | `text-xl font-semibold`                                   |
| `font-subtle`   | Hints, placeholder text   | `text-sm text-gray-500`                                   |
| `font-button`   | Button labels             | `text-sm font-medium uppercase`                           |
| `font-brand` 🆕 | Logo and tagline headings | `font-bold text-brand-primary text-2xl font-brand-custom` |

/_ In tailwind.config.js _/

`````ts
extend: {
  fontFamily: {
  brand: ['"Space Grotesk"', 'DM Sans', 'sans-serif'],
  },
}
````ts

### 1.2 Color Palette

| Role              | Value     | Tailwind Utility                         |
| ----------------- | --------- | ---------------------------------------- |
| Primary (default) | `#2563eb` | `bg-blue-600`, `text-blue-600`           |
| **Brand Primary** | `#5a31f4` | `bg-brand-primary`, `text-brand-primary` |
| **Brand Accent**  | `#00bfa5` | `bg-brand-accent`, `text-brand-accent`   |
| Error             | `#dc2626` | `bg-red-600`, `text-red-600`             |
| Success           | `#16a34a` | `bg-green-600`, `text-green-600`         |
| Warning           | `#f59e0b` | `bg-amber-500`, `text-amber-500`         |
| Background        | `#f9fafb` | `bg-gray-50`                             |
| Foreground        | `#111827` | `text-gray-900`                          |
| Subtle Text       | `#6b7280` | `text-gray-500`                          |
| Border/Lines      | `#e5e7eb` | `border-gray-200`                        |

1.3 Gradients (New)
| Token | Gradient | Tailwind Custom Class |
| ----------------- | ------------------------------------------- | --------------------- |
| Brand Gradient 🆕 | `linear-gradient(135deg, #5a31f4, #00bfa5)`              | `.bg-brand-gradient`     | Global header, empty state background     |

**Usage Guidelines:**

- Apply `.bg-brand-gradient` only in high-visibility zones:
  - Portfolio Page header
  - Empty portfolio state background
- Avoid applying to full layouts or dense UIs to preserve clarity
- Overlay only light or white text (`text-white`, `text-white/80`) for contrast
- Use sparingly to create a distinctive, branded visual moment


### 1.4 Visual Identity Tokens

| Asset        | Usage                        | Notes                                          |
| ------------ | ---------------------------- | ---------------------------------------------- |
| Logo Icon 🆕 | Crypture Vault SVG or “🔐”   | Use inline SVG or fallback emoji               |
| Font         | “Space Grotesk” + Sans       | Installed via Tailwind config, used in headers |
| Tagline      | "Track your crypto clearly." | Paired with logo only                          |


### 1.3 Spacing

| Token      | Pixels | Tailwind Utility |
| ---------- | ------ | ---------------- |
| `space-xs` | 4px    | `p-1`, `m-1`     |
| `space-sm` | 8px    | `p-2`, `m-2`     |
| `space-md` | 16px   | `p-4`, `m-4`     |
| `space-lg` | 24px   | `p-6`, `m-6`     |
| `space-xl` | 32px   | `p-8`, `m-8`     |

### 1.4 Border Radius & Shadow

| Element           | Tailwind Utility |
| ----------------- | ---------------- |
| General           | `rounded-lg`     |
| Button            | `rounded-md`     |
| Modal/Card        | `rounded-2xl`    |
| Shadow (default)  | `shadow-md`      |
| Shadow (elevated) | `shadow-lg`      |

### 1.5 Accessibility

- Text contrast: **≥4.5:1** (body), **≥3:1** (large/bold)
- All icons and buttons: `aria-label` or visible label
- Keyboard navigable, focus-visible styles

---

## 2. Atomic Components


### 2.1 Buttons

| Type      | Tailwind Classes                                                               | Usage                    |
| --------- | ------------------------------------------------------------------------------ | ------------------------ |
| Primary   | `bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200` | Main actions             |
| Secondary | `bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200` | Cancel, neutral          |
| Danger    | `bg-red-600 text-white font-button px-4 py-2 rounded-md hover:bg-red-700`      | Delete                   |
| Icon-only | `p-2 rounded-full hover:bg-gray-100`                                           | Icon actions, needs aria |
| Branded CTA 🆕 | `bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700` | High-visibility branded actions |



**Example:**

<!-- Branded CTA (e.g., Add Asset) -->
<button className="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700">
  ➕ Add Asset
</button>

<!-- Icon-only Button (Delete) -->
<button aria-label="Delete" className="p-2 rounded-full hover:bg-gray-100 text-red-600">
  🗑️
</button>
<!-- Branded secondary button example -->
<button className="bg-brand-accent text-white font-button px-4 py-2 rounded-md hover:bg-emerald-600">
  📥 Import Portfolio
</button>

`````

### 2.2 Inputs & Labels

- Use `text-base`, `rounded-md`, `border`, `focus:ring-brand-primary`
- Error: `border-red-600`, error text below field
- Disabled: `bg-gray-100`, `text-gray-400`

**Example:**

<!-- Branded Input Field with Focus Ring -->

<label htmlFor="qty" className="block font-subtle">Quantity</label>
<input
  id="qty"
  className="text-base rounded-md border border-gray-200 p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
/>
<span className="text-sm text-red-600 mt-1 block">⚠️ Invalid quantity.</span>

<!-- Branded select dropdown -->

<label htmlFor="asset" className="block font-subtle">Asset</label>
<select
id="asset"
className="text-base rounded-md border border-gray-200 p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none w-full">

  <option>BTC – Bitcoin</option>
  <option>ETH – Ethereum</option>
</select>

### 2.3 Icons

- Brand icons (e.g., Crypture Vault, Coin, Emoji) can be used in headers, empty states, and footers to reinforce brand identity.
- Use consistent icon set (e.g., Heroicons, Lucide)
- All icon-only controls must have `aria-label`

---

## 3. Branded Components

These high-level layout and feedback components apply Crypture’s brand identity using custom tokens and visual language defined in Sections 1 and 2.

### 3.1 Branded Header

````html
<header
  class="bg-brand-gradient text-white shadow-md rounded-b-lg px-6 py-4 flex items-center justify-between"
>
  <h1 class="font-brand flex items-center gap-3 text-brand-primary text-2xl">
    <span class="text-3xl">🔐</span> Crypture
    <span class="text-sm text-gray-500 font-subtle ml-2"
      >Track your crypto clearly</span
    >
  </h1>
</header>

### 3.2 Branded Footer ```html
<footer
  class="text-center text-sm text-gray-500 border-t border-gray-200 py-4 mt-12"
>
  Crypture • Clarity for every coin ·
  <a class="hover:text-brand-accent" href="#">About</a> ·
  <a class="hover:text-brand-accent" href="#">Privacy</a>
</footer>
````

### 3.3 Empty State

```html
<div class="text-center py-16 bg-brand-gradient text-white rounded-lg">
  <div class="text-5xl mb-4">🪙</div>
  <h2 class="font-brand text-brand-primary text-xl mb-2">
    Your portfolio is empty.
  </h2>
  <p class="text-gray-500 mb-4">Start by adding a crypto asset below.</p>
  <button
    class="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700"
  >
    ➕ Add Asset
  </button>
</div>
```

### 3.4 Spinner & Error Banner

### 3.5 Notification / Toast

**Purpose**: Provide brief, non-blocking feedback on user actions.

```html
<!-- Success Toast -->
<div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
  <div class="p-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900">Successfully added!</p>
        <p class="mt-1 text-sm text-gray-500">Added 1.5 BTC to your portfolio.</p>
      </div>
    </div>
  </div>
</div>

<!-- Error Toast -->
<div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
  <div class="p-4">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900">Action failed!</p>
        <p class="mt-1 text-sm text-gray-500">Could not save your changes.</p>
      </div>
    </div>
  </div>
</div>
```

```html
<!-- Spinner -->
<div
  class="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"
></div>

<!-- Error Banner -->
<div
  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4"
  role="alert"
>
  ⚠️ Something went wrong.
  <button class="ml-2 text-brand-primary underline hover:text-brand-accent">
    Retry
  </button>
</div>
```

## 4. Molecules

### 3.1 Asset Row

**Wireframe:** See Portfolio Table in `ui-wireframes.md`

```jsx
<tr>
  <td>
    BTC <span className="text-gray-500">(Bitcoin)</span>
  </td>
  <td>0.5</td>
  <td>$30,000</td>
  <td>$15,000</td>
  <td>
    <button aria-label="Delete" className="p-2 rounded-full hover:bg-gray-100">
      <TrashIcon />
    </button>
  </td>
</tr>
```

### 3.2 Sort/Filter Bar

```jsx
<div className="flex gap-2 items-center">
  <input
    type="text"
    placeholder="Filter assets by name or value"
    className="p-2 rounded-md border border-gray-200"
    aria-label="Filter assets"
  />
  <label className="sr-only" htmlFor="sort">
    Sort by
  </label>
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
    <label htmlFor="asset" className="block font-subtle">
      Asset
    </label>
    <select
      id="asset"
      className="w-full p-2 rounded-md border border-gray-200 mb-2"
    >
      <option>BTC</option>
      <option>ETH</option>
    </select>
    <span className="text-sm text-red-600">Error: Select an asset</span>
    <label htmlFor="qty" className="block font-subtle mt-2">
      Quantity
    </label>
    <input
      id="qty"
      type="number"
      className="w-full p-2 rounded-md border border-gray-200"
    />
    <span className="text-sm text-red-600">Error: Invalid quantity</span>
    <div className="flex gap-2 mt-4">
      <button
        type="submit"
        className="bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200"
      >
        Add Asset
      </button>
      <button
        type="button"
        className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
      >
        Cancel
      </button>
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

## 7. Brand Tone & Mood

### 🧠 Brand Traits

| Trait      | Description                            |
| ---------- | -------------------------------------- |
| Clear      | Transparent, no jargon                 |
| Empowering | Gives users confidence and clarity     |
| Modern     | Forward-looking, uses current patterns |
| Friendly   | Uses plain language + helpful icons    |

---

### 🎨 Moodboard

| Element | Example                             |
| ------- | ----------------------------------- |
| Color   | Deep Indigo `#5a31f4` (trust/tech)  |
| Accent  | Ocean Mint `#00bfa5` (fresh/action) |
| Font    | `"Space Grotesk", DM Sans`          |
| Icons   | Clean minimal: vault, coin, spark   |
| Tagline | “Track your crypto clearly.”        |
