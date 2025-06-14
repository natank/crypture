# 🎨 Designer Activity Plan

This document outlines the step-by-step plan for the Designer Agent to fulfill their role in the Crypto Portfolio Tracker project. It is based on the product vision, product backlog, and software development plan.

---

## 🧭 Overview

**Objective**: Design an intuitive and accessible UI for casual and new crypto users that supports core features such as manual asset entry, real-time tracking, and clear portfolio visualization.

**Design Priorities**:

- Clarity for non-technical users
- Responsive layout
- Minimal but informative design
- Tailwind-compatible components
- Consistency across all visual elements

---

## ✅ Step-by-Step Plan

### **Step 1: Audit Key User Stories for Design Scope** - DONE

- **Goal**: Identify which user stories in the backlog require UI design.
- **Deliverable**: A matrix mapping UI elements to backlog items.

#### 📋 Design Coverage Matrix

| User Story ID | Feature Title                               | UI Requirements                                                 | Design Scope Summary                                              |
| ------------- | ------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1             | Add Crypto Asset with Quantity              | Input field, asset selector, validation states, “Add” button    | **Add Asset Form/Modal** – core entry point with clear UX         |
| 2             | Delete Crypto Asset                         | Delete button/icon, confirmation dialog                         | **Asset List UI** – interactive row with delete interaction       |
| 3             | Calculate and Display Total Portfolio Value | Prominent total value display, auto-refresh behavior            | **Portfolio Overview Header** – real-time value indicator         |
| 4             | Fetch Real-Time Prices                      | Price display in each asset row, error state if API fails       | **Asset List UI** – price tag, error badges                       |
| 5             | Real-Time Value Updates                     | Dynamic updates without page reload                             | **Stateful Display Hooks** – mock loading animations, transitions |
| 6             | Filter/Sort Assets                          | Dropdowns for sorting, search field for filtering               | **Sort/Filter Bar** – clear UX patterns                           |
| 7             | Handle UI States (Loading, Error)           | Spinners, error banners, disabled states                        | **Loading and Error States** – layered feedback elements          |
| 8             | Intuitive Interface for Non-Technical Users | Placeholder text, iconography, tooltip support                  | **Design Language Guide** – baseline for all screens              |
| 10            | Export/Import Portfolio                     | Buttons for “Export” / “Import,” file input modal, preview area | **Export/Import Controls** – bottom nav or modal trigger          |

---

#### 🧩 Key Screens Identified for Design (feeds into Step 2)

- **Portfolio Overview Page**
- **Add Asset Form/Modal**
- **Asset List with Inline Actions (delete, price)**
- **Loading and Error States**
- **Sort/Filter Bar**
- **Export/Import Controls**

### **Step 2: Define Core Screens and Flows** - DONE

- **Goal**: Establish the main UI surfaces for wireframing.

#### 📱 Portfolio Overview Page

**Purpose**: Central dashboard showing the user’s total portfolio value and list of crypto assets.  
**Elements**:

- Total value header (real-time updates)
- Summary of current holdings
- Entry point for Add Asset Modal
- Sort/filter controls
- Export/import buttons (stub for future)
- Empty state for first-time users

#### ➕ Add Asset Form/Modal

**Purpose**: Allows users to manually add a cryptocurrency with a specified quantity.  
**Elements**:

- Input for asset name/symbol (autocomplete dropdown)
- Quantity input (numeric with validation)
- “Add” button (with loading state)
- Error display for invalid inputs
- Form reset behavior on success

#### 📃 Asset List with Inline Actions

**Purpose**: Displays the user’s portfolio in a tabular or card format with real-time prices.  
**Elements**:

- Asset name, quantity, current price, total value
- Delete button/icon for each asset
- Dynamic refresh behavior as prices update
- Visual error badge if price fetching fails

#### 🔁 Loading and Error States

**Purpose**: Show appropriate feedback during async operations.  
**Elements**:

- Global loading spinner (initial fetch)
- Inline spinners for price fetch
- Error banners or inline messages with retry options
- Disabled form elements during API calls

#### 🔍 Sort/Filter Bar

**Purpose**: Helps users organize and navigate their holdings.  
**Elements**:

- Filter input (search by asset name)
- Sorting dropdown (name/value, ascending/descending)
- Responsive layout (stacked or inline depending on screen size)

#### 📤 Export/Import Controls (Future)

**Purpose**: Enable data portability via CSV/JSON.  
**Elements (stubbed initially)**:

- “Export” and “Import” buttons (with icons)
- Import modal with file upload and preview (design in future sprint)

### **Step 3: Create Low-Fidelity Wireframes (`ui-wireframes.md`)** - DONE -

- **Goal**: Rapidly prototype layout and flow using simple visuals.
- **Method**: Annotated diagrams or markdown-based visuals.

### **Step 4: Establish Design System (`style-guide.md`)** - DONE -

- **Goal**: Define visual language for consistency and usability.
- **Includes**:

  - Typography and scale
  - Color palette and contrast rules
  - Button/input/icon styles
  - Layout grid and spacing rules

### **Step 5: Produce High-Fidelity Mockups (`ui-mockups.md`)** - DONE -

- **Goal**: Create detailed visuals that guide development.
- **Focus**: Visual clarity, responsiveness, and usability.

### **Step 6: Review & Iterate Based on Sprint Scope**

- **Goal**: Adjust designs in sync with sprint stories and feedback.
- **Method**: Collaboration with PO/Dev/Scrum agents and revision based on sprint planning.

---

## 📂 Document Relationships

**Produces:**

- `docs/ui-wireframes.md`
- `docs/ui-mockups.md`
- `docs/style-guide.md`
- `docs/designer-activity-plan.md`

**Consumes:**

- `docs/product-vision.md`
- `docs/product-backlog.md`
- `docs/sprint-planning.md`
- `docs/designer-activity-plan.md` (as ongoing reference)
