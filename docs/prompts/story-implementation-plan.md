## Prerequisites

- **Requirements Analysis Completed:** The User Story must be defined and approved via the [Backlog Item Analysis & Breakdown Workflow](backlog-item-implementation-plan.md).
- **Story Document:** A specific `.md` file for this story exists in `docs/stories/`.

## 1. Preliminary Design Review

**Objective:** Validate architectural and UX decisions before implementation.

### Actions

Create a preliminary design that addresses:

- Architectural changes and validations
- UX changes, adhering to the current style guide and UX approach
  - Information hierarchy
  - Navigation patterns
  - Other relevant UX concerns
- Any other technical or design considerations

### Documentation

- Include design details in a separate **Preliminary Design** section within the story document
- Keep the story document clear and well-structured
- Avoid duplication of information

### Review Gate

**Ask for approval before committing.**

---

## 2. Implementation Plan

**Objective:** Execute development following test-driven development (TDD) practices.

### Testing Framework

- **E2E Tests**: Use **Playwright** (located in `frontend/src/e2e/specs/`)
  - Use existing fixtures from `@e2e/fixtures` for consistent test patterns
  - Run individual tests during debugging: `npx playwright test <file> -g "test name"`
- **Unit Tests**: Use **Vitest** (located in `frontend/src/__tests__/`)
  - Follow existing test patterns and naming conventions

### TDD Approach

**Critical: Write tests BEFORE implementation**

1. **E2E Tests First**
   - Write E2E tests for the feature based on acceptance criteria
   - Tests will fail initially (red phase)
   - Use these tests to guide implementation

2. **Unit Tests Before Each Component/Function**
   - For each service method: Write unit tests → Implement method → Verify tests pass
   - For each component: Write component tests → Implement component → Verify tests pass
   - **Do not implement without tests first**

3. **Iterative Development**
   - Write test for one small piece of functionality
   - Implement just enough code to make that test pass
   - Refactor if needed
   - Repeat for next piece

4. **Continuous Verification**
   - Run tests frequently during implementation
   - Debug failing tests individually rather than running entire suite
   - Fix issues as they arise before moving forward

### Branch Management

- Create a feature branch for the story (e.g., `feature/STORY-XXX-description`)
- Commit frequently with clear, descriptive messages
- **Do not proceed to Step 3 until all tests are passing**

---

## 3. Validation

**Objective:** Ensure code quality and completeness before merging.

### Verification Checklist

- [ ] All regression tests are passing
- [ ] All unit tests are passing
- [ ] No lint errors exist in the branch

### Review Gate

**Ask for approval before committing.**

---

## 4. Acceptance

**Objective:** Confirm completion and update tracking systems.

### Actions

- Present the completed work for final acceptance review
- Upon approval, update the story status
- Update the backlog item status

### Review Gate

**Ask for approval before updating story status and backlog item status.**

---

## 5. Pull Request Preparation

**Objective:** Document changes for code review and merge process.

### Actions

Prepare a comprehensive pull request description
Include the following in the PR description:

Summary of changes
Reference to the story document
Key implementation decisions
Testing approach and coverage
Any breaking changes or migration notes


Add the PR description to a Pull Request section in the story document

Review Gate
Ask for approval before committing the pull request.

---

## Notes

- Each phase includes a review gate to ensure quality and alignment
- The workflow emphasizes incremental validation and stakeholder approval
- Test-driven development is central to the implementation approach