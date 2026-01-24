# Software Development Plan

## Overview

This document defines a structured software development process for **Developer + AI collaboration**. It follows a traditional SDLC methodology, tailored using **ALARP** (As Low As Reasonably Practicable) based on backlog item complexity.

**Roles:**

- **Product Owner**: Defines backlog items and requirements
- **Developer**: Designs, implements, tests, and documents with AI assistance
- **AI Tool**: Assists in all phases, tailors process complexity, maintains traceability

---

## Process Phases

```
Backlog Item → Requirement → Stories/Tasks → Design → Implementation → Testing → PR Description → Done
```

| Phase                       | Owner          | Output                            |
| --------------------------- | -------------- | --------------------------------- |
| 1. Backlog Item             | Product Owner  | Entry in `product-backlog.md`     |
| 2. Requirement              | Product Owner  | `docs/requirements/REQ-XXX-*.md`  |
| 3. Stories                  | Developer + AI | Story breakdown with traceability |
| 4. Process Tailoring        | AI             | `process-tailoring.md`            |
| 5. Preliminary Design       | Developer + AI | `preliminary-design-report.md`    |
| 6. Detailed Design          | Developer + AI | `detail-design-report.md`         |
| 7. Implementation           | Developer + AI | Code + tests                      |
| 8. Testing                  | Developer + AI | Unit + E2E tests passing          |
| 9. Pull Request Description | Developer + AI | `pull-request-description.md`     |
| 10. Done                    | Developer      | PR merged                         |

---

## Phase Details

### Phase 1: Backlog Item Selection

**Input**: `docs/product-backlog.md`

1. Select a pending backlog item
2. Note the ID, title, priority, and related requirement
3. **Update status** in `product-backlog.md` to "In Progress"
4. **Create feature branch**: `git checkout -b backlog-item-{ID}` (from latest `main`)
5. Create folder: `docs/backlog-items/backlog-item-{ID}/`

### Phase 2: Requirement Analysis

**Input**: Requirement doc from `docs/requirements/`

1. Read the linked requirement document
2. Create `requirements-analysis.md` with:
   - Key functional requirements extracted
   - Non-functional requirements (if any)
   - Dependencies on other backlog items
   - Assumptions and constraints

### Phase 3: Story/Task Breakdown

**Output**: Stories/Tasks in `docs/backlog-items/backlog-item-{ID}/[story/task]-{N}/`

1. Break the requirement into atomic stories/tasks
2. Each story/task should be:

   - **Independent**: Can be completed on its own
   - **Testable**: Has clear acceptance criteria
   - **Small**: Fits in a single development session

3. Add traceability links:
   - Story/Task → Requirement
   - Requirement → Stories/Tasks (update requirement doc)

### Phase 4: Process Tailoring (AI-Driven)
**Input**: a story/task doc from `docs/backlog-items/backlog-item-{ID}/[story/task]-{N}/`
**Output**: `process-tailoring.md`

The AI evaluates complexity and tailors the process using ALARP:

| Complexity  | Criteria                                            | Tailored Process                               |
| ----------- | --------------------------------------------------- | ---------------------------------------------- |
| **Simple**  | Single component, no new patterns, <50 lines        | Skip design docs, implement directly           |
| **Medium**  | Multiple components, known patterns, 50-200 lines   | Brief preliminary design, skip detailed design |
| **Complex** | New architecture, external integrations, >200 lines | Full design documents                          |

**Tailoring Template:**

```markdown
## Process Tailoring

**Backlog Item**: {ID} - {Title}
**Assessed Complexity**: Simple / Medium / Complex

### Justification

{Why this complexity level was chosen}

### Tailored Deliverables

- [ ] Requirements Analysis: Yes / Skip
- [ ] Preliminary Design: Yes / Skip
- [ ] Detailed Design: Yes / Skip
- [ ] Stories/Tasks: {Number of stories/Tasks}

### Tailored Tasks

{List of tasks based on complexity}
```

### Phase 5: Preliminary Design

**Output**: `Preliminary Design/preliminary-design-report.md`

**When**: Medium or Complex items

**Contents:**

1. **UX/UI Design**: Wireframes, user flow, layout
2. **Technical Approach**: High-level architecture, data flow
3. **Component Overview**: New/modified components
4. **API Changes**: Endpoints, types, services
5. **Risks & Mitigations**: Known challenges

### Phase 6: Detailed Design

**Output**: `Detailed Design/detail-design-report.md`

**When**: Complex items only

**Contents:**

1. **Component Specifications**: Props, state, behavior
2. **Data Models**: Types, interfaces, schemas
3. **Integration Points**: How components interact
4. **Error Handling**: Edge cases, fallbacks
5. **Performance Considerations**: Caching, lazy loading

### Phase 7: Implementation

**Output**: Working code with tests

For each story/task:

1. Create `[story/task]-{N}/implementation-plan.md`:

   ```markdown
   ## Implementation Plan

   **Story/Task**: {Title}
   **Estimated Effort**: {Hours}

   ### Sub-Task List

   - [ ] Task 1: {Description}
   - [ ] Task 2: {Description}
         ...

   ### Files to Create/Modify

   - `path/to/file.tsx` - {Purpose}
   ```

2. Implement sub-tasks in order
3. Write tests alongside code
4. Update implementation plan as completed

### Phase 8: Testing

**Checklist:**

- [ ] Unit tests for new components/functions
- [ ] E2E tests for user-facing features
- [ ] All existing tests passing
- [ ] Manual smoke test in browser

### Phase 9: Pull Request Description

**Output**: `pull-request-description.md`

**When**: After all stories are complete and tested

**Contents:**

1. **Overview**: Brief summary of the feature
2. **What Changed**: New features and modifications
3. **New Components**: List of new files/components
4. **Modified Components**: List of changed files
5. **Implementation Details**: Technical approach, key algorithms
6. **Testing**: Test coverage summary (unit + E2E)
7. **Accessibility**: A11y features and compliance
8. **Documentation**: Links to created docs
9. **Screenshots**: Visual examples (text-based or images)
10. **Breaking Changes**: Any breaking changes (if applicable)
11. **Migration Guide**: How to migrate (if needed)
12. **Checklist**: Completion checklist
13. **Related Issues**: Links to backlog items and requirements
14. **Commits**: Summary of commit messages
15. **Reviewer Notes**: Key areas to review, testing instructions
16. **Performance Impact**: Bundle size, runtime impact
17. **Future Enhancements**: Deferred improvements

**Template Reference**: See `docs/backlog-items/backlog-item-{ID}/pull-request-description.md` for examples

### Phase 10: Done

**Checklist:**

- [ ] All acceptance criteria met
- [ ] Tests passing (unit + E2E)
- [ ] Story docs updated with implementation notes
- [ ] Pull request description created
- [ ] PR created with:
  - Summary of changes
  - Files changed
  - Testing performed
  - Screenshots (if UI changes)
- [ ] PR reviewed and merged to `main`
- [ ] Update `product-backlog.md` status to "Done"

---

## Folder Structure

```
docs/backlog-items/
└── backlog-item-{ID}/
    ├── requirements-analysis.md
    ├── process-tailoring.md
    ├── Preliminary Design/
    │   └── preliminary-design-report.md
    ├── Detailed Design/
    │   └── detail-design-report.md
    ├── pull-request-description.md
    └── story-{N}/
        └── implementation-plan.md
```

---

## Quick Start Checklist

Use this checklist when starting a new backlog item:

```markdown
## Backlog Item {ID}: {Title}

### Setup

- [ ] Read backlog item in `product-backlog.md`
- [ ] Read linked requirement doc
- [ ] Update backlog item status to "In Progress" in `product-backlog.md`
- [ ] Create feature branch: `git checkout -b backlog-item-{ID}` (from latest `main`)
- [ ] Create folder `docs/backlog-items/backlog-item-{ID}/`

### Planning

- [ ] Create `requirements-analysis.md`
- [ ] AI: Assess complexity and create `process-tailoring.md`
- [ ] Break into stories (if needed)

### Design (based on tailoring)

- [ ] Preliminary Design (if Medium/Complex)
- [ ] Detailed Design (if Complex)

### Implementation

- [ ] Create implementation plan for each story/task
- [ ] Implement and test
- [ ] Update docs with implementation notes

### Completion

- [ ] All tests passing
- [ ] Create pull request description (`pull-request-description.md`)
- [ ] Push feature branch and create PR
- [ ] PR reviewed and merged to `main`
- [ ] Update `product-backlog.md` status to "Done"
```

---

## Working with AI

### Resuming After a Break

Ask AI to review:

```
Review the software development plan (docs/software-development-plan.md) to understand the project workflow.
Then check the current state of Backlog Item {ID} in docs/backlog-items/backlog-item-{ID}/.
Summarize where we left off and what's next.
```

```
Review the software development plan (docs/software-development-plan.md) to understand the project workflow.
Then check the current state of Backlog Items in docs/product-backlog.md and and what's next. if all set, proceed with the next backlog item according to the sdp doc.

### AI Responsibilities

1. **Assess complexity** and tailor process (ALARP)
2. **Maintain traceability** between artifacts
3. **Generate design docs** based on tailoring
4. **Create implementation plans** with task lists
5. **Write code and tests** following existing patterns
6. **Track progress** in implementation plans

---

## Legacy Items

Backlog items completed before this process was adopted (ID ≤ 23) retain their original documentation structure. This process applies to **new backlog items only**.
```
