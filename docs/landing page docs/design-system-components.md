# Design System Components

## 1. Color System

### Primary Colors
- `primary-50`: #f5f3ff
- `primary-100`: #ede9fe
- `primary-200`: #ddd6fe
- `primary-300`: #c4b5fd
- `primary-400`: #a78bfa
- `primary-500`: #8b5cf6
- `primary-600`: #7c3aed
- `primary-700`: #6d28d9
- `primary-800`: #5b21b6
- `primary-900`: #4c1d95

### Accent Colors
- `accent-50`: #f0fdfa
- `accent-100`: #ccfbf1
- `accent-200`: #99f6e4
- `accent-300`: #5eead4
- `accent-400`: #2dd4bf
- `accent-500`: #14b8a6
- `accent-600`: #0d9488
- `accent-700`: #0f766e
- `accent-800`: #115e59
- `accent-900`: #134e4a

### Neutral Colors
- `white`: #ffffff
- `gray-50`: #f9fafb
- `gray-100`: #f3f4f6
- `gray-200`: #e5e7eb
- `gray-300`: #d1d5db
- `gray-400`: #9ca3af
- `gray-500`: #6b7280
- `gray-600`: #4b5563
- `gray-700`: #374151
- `gray-800`: #1f2937
- `gray-900`: #111827
- `black`: #000000

### Semantic Colors
- `success`: #10b981
- `error`: #ef4444
- `warning`: #f59e0b
- `info`: #3b82f6

## 2. Typography

### Font Families
- `sans`: `'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- `body`: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- `mono`: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace`

### Font Weights
- `light`: 300
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700
- `extrabold`: 800

### Text Styles
```scss
.display-2xl {
  font-size: 4.5rem; // 72px
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 800;
}

.display-xl {
  font-size: 3.75rem; // 60px
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 800;
}

h1 {
  font-size: 3rem; // 48px
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 800;
}

h2 {
  font-size: 2.25rem; // 36px
  line-height: 2.5rem;
  letter-spacing: -0.02em;
  font-weight: 700;
}

h3 {
  font-size: 1.875rem; // 30px
  line-height: 2.25rem;
  font-weight: 700;
}

h4 {
  font-size: 1.5rem; // 24px
  line-height: 2rem;
  font-weight: 600;
}

h5 {
  font-size: 1.25rem; // 20px
  line-height: 1.75rem;
  font-weight: 600;
}

h6 {
  font-size: 1.125rem; // 18px
  line-height: 1.75rem;
  font-weight: 600;
}

.body-lg {
  font-size: 1.125rem; // 18px
  line-height: 1.75rem;
}

.body-md {
  font-size: 1rem; // 16px
  line-height: 1.5rem;
}

.body-sm {
  font-size: 0.875rem; // 14px
  line-height: 1.25rem;
}

.caption {
  font-size: 0.75rem; // 12px
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## 3. Spacing System

### Scale (rem)
- `0`: 0
- `px`: 1px
- `0.5`: 0.125rem (2px)
- `1`: 0.25rem (4px)
- `1.5`: 0.375rem (6px)
- `2`: 0.5rem (8px)
- `2.5`: 0.625rem (10px)
- `3`: 0.75rem (12px)
- `3.5`: 0.875rem (14px)
- `4`: 1rem (16px)
- `5`: 1.25rem (20px)
- `6`: 1.5rem (24px)
- `7`: 1.75rem (28px)
- `8`: 2rem (32px)
- `9`: 2.25rem (36px)
- `10`: 2.5rem (40px)
- `11`: 2.75rem (44px)
- `12`: 3rem (48px)
- `14`: 3.5rem (56px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)
- `24`: 6rem (96px)
- `28`: 7rem (112px)
- `32`: 8rem (128px)
- `36`: 9rem (144px)
- `40`: 10rem (160px)
- `44`: 11rem (176px)
- `48`: 12rem (192px)
- `52`: 13rem (208px)
- `56`: 14rem (224px)
- `60`: 15rem (240px)
- `64`: 16rem (256px)
- `72`: 18rem (288px)
- `80`: 20rem (320px)
- `96`: 24rem (384px)

## 4. Border Radius
- `none`: 0
- `sm`: 0.125rem (2px)
- `DEFAULT`: 0.25rem (4px)
- `md`: 0.375rem (6px)
- `lg`: 0.5rem (8px)
- `xl`: 0.75rem (12px)
- `2xl`: 1rem (16px)
- `3xl`: 1.5rem (24px)
- `full`: 9999px

## 5. Box Shadow
- `sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `DEFAULT`: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- `md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- `lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- `xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- `2xl`: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
- `inner`: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
- `primary`: 0 4px 6px -1px rgba(90, 49, 244, 0.2), 0 2px 4px -1px rgba(90, 49, 244, 0.1)

## 6. Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 7. Z-Index
- `0`: 0
- `10`: 10
- `20`: 20
- `30`: 30
- `40`: 40
- `50`: 50
- `auto`: auto

## 8. Components

### Buttons
```scss
.btn {
  @apply inline-flex items-center justify-center rounded-md border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200;
  
  &-sm {
    @apply px-3 py-1.5 text-sm;
  }
  
  &-md {
    @apply px-4 py-2 text-base;
  }
  
  &-lg {
    @apply px-6 py-3 text-lg;
  }
  
  &-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  &-secondary {
    @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500;
  }
  
  &-accent {
    @apply bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500;
  }
}
```

### Cards
```scss
.card {
  @apply bg-white rounded-lg shadow-sm overflow-hidden;
  
  &-header {
    @apply px-6 py-4 border-b border-gray-200;
  }
  
  &-body {
    @apply p-6;
  }
  
  &-footer {
    @apply px-6 py-4 bg-gray-50 border-t border-gray-200;
  }
}
```

### Forms
```scss
.form-input,
.form-textarea,
.form-select,
.form-multiselect {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500;
  
  &-sm {
    @apply text-sm;
  }
  
  &-lg {
    @apply text-lg;
  }
  
  &:disabled {
    @apply bg-gray-100 opacity-75 cursor-not-allowed;
  }
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-error {
  @apply mt-1 text-sm text-red-600;
}
```

### Alerts
```scss
.alert {
  @apply p-4 rounded-md;
  
  &-success {
    @apply bg-green-50 text-green-800;
  }
  
  &-error {
    @apply bg-red-50 text-red-800;
  }
  
  &-warning {
    @apply bg-yellow-50 text-yellow-800;
  }
  
  &-info {
    @apply bg-blue-50 text-blue-800;
  }
  
  &-icon {
    @apply flex-shrink-0 h-5 w-5;
  }
  
  &-content {
    @apply ml-3;
  }
  
  &-title {
    @apply text-sm font-medium;
  }
  
  &-description {
    @apply mt-2 text-sm;
  }
}
```

## 9. Utilities

### Container
```scss
.container {
  @apply w-full px-4 mx-auto;
  
  @screen sm {
    max-width: 640px;
  }
  
  @screen md {
    max-width: 768px;
  }
  
  @screen lg {
    max-width: 1024px;
  }
  
  @screen xl {
    max-width: 1280px;
  }
  
  @screen 2xl {
    max-width: 1536px;
  }
}
```

### Grid
```scss
.grid {
  @apply grid gap-4;
  
  &-cols-1 {
    @apply grid-cols-1;
  }
  
  &-cols-2 {
    @apply grid-cols-1 md:grid-cols-2;
  }
  
  &-cols-3 {
    @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
  }
  
  &-cols-4 {
    @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-4;
  }
}
```

### Flex
```scss
.flex {
  @apply flex;
  
  &-row {
    @apply flex-row;
  }
  
  &-col {
    @apply flex-col;
  }
  
  &-center {
    @apply justify-center items-center;
  }
  
  &-between {
    @apply justify-between;
  }
  
  &-wrap {
    @apply flex-wrap;
  }
}
```

## 10. Animations

### Fade In
```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
```

### Slide Up
```scss
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Pulse
```scss
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 11. Icons

### Sizing
- `icon-xs`: 12px
- `icon-sm`: 16px
- `icon-md`: 20px
- `icon-lg`: 24px
- `icon-xl`: 32px
- `icon-2xl`: 40px
- `icon-3xl`: 48px

### Usage
```html
<svg class="icon-lg text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..." />
</svg>
```

## 12. Theming

### Light Theme (Default)
```scss
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  --color-text-primary: #111827;
  --color-text-secondary: #4b5563;
  --color-border: #e5e7eb;
}
```

### Dark Theme
```scss
.dark {
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-bg-tertiary: #374151;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-border: #374151;
}
```

## 13. Responsive Utilities

### Hide/Show
```scss
.hide-mobile {
  @apply hidden md:block;
}

.show-mobile {
  @apply md:hidden;
}
```

### Spacing
```scss
.responsive-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

.responsive-margin {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}
```

## 14. Print Styles

```scss
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-break-before {
    page-break-before: always;
  }
  
  .print-break-after {
    page-break-after: always;
  }
  
  .print-break-avoid {
    page-break-inside: avoid;
  }
}
```

## 15. Accessibility

### Screen Reader Only
```scss
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Focus States
```scss
.focus-visible {
  @apply outline-none ring-2 ring-offset-2 ring-primary-500;
}

.focus-visible-white {
  @apply outline-none ring-2 ring-offset-2 ring-white;
}
```

## 16. Custom Utilities

### Aspect Ratio
```scss
.aspect-16\:9 {
  padding-bottom: 56.25%;
}

.aspect-4\:3 {
  padding-bottom: 75%;
}

.aspect-1\:1 {
  padding-bottom: 100%;
}
```

### Scroll Behavior
```scss
.scroll-smooth {
  scroll-behavior: smooth;
}

.scroll-mt-16 {
  scroll-margin-top: 4rem;
}
```

## 17. Helper Classes

### Truncate Text
```scss
.truncate-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Visibility
```scss
.visible {
  visibility: visible;
}

.invisible {
  visibility: hidden;
}

.collapse {
  visibility: collapse;
}
```

## 18. Transitions

### Duration
```scss
.transition-fast {
  transition-duration: 150ms;
}

.transition-normal {
  transition-duration: 300ms;
}

.transition-slow {
  transition-duration: 500ms;
}
```

### Timing Functions
```scss
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}
```

## 19. Z-Index Scale

### Components
```scss
.z-modal: 50;
.z-dropdown: 40;
.z-popover: 30;
.z-tooltip: 20;
.z-toast: 10;
```

### Layout
```scss
.z-header: 1000;
.z-footer: 1000;
.z-overlay: 900;
```

## 20. Custom Variables

### Spacing
```scss
:root {
  --header-height: 4rem;
  --footer-height: 4rem;
  --content-min-height: calc(100vh - var(--header-height) - var(--footer-height));
}
```
### Typography
```scss
:root {
  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
```
