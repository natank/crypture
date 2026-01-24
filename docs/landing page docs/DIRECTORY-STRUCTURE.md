# Directory Structure

```
frontend/
├── public/                    # Static files
│   └── assets/                # Global assets
│       ├── fonts/             # Font files
│       ├── images/            # Global images
│       └── icons/             # SVG icons
│
└── src/
    ├── components/            # Reusable components
    │   ├── ui/                # Base UI components
    │   │   ├── Button/
    │   │   ├── Card/
    │   │   └── ...
    │   └── layout/            # Layout components
    │
    ├── styles/                # Global styles
    │   ├── base/             # Base styles
    │   ├── components/        # Component styles
    │   └── utilities/        # Utility classes
    │
    └── pages/                # Page components
        └── landing/
            ├── components/    # Page-specific components
            └── index.tsx      # Main page component

docs/
├── landing page docs/         # Design documentation
│   ├── assets/               # Design assets
│   │   ├── screenshots/      # Mockup images
│   │   └── specs/            # Design specifications
│   │
│   ├── design-system/        # Design system documentation
│   ├── components/           # Component documentation
│   └── guidelines/           # Usage guidelines
│
└── assets/                   # Global documentation assets
    ├── design-tokens/        # Design tokens
    └── icons/                # Icon library
```

## Key Files

### Design System
- `design-system-components.md` - Complete component library
- `microinteractions.md` - Interaction patterns
- `CHANGELOG.md` - Version history

### Handoff Documents
- `HANDOFF-README.md` - Getting started guide
- `handoff-checklist.md` - Implementation checklist
- `DIRECTORY-STRUCTURE.md` - This file

## Asset Naming Convention

### Images
- `{section}-{purpose}-{state}@[1x|2x].{ext}`
- Example: `hero-background-default@2x.jpg`

### Icons
- `icon-{name}-{size}-{color}.svg`
- Example: `icon-arrow-right-24-primary.svg`

### Components
- `{ComponentName}.{jsx|tsx}` - React component
- `{ComponentName}.module.css` - Component styles
- `{ComponentName}.stories.tsx` - Storybook stories
- `{ComponentName}.test.tsx` - Test file

## Development Workflow

1. Create a new branch for your feature
2. Add/update components in `src/components/`
3. Document new components in `docs/`
4. Update tests and stories
5. Create a pull request with the checklist
6. Get design review approval
7. Merge to main after CI passes

## Build Process

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Deployment

The application is automatically deployed to production when changes are merged to the `main` branch.
