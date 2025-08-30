# Micro-interactions & Hover States

## 1. Button Interactions

### Primary Buttons
- **Default State**:
  - Background: `#5a31f4`
  - Text: White
  - Shadow: `0 4px 6px -1px rgba(90, 49, 244, 0.2)`
  - Transition: `all 0.2s ease-in-out`

- **Hover State**:
  - Background: `#4a29cc`
  - Transform: `translateY(-1px)`
  - Shadow: `0 6px 8px -1px rgba(90, 49, 244, 0.3)`

- **Active/Pressed State**:
  - Transform: `translateY(1px)`
  - Shadow: `0 2px 4px -1px rgba(90, 49, 244, 0.2)`

- **Focus State**:
  - Outline: `2px solid #5a31f4`
  - Outline Offset: `2px`

### Secondary Buttons
- **Default State**:
  - Background: Transparent
  - Text: `#5a31f4`
  - Border: `1px solid #5a31f4`
  - Transition: `all 0.2s ease`

- **Hover State**:
  - Background: `#f5f3ff`
  - Border Color: `#4a29cc`
  - Text Color: `#4a29cc`

- **Active State**:
  - Background: `#ede9fe`

## 2. Navigation

### Navigation Links
- **Hover**:
  - Color: `#5a31f4`
  - Underline: `underline`
  - Underline Offset: `4px`
  - Text Decoration Thickness: `2px`

### Dropdown Menus
- **Appearance**:
  - Animation: `fadeIn 0.2s ease-out`
  - Origin: `top center`
  - Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
  - Border Radius: `8px`
  - Padding: `8px 0`

## 3. Form Elements

### Text Inputs
- **Focus State**:
  - Border Color: `#5a31f4`
  - Box Shadow: `0 0 0 2px rgba(90, 49, 244, 0.2)`
  - Transition: `box-shadow 0.2s ease`

- **Valid State**:
  - Border Color: `#10b981`
  - Checkmark Icon: `url('checkmark.svg') no-repeat 95% center`

- **Error State**:
  - Border Color: `#ef4444`
  - Shake Animation: `shake 0.5s`

### Checkboxes/Radio Buttons
- **Hover**:
  - Scale: `1.1`
  - Transition: `transform 0.2s`

- **Checked State**:
  - Background: `#5a31f4`
  - Border Color: `#5a31f4`
  - Checkmark: White

## 4. Card Interactions

### Feature Cards
- **Hover**:
  - Transform: `translateY(-4px)`
  - Box Shadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`
  - Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

- **Active**:
  - Transform: `translateY(0)`
  - Box Shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

## 5. Loading States

### Button Loading
- **Loading State**:
  - Show loading spinner
  - Text: "Processing..."
  - Disabled: `true`
  - Cursor: `not-allowed`
  - Opacity: `0.8`

### Skeleton Loading
- **Animation**:
  - Background: `linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)`
  - Background Size: `200% 100%`
  - Animation: `shimmer 1.5s infinite`

## 6. Page Transitions

### Route Changes
- **Enter**:
  - Opacity: `0` to `1`
  - Duration: `200ms`
  - Easing: `ease-in-out`

- **Exit**:
  - Opacity: `1` to `0`
  - Duration: `150ms`
  - Easing: `ease-in`

## 7. Scroll Animations

### Fade In Elements
- **Trigger**: When element enters viewport
- **Animation**:
  - From: `opacity: 0, transform: translateY(20px)`
  - To: `opacity: 1, transform: translateY(0)`
  - Duration: `0.6s`
  - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
  - Stagger: `100ms` between elements

## 8. Feedback Micro-interactions

### Success Toast
- **Animation**:
  - Slide in from right
  - Auto-dismiss after `4000ms`
  - Progress bar decreases width
  - Ease: `cubic-bezier(0.4, 0, 0.2, 1)`

### Error Message
- **Animation**:
  - Shake horizontally
  - Color: `#ef4444`
  - Icon: `!` in circle

## 9. Mobile-Specific Interactions

### Swipe Actions
- **Reveal Actions**:
  - Background: `#f3f4f6`
  - Action Buttons: Slide in from right
  - Transition: `transform 0.3s ease`

### Pull-to-Refresh
- **Animation**:
  - Loading spinner appears
  - Content moves down and bounces back
  - Duration: `0.5s`

## 10. Accessibility Considerations

### Focus Management
- **Visible Focus**:
  - Outline: `2px solid #5a31f4`
  - Outline Offset: `2px`
  - Border Radius: `4px`

### Reduced Motion
- **Media Query**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

## Implementation Notes

### CSS Variables
```css
:root {
  --primary: #5a31f4;
  --primary-dark: #4a29cc;
  --transition-base: 0.2s ease-in-out;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Animation Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### Performance Considerations
- Use `will-change` for elements that will be animated
- Prefer `transform` and `opacity` for animations
- Use `requestAnimationFrame` for complex animations
- Consider `transform: translateZ(0)` for GPU acceleration
- Test animations on mobile devices for performance
