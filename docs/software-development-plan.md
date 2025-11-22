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

## 4. **Quality Assurance & Bug Tracking**

For detailed information about our bug tracking process, please see the [Bug Tracking Workflow](./bug-tracking-workflow.md) document.

### Key QA Processes:
- **Test Planning**: All features must include test plans in their technical specifications
- **Test Automation**: Unit, integration, and E2E tests are required for all new features
- **Bug Triage**: Regular triage meetings to prioritize and assign bugs
- **Quality Gates**: All code must pass automated tests and code review before merging
- **Release Testing**: Full regression testing before each release

### 🚀 Release Process

1. **Pre-Release**
   - Complete all features for the release
   - Verify all critical and high-priority bugs are resolved
   - Update version number in package.json
   - Update CHANGELOG.md with release notes
   - Ensure all tests are passing
   - Perform final QA verification including regression testing
   - Confirm all known issues are documented and triaged

2. **Release**
   - Create release branch (release/vX.Y.Z)
   - Merge to main branch
   - Create version tag (vX.Y.Z)
   - Push tags to trigger CI/CD pipeline
   - Verify successful deployment to staging environment
   - Perform smoke testing on staging

3. **Post-Release**
   - Verify production deployment
   - Monitor for any issues in production
   - Update documentation if needed
   - Conduct post-release review meeting
   - Document lessons learned for next release

## 5. **Project Roles and Responsibilities**

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

- `docs/product-backlog.md` - Prioritized backlog with status tracking
- `docs/requirements/*.md` - Detailed requirements
- `docs/stories/*.md` - User stories with implementation status

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

- Facilitates planning sessions using product backlog and stories
- Tracks progress through status updates in backlog items and story documents

**Consumes:**

- `docs/product-vision.md`
- `docs/product-backlog.md`

### 👩‍💻 Developer Agent (Dev Agent)

**Role Definition:**  
The Developer Agent is a cross-functional implementer responsible for transforming backlog items into working software. They follow sprint plans to deliver modular, testable React + TypeScript code aligned with the design system, user stories, and product goals.

**Responsibilities:**

- Check `product-backlog.md` for prioritized items and their status.
- Review story documents in `docs/stories/` for current work and next steps.
- Break down each committed user story into scoped, technical tasks using the documented strategy.
- Implement UI components, custom hooks, and state logic following Tailwind CSS design patterns and mockups.
- Collaborate with Designer and PO agents to clarify functionality and maintain usability.
- Handle visual feedback states, validation logic, and accessibility for all user-facing features.
- Write tests to ensure feature quality and stability:
  - **Unit & integration tests** using `vitest` + `@testing-library/react` (RTL).
  - **E2E tests using Playwright + POM** Follow the project-standard conventions in e2e-guide.md for folder structure, fixtures, and test writing patterns.
- Update story documents with task breakdown and implementation notes.
- Follow component decomposition practices to isolate UI, logic, and side effects.
- Provide feedback during sprint review and suggest improvements to design or architecture.

**Produces:**

- Feature implementations inside `src/` (e.g., `pages/`, `hooks/`, `components/`)
- Unit tests and integration tests in `__tests__/` or colocated with components
- E2E test specs and page objects in `e2e/` using Playwright
- Updates to story documents in `docs/stories/` with technical breakdown and progress

**Consumes:**

- `docs/product-backlog.md` – Feature priorities, status, and acceptance criteria
- `docs/requirements/*.md` – Detailed product requirements
- `docs/stories/*.md` – Current stories and implementation plans
- `docs/style-guide.md`, `docs/ui-mockups.md` – UI structure and Tailwind usage
- `docs/product-vision.md` – Context for user needs and design decisions

### 🧪 Test Engineer (QA Agent)

**Role Definition:** Ensures the quality and reliability of the application through systematic testing and validation.

**Responsibilities:**

- Develop and maintain automated test suites
- Perform manual testing of new features
- Identify, document, and track bugs using the [Bug Tracking Workflow](./bug-tracking-workflow.md)
- Verify bug fixes and perform regression testing
- Ensure test coverage meets project standards
- Collaborate with developers to reproduce and resolve issues
- Maintain test environments and test data
- Lead bug triage meetings
- Report on quality metrics and testing status

**Produces:**

- Test plans and test cases
- Bug reports and test execution reports
- Test automation code
- Quality metrics and test coverage reports
- Release readiness assessments

**Consumes:**

- `docs/product-backlog.md` – Feature priorities, status, and acceptance criteria
- `docs/requirements/*.md` – Detailed product requirements
- `docs/stories/*.md` – User stories with test scenarios
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
- `docs/product-backlog.md` – For prioritized features and status
- `docs/requirements/*.md` – For detailed feature requirements
- `docs/designer-activity-plan.md` – Self-authored guide used for tracking and iterating on design responsibilities and progress.

## 5. **Development Approach**

- **Agile with Solo Workflow**: Short sprints with planning, implementation, and review.
- **LLM-Assisted Refactoring**: Use ChatGPT to extract and optimize logic into hooks.
- **Refactor-First Strategy**: Begin with restructuring before adding new features.
- **Source Control**: Git with branches for each sprint or task.
- **Documentation**: Markdown-based docs for all phases.

## 6. **System Architecture**
r

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

The project follows a structured documentation process to ensure traceability and clarity.

### Documentation Hierarchy

1.  **Product Backlog (`docs/product-backlog.md`)**: The single source of truth for all features. Items are tracked in a table with IDs and links to requirements.
2.  **Requirements (`docs/requirements/REQ-[ID]-[Name].md`)**: Detailed product requirements linked to backlog items. Each requirement document defines functional and non-functional requirements.
3.  **User Stories (`docs/stories/STORY-[ID]-[Name].md`)**: Implementation-ready stories linked to requirements. Each story includes description, acceptance criteria, planning, architecture, and task breakdown.

### Traceability Flow
`Backlog Item` -> `Requirement` -> `User Story`

### Artifacts Table

| Document | Maintained By | Description |
| :--- | :--- | :--- |
| `product-vision.md` | PO Agent | High-level goals and success criteria |
| `product-backlog.md` | PO Agent | Prioritized feature list with status and links to requirements |
| `requirements/*.md` | PO Agent | Detailed product requirements with traceability |
| `stories/*.md` | PO Agent / Dev | User stories with implementation plans, tasks, and status |
| `a11y-utilities.md` | Dev | Shared CSS utilities for accessibility and mobile UX |
| `icon-component.md` | Dev | Guidance and API for standardized, accessible icons |

## 9. **Testing Strategy**

- **Unit Tests**: For custom hooks (e.g., portfolio logic, price fetcher)
- **Integration Tests**: For state updates and API behavior
- **Manual Testing**: For UI rendering and user workflows
- **Testability Focus**: Refactor for testability using SRP and modular design

---

## 10. **Pull Request Process & Template**

To ensure consistent, traceable changes aligned with product backlog:

- **Template Location**: See `.github/PULL_REQUEST_TEMPLATE.md` for the required PR structure.
- **Required Traceability**: Each PR must link to:
  - `docs/product-backlog.md` backlog item (ID and title)
  - `docs/requirements/REQ-XXX-name.md` corresponding requirement document
  - `docs/stories/STORY-XXX-name.md` corresponding story document
  - Any relevant E2E/Unit test specs added or changed
- **Accessibility Guidance**: Follow `docs/a11y-utilities.md` and `docs/icon-component.md` for focus, touch targets, and icon labeling. Reference these in PRs when a11y is impacted.
- **Content Checklist** (enforced by the template): Summary, Changes, Files Changed, Acceptance Criteria mapping, How to Test, Screenshots (if UI), Notes, Linked Work, and a completion Checklist (lint/tests/a11y/docs).
- **Usage**: When opening a PR on GitHub, the template auto-populates. Fill all sections before requesting review.
