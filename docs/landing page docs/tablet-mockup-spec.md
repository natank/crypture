# Tablet Mockup Adaptation (768px)

## 1. Header Section
```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Crypture                [☰] [Portfolio]  │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Height**: 64px
- **Logo**: 36px height
- **Hamburger Menu**: 
  - Size: 24x24px
  - Color: #111827
  - Right padding: 16px
- **CTA Button**:
  - Padding: 10px 20px
  - Font size: 14px

## 2. Hero Section

### Layout:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Track Your Crypto                                 │
│  Portfolio with Ease                               │
│                                                     │
│  [View Portfolio]  [Learn More]                     │
│                                                     │
│  +─────────────────────────────────────────+        │
│  |                                         |        │
│  |          App Dashboard Preview          |        │
│  |                                         |        │
│  +─────────────────────────────────────────+        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Headline**: 
  - Font: Space Grotesk, 48px, 800
  - Line Height: 1.2
  - Max Width: 100%
- **Subheadline**:
  - Font: DM Sans, 18px, 400
  - Line Height: 1.6
- **Dashboard Preview**:
  - Width: 100%
  - Height: auto
  - Maintain aspect ratio
  - Border Radius: 12px

## 3. Features Section

### Layout:
```
┌───────────────────────┐  ┌───────────────────────┐
│         📊            │  │         📱            │
│    Real-time Data    │  │    No Login         │
│                      │  │    Required         │
└───────────────────────┘  └───────────────────────┘
┌───────────────────────┐
│         🔄            │
│    Import/Export     │
│    Portfolio         │
└───────────────────────┘
```

### Specifications:
- **Grid**: 2 columns for first row, 1 centered column for last feature
- **Feature Cards**:
  - Padding: 24px
  - Margin Bottom: 24px
- **Icons**: 
  - Size: 40x40px
  - Padding: 10px

## 4. How It Works Section

### Layout:
```
┌─────────────────────────────────────────────────────┐
│  How It Works                                       │
│                                                     │
│  ┌─────────────────┐    ┌─────────────────┐        │
│  │        1.       │    │        2.       │        │
│  │   Add Assets    │    │  Track Values   │        │
│  └─────────────────┘    └─────────────────┘        │
│                                                     │
│  ┌─────────────────────────────────────────┐        │
│  │                 3.                     │        │
│  │               Profit                  │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Section Title**:
  - Font: Space Grotesk, 40px, 800
- **Step Cards**:
  - Width: 100% (for single column)
  - Margin: 0 auto 32px
  - Max Width: 400px

## 5. Call-to-Action Section

### Layout:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Ready to take control of                          │
│  your crypto portfolio?                            │
│                                                     │
│  [Get Started]                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Headline**:
  - Font: Space Grotesk, 40px, 800
  - Line Height: 1.2
- **Button**:
  - Width: 100%
  - Max Width: 300px
  - Margin: 0 auto

## 6. Footer Section

### Layout:
```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Crypture                                  │
│                                                     │
│  Features    About    Contact                      │
│  Privacy Policy    Terms of Service                │
│                                                     │
│  [Social Icons]                                    │
│                                                     │
│  © 2025 Crypture. All rights reserved.             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Links**:
  - Display: Block for mobile menu
  - Padding: 12px 0
  - Text Align: Left
- **Social Icons**:
  - Justify Content: Center
  - Margin: 24px 0

## 7. Navigation Menu (Expanded)

### Layout:
```
┌─────────────────────────────────────────────────────┐
│  × Close                                           │
│                                                     │
│  Features                                           │
│  About                                              │
│  Contact                                            │
│  Privacy Policy                                     │
│  Terms of Service                                   │
│                                                     │
│  [View Portfolio]                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Specifications:
- **Background**: White
- **Overlay**: 80% black
- **Close Button**: 
  - Size: 24x24px
  - Position: Top right
  - Padding: 20px
- **Menu Items**:
  - Font: DM Sans, 18px, 500
  - Padding: 12px 24px
  - Border Bottom: 1px solid #f3f4f6
- **CTA Button**:
  - Width: 100%
  - Margin: 16px 24px
  - Text Align: Center

## 8. Responsive Behavior
- **Portrait Mode**: Single column layout
- **Landscape Mode**: Two-column layout where appropriate
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Font Sizes**: 10% smaller than desktop
- **Spacing**: 20% tighter than desktop

## 9. Notes
- All interactive elements should have appropriate touch feedback
- Maintain consistent spacing between sections (64px)
- Ensure text remains readable on smaller screens
- Test on actual tablet devices when possible
