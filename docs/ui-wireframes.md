# 📐 UI Wireframes – Low Fidelity

> Created by Designer Agent · Based on `product-vision.md`, `product-backlog.md`, and `designer-activity-plan.md`

---

## 🧾 Portfolio Overview Page

```
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
```

**Annotations**:

- Header shows real-time portfolio value.
- Sort/filter bar helps users navigate assets.
- Asset list includes delete buttons and auto-refresh price/value.
- Footer includes buttons for Add, Export, Import.

---

## ➕ Add Asset Modal/Form

```
+----------------- Add Crypto Asset ------------------+
| Asset: [ 🔽 BTC          ]                         |
| Qty:   [ 0.5           ]                          |
| [➕ Add Asset]   [❌ Cancel]                        |
|                                                   |
| (⚠️ Error: Invalid quantity)                      |
+----------------------------------------------------+
```

**Annotations**:

- Dropdown or autocomplete for asset selection.
- Numeric input for quantity.
- Validation errors displayed inline.
- Loading state on "Add" action, fields disabled during submit.

---

## 📃 Asset List (Expanded View)

```
+-------------------------------------------------------------+
| BTC (Bitcoin)                                              |
| Quantity: 0.5      Price: $30,000     Total: $15,000       |
| [🗑️ Delete]   [⚠️ Price Fetch Failed] (if error state)      |
+-------------------------------------------------------------+
| ETH (Ethereum)                                             |
| Quantity: 1.2      Price: $2,000     Total: $2,400         |
| [🗑️ Delete]                                              |
+-------------------------------------------------------------+
```

**Annotations**:

- Each asset card shows key info.
- Inline delete button.
- Inline error badge for failed price fetch.

---

## 🔁 Loading and Error States

```
[🔄 Loading spinner... Fetching data]

[⚠️ Error loading prices. Try again later.]
[🔁 Retry]
```

**Annotations**:

- Global spinner during app load.
- Inline spinners during individual fetches.
- Error messages include retry actions.

---

## 🔍 Sort/Filter Bar

```
[ 🔍 Search assets...     ]   Sort: [⬇ Name | ⬆ Value]
```

**Annotations**:

- Text input filters asset list (partial matches).
- Dropdown toggles sort order and type.

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
