# GTD (Getting Things Done) System

This folder contains non-development tasks managed using GTD methodology. This runs parallel to the development backlog in `../backlog-items/`.

## Directory Structure

```
gtd/
├── inbox/              # Quick capture of all incoming tasks
├── projects/           # Multi-step outcomes needing >1 action
├── actions/            # Next physical actions (context-based)
├── waiting-for/        # Delegated tasks awaiting response
├── reference/          # Non-actionable reference material
└── someday-maybe/      # Future possibilities
```

## GTD Workflow

### 1. Capture
- All incoming tasks go in `inbox/`
- Quick capture without processing
- Examples: website exploration ideas, new suggestions, research tasks

### 2. Clarify
- Process inbox weekly to zero
- Ask: "Is it actionable?"
  - **No** → Move to `reference/` or `someday-maybe/`
  - **Yes** → "What's the next action?"
    - **Single action** → Move to `actions/`
    - **Multiple actions** → Create project in `projects/`

### 3. Organize
- **Projects**: Multi-step outcomes with clear next actions
- **Actions**: Single physical steps with context (@computer, @calls, @errands)
- **Waiting For**: Delegated items awaiting response
- **Reference**: Non-actionable but useful information

### 4. Reflect
- **Weekly Review**: Process inbox to zero, review all lists
- **Monthly Review**: Review someday-maybe list, project status

### 5. Engage
- Work from context-based action lists
- Focus on next actions, not projects

## Integration with Development Workflow

- **Board Agent**: Reviews GTD projects in board meetings
- **Product Owner**: Converts GTD insights to backlog items
- **Developer**: Focuses on `../backlog-items/` without distraction

## Templates

- `projects/_template/` - Use for new multi-step projects
- `actions/` - Single next actions (no template needed)

## File Naming

- **Inbox**: `YYYY-MM-DD-{title}.md`
- **Projects**: `YYYY-MM-DD-{title}/` (folder with project.md)
- **Actions**: `YYYY-MM-DD-{title}.md`
- **Waiting For**: `YYYY-MM-DD-{title}.md`
- **Reference**: `{category}/{title}.md`
- **Someday Maybe**: `YYYY-MM-DD-{title}.md`

## Weekly Review Checklist

- [ ] Process inbox to zero
- [ ] Review all projects - ensure each has next action
- [ ] Review waiting-for list - follow up if needed
- [ ] Review action lists - remove completed items
- [ ] Review someday-maybe - move any to active projects
- [ ] Clean up reference folder
