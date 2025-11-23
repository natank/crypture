# Agentic Development Workflow

## Overview

This document outlines the step-by-step workflow for implementing backlog items using an agentic development approach with built-in review gates.

---

## 1. Grooming

**Objective:** Select and prioritize the next backlog item for development.

### Actions

1. Review the backlog items list
2. Present candidate items for the sprint
3. Discuss priority, dependencies, and readiness
4. Select the next item to move into development

### Review Gate

**Ask for approval before proceeding to requirements review.**

---

## 2. Requirements Review

**Objective:** Establish clear requirements and acceptance criteria before beginning development.

### Actions

1. Create a new branch for this item from the latest `main` branch
2. Prepare a user story and acceptance criteria for this item
3. Save the story in a `.md` file located in the `docs/stories` folder. Use docs/stories/STORY-999-demo-feature.md as template

4. Present the story for review and approval

### Review Gate

**Ask for approval before committing.**

---

## 3. Preliminary Design Review

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

## 4. Implementation Plan

**Objective:** Execute development following test-driven development (TDD) practices.

### Approach

- Follow a **TDD approach**, starting with end-to-end (E2E) tests
- For unit testing: write tests **before** implementing each function/component
- Continuously verify implementation against requirements and design

---

## 5. Validation

**Objective:** Ensure code quality and completeness before merging.

### Verification Checklist

- [ ] All regression tests are passing
- [ ] All unit tests are passing
- [ ] No lint errors exist in the branch

### Review Gate

**Ask for approval before committing.**

---

## 6. Acceptance

**Objective:** Confirm completion and update tracking systems.

### Actions

- Present the completed work for final acceptance review
- Upon approval, update the story status
- Update the backlog item status

### Review Gate

**Ask for approval before updating story status and backlog item status.**

---

## Notes

- Each phase includes a review gate to ensure quality and alignment
- The workflow emphasizes incremental validation and stakeholder approval
- Test-driven development is central to the implementation approach