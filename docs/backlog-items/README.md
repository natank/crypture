# Backlog Items Documentation

This folder contains documentation artifacts for backlog items following the [Software Development Plan](../software-development-plan.md).

## Folder Structure

```
backlog-items/
├── _template/                    # Template files - copy for new items
│   ├── requirements-analysis.md
│   ├── process-tailoring.md
│   ├── Preliminary Design/
│   │   └── preliminary-design-report.md
│   ├── Detailed Design/
│   │   └── detail-design-report.md
│   └── story-1/
│       ├── story.md
│       └── implementation-plan.md
│
└── backlog-item-{ID}/            # Actual backlog item folders
    └── ...
```

## Creating a New Backlog Item Folder

1. Copy the `_template` folder:
   ```bash
   cp -r docs/backlog-items/_template docs/backlog-items/backlog-item-{ID}
   ```

2. Update placeholders in all files (`{ID}`, `{Title}`, etc.)

3. Follow the [Software Development Plan](../software-development-plan.md) process

## File Purposes

| File | Purpose | When to Create |
|------|---------|----------------|
| `requirements-analysis.md` | Extract requirements from REQ doc | All items |
| `process-tailoring.md` | ALARP complexity assessment | All items |
| `preliminary-design-report.md` | High-level design | Medium/Complex items |
| `detail-design-report.md` | Detailed specifications | Complex items only |
| `story-N/story.md` | Story definition with acceptance criteria | All stories |
| `story-N/implementation-plan.md` | Task list per story | All stories |

## Legacy Items

Backlog items ≤ 23 were completed before this process and retain their original documentation in `docs/stories/`.
