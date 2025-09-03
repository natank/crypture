# 🐛 Bug Repository

This document serves as the central repository for tracking all bugs in the Crypture application. Each bug is assigned a unique ID and tracked through its lifecycle.

## Bug Status Legend
- 🆕 New
- 🔍 In Triage
- 🛠️ In Progress
- 👀 In Review
- ✅ Fixed
- 🚫 Won't Fix
- 📝 Duplicate

## Bug List

| ID  | Status | Title | Description | Steps to Reproduce | Expected Behavior | Actual Behavior | Environment | Priority | Created | Updated | Assignee |
|-----|--------|-------|-------------|-------------------|------------------|-----------------|-------------|----------|---------|---------|----------|
| BUG-005 | 🆕 New | Landing Page: Add disclaimer about no account/wallet connection needed | The landing page should clearly state that no account creation or wallet connection is required to use the app | 1. Visit the landing page<br>2. Check the 'How it works' section | Should clearly state that users can start without creating an account or connecting wallets | Missing clear communication about no account/wallet requirement | Production | P3 - Low | 2025-09-03 | 2025-09-03 | frontend@example.com |
| BUG-004 | 🆕 New | Landing Page: Update features section to reflect current capabilities | The features section mentions functionality not yet available | 1. Visit the landing page<br>2. Check the 'Features' section | Should accurately reflect current capabilities | Mentions profit/loss analysis and customizable dashboard which are not available | Production | P3 - Low | 2025-09-03 | 2025-09-03 | frontend@example.com |
| BUG-003 | 🆕 New | Floating-point precision error when adding asset quantities | Adding quantities of the same asset results in floating-point precision errors (e.g., 0.1 + 0.2 = 0.3000000000004) | 1. Add an asset with quantity 0.1<br>2. Add the same asset again with quantity 0.2<br>3. View the total quantity in the portfolio | 0.1 + 0.2 should equal 0.3 | Shows 0.3000000000004 due to floating-point arithmetic | All environments | P2 - Medium | 2025-08-31 | 2025-08-31 | frontend@example.com |
| BUG-002 | 🆕 New | Mobile: Asset list rows misaligned | Asset cards in mobile view have misaligned elements when quantity values have different lengths | 1. Open the app on a mobile device or use mobile view in browser<br>2. Add assets with different quantity lengths (e.g., 0.0001 BTC and 10 BNB) | All elements (Price, Total, delete icon) should maintain consistent vertical alignment | Right-aligned elements (Price, Total, delete icon) are misaligned between rows | Mobile view, all browsers | P2 - Medium | 2025-08-31 | 2025-08-31 | frontend@example.com |
| BUG-001 | ✅ Fixed | Portfolio total calculation incorrect | The total portfolio value doesn't update correctly when removing an asset | 1. Add multiple assets to portfolio<br>2. Remove one asset using the delete button | Total should recalculate immediately | Total remains unchanged until page refresh | All environments | P1 - High | 2025-08-31 | 2025-08-31 | dev@example.com |

## Adding a New Bug

To add a new bug, copy the following template and append it to the table above:

```markdown
| BUG-XXX | 🆕 New | [Brief title] | [Detailed description] | 1. [Step 1]<br>2. [Step 2] | [Expected] | [Actual] | [Environment] | PX - [Priority] | YYYY-MM-DD | YYYY-MM-DD | [Assignee] |
```

## Bug Lifecycle

1. **New**: Bug is reported and needs triage
2. **In Triage**: Under review by the team
3. **In Progress**: Assigned and being worked on
4. **In Review**: Fix is in code review
5. **Fixed**: Bug is resolved and verified
6. **Won't Fix**: Decided not to fix (include reason in description)
7. **Duplicate**: Already reported (link to original bug)

## Search Tips

- Use browser search (Ctrl+F/Cmd+F) to find bugs by:
  - ID (e.g., BUG-001)
  - Status (e.g., 🆕 New)
  - Assignee
  - Keywords in title/description

## Reporting Guidelines

1. Always check for existing bugs before reporting
2. Be specific and include reproduction steps
3. Include environment details
4. Attach screenshots when relevant
5. Update the status as the bug progresses
