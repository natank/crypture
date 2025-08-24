# 📘 Software Development Plan (SDP)

## 1. **Project Overview**

The Crypto Portfolio Tracker is a React + TypeScript application that allows users to manage their cryptocurrency holdings by adding assets, tracking real-time prices, and calculating portfolio value. The app begins as a monolithic component and is refactored using LLM assistance into modular, testable hooks.

## 2. **Objectives**

- Refactor a tightly coupled UI component into clean, reusable custom hooks.
- Improve maintainability, testability, and extensibility.
- Demonstrate LLM-assisted development workflows.
- Build a production-ready React application following software engineering best practices.

## 3. **Scope**

### Initial Feature Set

- Add crypto assets with quantity
- Fetch real-time prices via CoinGecko API
- Calculate and display total portfolio value
- Filter/sort assets by name/value
- Handle UI states (loading, error)

### Future Scope (Backlog Candidates)

- Persist portfolio in local storage or backend
- Add charting (price history)
- Enable user authentication
- Export/import portfolio data

## 4. **Project Roles and Responsibilities**

### 🧑‍💼 Product Owner Agent (PO Agent)

**Role Definition:** Responsible for maximizing the value of the product by managing the product backlog and ensuring the team builds the right product.

**Responsibilities:**

- Define and communicate the product vision.
- Maintain and prioritize the product backlog (e.g., refactor priorities, feature list).
- Clearly express backlog items, acceptance criteria, and sprint goals.
- Make trade-offs between scope, time, and quality based on goals.
- Accept or reject completed work based on the definition of done.
- Gather feedback and adjust backlog accordingly.

**Produces:**

- `docs/product-vision.md`
- `docs/product-backlog.md`

**Consumes:**

- `docs/sprint-planning.md`
- `docs/sprint-progress-tracker.md`

### 🧑‍🔧 Scrum Master Agent

**Role Definition:** Acts as a servant-leader who helps the team follow Scrum practices, facilitates events, and removes impediments to progress.

**Responsibilities:**

- Facilitate Scrum ceremonies: Sprint Planning and Review (adapted for solo workflow).
- Ensure the team adheres to Scrum values and practices.
- Shield the team from outside interruptions during a sprint.
- Help resolve blockers or escalate when needed.
- Coach the team (yourself) on agile and continuous improvement.
- Maintain and update sprint tracking tools.

**Produces:**

- `docs/sprint-planning.md`
- `docs/sprint-progress-tracker.md`

**Consumes:**

- `docs/product-vision.md`
- `docs/product-backlog.md`

### 👩‍💻 Developer Agent (Dev Agent)

**Role Definition:**  
The Developer Agent is a cross-functional implementer responsible for transforming backlog items into working software. They follow sprint plans to deliver modular, testable React + TypeScript code aligned with the design system, user stories, and product goals.

**Responsibilities:**

- use the sprint-planning to check the current story you work on and plan next step.
- Break down each committed user story into scoped, technical tasks using the documented strategy.
- Implement UI components, custom hooks, and state logic following Tailwind CSS design patterns and mockups.
- Collaborate with Designer and PO agents to clarify functionality and maintain usability.
- Handle visual feedback states, validation logic, and accessibility for all user-facing features.
- Write tests to ensure feature quality and stability:
  - **Unit & integration tests** using `vitest` + `@testing-library/react` (RTL).
  - **E2E tests using Playwright + POM** Follow the project-standard conventions in e2e-guide.md for folder structure, fixtures, and test writing patterns.
- Update the `sprint-planning.md` with a clear, structured task list for each user story.
- Follow component decomposition practices to isolate UI, logic, and side effects.
- Provide feedback during sprint review and suggest improvements to design or architecture.

**Produces:**

- Feature implementations inside `src/` (e.g., `pages/`, `hooks/`, `components/`)
- Unit tests and integration tests in `__tests__/` or colocated with components
- E2E test specs and page objects in `e2e/` using Playwright
- Updates to `docs/sprint-planning.md` under Technical Breakdown

**Consumes:**

- `docs/product-backlog.md` – Feature priorities and acceptance criteria
- `docs/style-guide.md`, `docs/ui-mockups.md` – UI structure and Tailwind usage
- `docs/sprint-planning.md` – Current Sprint goals and committed stories
- `docs/product-vision.md` – Context for user needs and design decisions

### 🎨 Designer Agent

**Role Definition:**  
Responsible for creating user interface wireframes, mockups, and visual components that align with the product vision and usability goals. Ensures the design is intuitive and accessible for target user personas, especially non-technical users.

**Responsibilities:**

- Translate user stories and backlog items into wireframes and UI mockups.
- Create responsive layouts suitable for desktop and mobile.
- Define consistent styling components (e.g., typography, buttons, icons).
- Collaborate with the PO Agent to refine user experience for target personas.
- Provide assets and visual specifications to the Developer Agent.
- Iterate on designs based on usability feedback and sprint review outcomes.

**Produces:**

- `docs/ui-wireframes.md` – Low-fidelity wireframes for major user flows.
- `docs/ui-mockups.md` – High-fidelity visual mockups with styling details.
- `docs/style-guide.md` – Design system: typography, colors, spacing, components.
- `designer-activity-plan.md` - Step-by-step plan outlining the Designer Agent’s process for translating product requirements into UI deliverables.
  **Consumes:**

- `docs/product-vision.md`
- `docs/product-backlog.md`
- `docs/sprint-planning.md` (for awareness of upcoming features)
- `docs/designer-activity-plan.md` – Self-authored guide used for tracking and iterating on design responsibilities and progress.

## 5. **Development Approach**

- **Agile with Solo Workflow**: Short sprints with planning, implementation, and review.
- **LLM-Assisted Refactoring**: Use ChatGPT to extract and optimize logic into hooks.
- **Refactor-First Strategy**: Begin with restructuring before adding new features.
- **Source Control**: Git with branches for each sprint or task.
- **Documentation**: Markdown-based docs for all phases.

## 6. **System Architecture**

### Before Refactor

```
/src
└── pages/
    └── Portfolio.tsx (monolithic)
```

### After Refactor

```
/src
├── hooks/
│   ├── usePortfolio.ts
│   └── useCryptoPrices.ts
└── pages/
    └── Portfolio.tsx (UI-focused)
```

## 7. **Tech Stack**

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **API**: CoinGecko or mock API
- **Bundler**: Vite
- **Tools**: Git, ChatGPT, Markdown docs

## 8. **Documentation Plan**

| Document                     | Maintained By     | Description                           |
| ---------------------------- | ----------------- | ------------------------------------- |
| `product-vision.md`          | PO Agent          | High-level goals and success criteria |
| `product-backlog.md`         | PO Agent          | Prioritized feature list              |
| `sprint-planning.md`         | Scrum Master, Dev | Sprint goals and task breakdown       |
| `sprint-progress-tracker.md` | Scrum Master      | Daily/weekly progress updates         |

## 9. **Testing Strategy**

- **Unit Tests**: For custom hooks (e.g., portfolio logic, price fetcher)
- **Integration Tests**: For state updates and API behavior
- **Manual Testing**: For UI rendering and user workflows
- **Testability Focus**: Refactor for testability using SRP and modular design

---

## 10. **Pull Request Process & Template**

To ensure consistent, traceable changes aligned with backlog and sprint planning:

- **Template Location**: See `.github/PULL_REQUEST_TEMPLATE.md` for the required PR structure.
- **Required Traceability**: Each PR must link to:
  - `docs/product-backlog.md` story section (ID and title)
  - `docs/sprint-planning.md` corresponding sprint/story section
  - Any relevant E2E/Unit test specs added or changed
- **Content Checklist** (enforced by the template): Summary, Changes, Files Changed, Acceptance Criteria mapping, How to Test, Screenshots (if UI), Notes, Linked Work, and a completion Checklist (lint/tests/a11y/docs).
- **Usage**: When opening a PR on GitHub, the template auto-populates. Fill all sections before requesting review.
