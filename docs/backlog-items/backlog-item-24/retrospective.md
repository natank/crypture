
# Retrospective for backlog-item-24
## Human developer
What went good
The Code copilot worked very well, claude opus 4.5 model is a great improvement over the previous version. Quick understanding of the template and the codebase.

What went bad
- The initial prompt provided was taken from the software-development-plan:
'Review the current state of Backlog Item {ID}.
Check: process-tailoring.md, implementation plans, and any in-progress code.
Summarize where we left off and what's next.'

this prompt referenced a specific case for specific backlog-item. it didnt reffer the agent to the software development plan at all and it made the agent infer from the folder structure and template docs and miss important workflow details. the prompt should be more wide. 
I propose to change the prompt to:
'Review the software development plan and get familiarized with the project and workflow, then Summarize where we left off and what's next.'

for this to work, the sdp should instruct the agent to change the status of the backlog item to 'in progress' when starting to work on it. 

- there was an issue with the github branch for the backlog-item-24. and i mistakenly committed and pushed to the main branch. the sdp should instruct the agent to create a new branch (from the origin main branch) for the backlog-item before making any changes.

## AI Agent

### What went well
- **Regression debugging was effective**: Using a bisecting strategy (stash, test, incremental re-application) quickly identified the `useAlertPolling` hook as the root cause of E2E test failures.
- **Performance fix was targeted**: The fix using `useRef` for `priceMap` and `onAlertTriggered` was minimal and addressed the root cause (infinite re-render loop) without over-engineering.
- **E2E test suite is comprehensive**: 18 tests covering the full alert lifecycle (CRUD, mute/reactivate, badge updates, persistence) provide good regression protection.
- **Codebase patterns were followed**: New components, hooks, and services followed existing project conventions (file structure, naming, TypeScript types).

### What went wrong
- **Initial context was incomplete**: Without reading the SDP first, I inferred workflow from folder structure and templates. This led to missing important process steps like:
  - Not checking/updating the backlog item status in `product-backlog.md`
  - Not creating a feature branch before making changes
  - Not following the exact phase sequence defined in the SDP
- **Regression was introduced during implementation**: The `useAlertPolling` hook caused an infinite render loop that broke existing E2E tests. This should have been caught earlier with incremental testing during implementation.
- **Multiple `useAlerts` instances caused confusion**: The `PortfolioPage` and `AlertsPanel` each had their own `useAlerts` hook instance, leading to state sync issues. A shared context or prop drilling would have been cleaner.

### Lessons learned
1. **Always read the SDP first** when starting or resuming work on a backlog item
2. **Create feature branch immediately** before any code changes
3. **Run E2E tests after each significant change** to catch regressions early
4. **Be cautious with hook dependencies** - use refs for values that change frequently but shouldn't trigger re-renders

---

## Action Items Implemented

Based on this retrospective, the following changes were made to `docs/software-development-plan.md`:

### 1. Added branch creation step to Phase 1
```diff
+ 3. **Update status** in `product-backlog.md` to "In Progress"
+ 4. **Create feature branch**: `git checkout -b backlog-item-{ID}` (from latest `main`)
```

### 2. Updated "Resuming After a Break" prompt
Changed from:
```
Review the current state of Backlog Item {ID}.
Check: process-tailoring.md, implementation plans, and any in-progress code.
Summarize where we left off and what's next.
```

To:
```
Review the software development plan (docs/software-development-plan.md) to understand the project workflow.
Then check the current state of Backlog Item {ID} in docs/backlog-items/backlog-item-{ID}/.
Summarize where we left off and what's next.
```

### 3. Updated Quick Start Checklist
- Added status update step ("In Progress")
- Added feature branch creation step
- Clarified PR workflow in Completion section