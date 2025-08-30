# Mobile Mockup Adaptation (375px)

## 1. Header Section
```
┌─────────────────────────────────────┐
│  [Logo]  Crypture       [☰]        │
└─────────────────────────────────────┘
```

### Specifications:
- **Height**: 56px
- **Logo**: 32px height
- **Hamburger Menu**: 
  - Size: 24x24px
  - Right padding: 16px
- **CTA Button**: Moved to menu

## 2. Hero Section

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│  Track Your                         │
│  Crypto Portfolio                   │
│                                     │
│  [View Portfolio]                   │
│  [Learn More]                       │
│                                     │
│  +───────────────────────────+      │
│  |                           |      │
│  |  App Dashboard Preview    |      │
│  |                           |      │
│  +───────────────────────────+      │
│                                     │
└─────────────────────────────────────┘
```

### Specifications:
- **Headline**: 
  - Font: Space Grotesk, 36px, 800
  - Line Height: 1.1
  - Letter Spacing: -0.5px
- **Subheadline**:
  - Font: DM Sans, 16px, 400
  - Line Height: 1.5
  - Margin: 16px 0
- **Buttons**:
  - Full width
  - Stacked vertically
  - Margin: 8px 0
- **Dashboard Preview**:
  - Width: 100%
  - Border Radius: 8px
  - Margin: 24px 0

## 3. Features Section

### Layout:
```
┌─────────────────────────────┐
│            📊               │
│      Real-time Data        │
│                            │
├─────────────────────────────┤
│            📱               │
│      No Login Required     │
│                            │
├─────────────────────────────┤
│            🔄               │
│      Import/Export         │
│      Portfolio             │
│                            │
└─────────────────────────────┘
```

### Specifications:
- **Layout**: Single column
- **Feature Cards**:
  - Padding: 24px 16px
  - Margin: 0 0 1px 0
  - Border Radius: 0
  - Box Shadow: none
  - Border Bottom: 1px solid #f3f4f6
- **Icons**: 
  - Size: 36x36px
  - Margin: 0 auto 12px

## 4. How It Works Section

### Layout:
```
┌─────────────────────────────────────┐
│  How It Works                       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │             1.             │    │
│  │        Add Assets          │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │             2.             │    │
│  │       Track Values         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │             3.             │    │
│  │          Profit            │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Specifications:
- **Section Title**:
  - Font: Space Grotesk, 32px, 800
  - Text Align: Center
  - Margin: 0 0 24px 0
- **Step Cards**:
  - Width: 100%
  - Margin: 0 0 16px 0
  - Padding: 20px
  - Background: White
  - Border Radius: 8px
  - Box Shadow: 0 2px 4px rgba(0,0,0,0.05)

## 5. Call-to-Action Section

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│  Ready to take control             │
│  of your crypto portfolio?         │
│                                     │
│  [Get Started]                      │
│                                     │
└─────────────────────────────────────┘
```

### Specifications:
- **Background**: Linear-gradient(135deg, #5a31f4 0%, #00bfa5 100%)
- **Padding**: 48px 16px
- **Headline**:
  - Font: Space Grotesk, 32px, 800
  - Text Align: Center
  - Line Height: 1.2
- **Button**:
  - Width: 100%
  - Max Width: 280px
  - Margin: 24px auto 0
  - Font Size: 16px
  - Padding: 16px 24px

## 6. Footer Section

### Layout:
```
┌─────────────────────────────────────┐
│  [Logo]  Crypture                  │
│                                     │
│  Features                           │
│  About                              │
│  Contact                            │
│  Privacy Policy                     │
│  Terms of Service                   │
│                                     │
│  [Social Icons]                     │
│                                     │
│  © 2025 Crypture.                   │
│  All rights reserved.               │
│                                     │
└─────────────────────────────────────┘
```

### Specifications:
- **Background**: #111827
- **Padding**: 40px 16px 24px
- **Logo**: 
  - Size: 32px height
  - Margin: 0 0 24px 0
- **Links**:
  - Display: Block
  - Padding: 12px 0
  - Font: DM Sans, 16px, 400, #e5e7eb
  - Border Bottom: 1px solid #374151
- **Social Icons**:
  - Size: 20x20px
  - Margin: 24px 8px
  - Color: #9ca3af
- **Copyright**:
  - Font: DM Sans, 14px, 400, #6b7280
  - Margin: 24px 0 0 0

## 7. Navigation Menu (Expanded)

### Layout:
```
┌─────────────────────────────────────┐
│  × Close                            │
│                                     │
│  Features                           │
│  About                              │
│  Contact                            │
│  Privacy Policy                     │
│  Terms of Service                   │
│                                     │
│  [View Portfolio]                   │
│                                     │
└─────────────────────────────────────┘
```

### Specifications:
- **Full Screen Overlay**
- **Close Button**:
  - Size: 24x24px
  - Position: Top right
  - Padding: 16px
- **Menu Items**:
  - Font: DM Sans, 18px, 500
  - Padding: 16px 24px
  - Border Bottom: 1px solid #f3f4f6
- **CTA Button**:
  - Margin: 24px 16px
  - Width: calc(100% - 32px)

## 8. Touch Targets
- **Minimum Size**: 44x44px for all interactive elements
- **Button Padding**: Minimum 12px horizontal, 8px vertical
- **Text Inputs**: Minimum height 48px
- **Checkboxes/Radio Buttons**: Minimum 24x24px with 8px padding

## 9. Performance Considerations
- Optimize images for mobile networks
- Implement lazy loading for below-the-fold content
- Minimize render-blocking resources
- Use mobile-optimized fonts

## 10. Testing Notes
- Test on various iOS and Android devices
- Verify touch targets on smaller screens
- Check performance on 3G networks
- Ensure text remains readable without zooming
- Test form inputs and interactive elements
