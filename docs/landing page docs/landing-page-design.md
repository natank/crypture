# Crypture Landing Page Design Plan

> **Related Documents**:
> - [Wireframes](./landing-page.wirefreames.md)
> - [Style Guide](../style-guide.md)
> - [Product Vision](../product-vision.md)

## Document Purpose
This document outlines the design specifications for the Crypture landing page, including visual design, components, and implementation guidelines. For interactive wireframes and layout details, please refer to the [wireframes document](./landing-page.wirefreames.md).

## 1. Project Overview
Design a clean, conversion-focused landing page for Crypture's cryptocurrency portfolio tracker. The page should effectively communicate the app's value proposition and drive user sign-ups while maintaining brand consistency with the existing application.

## 2. Design Objectives
- Create a visually appealing first impression that builds trust
- Clearly communicate the app's core value proposition
- Guide users towards the main call-to-action (View Portfolio)
- Ensure mobile responsiveness and accessibility compliance
- Maintain visual consistency with the existing Crypture application

## 3. Page Structure

### 3.1 Hero Section
- **Headline**: Clear value proposition
- **Subheadline**: Brief explanation of key benefits
- **Primary CTA**: "View Your Portfolio" button
- **Secondary CTA**: "Learn More" link
- **Hero Visual**: Clean dashboard preview or device mockup

### 3.2 Key Features
- Real-time price tracking
- Simple portfolio management
- No login required
- Export/Import functionality
- Clean, intuitive interface

### 3.3 How It Works
1. Add your crypto assets
2. Track real-time values
3. Monitor portfolio performance

### 3.4 Social Proof/Testimonials
- User testimonials (if available)
- Trust indicators

### 3.5 Final CTA Section
Reinforce value proposition with another prominent CTA

## 4. Visual Design

### 4.1 Color Scheme (Aligned with Style Guide)
- **Brand Primary**: `#5a31f4` (used for primary actions and key brand elements)
- **Brand Accent**: `#00bfa5` (used for highlights and secondary actions)
- **Brand Gradient**: `linear-gradient(135deg, #5a31f4, #00bfa5)` (for high-impact sections)
- **Background**: `#f9fafb` (light gray background)
- **Foreground**: `#111827` (main text color)
- **Subtle Text**: `#6b7280` (for secondary text)
- **Borders/Lines**: `#e5e7eb` (for dividers and borders)
- **Error**: `#dc2626` (for error states and warnings)

### 4.2 Typography (Aligned with Style Guide)
- **Brand Font**: 'Space Grotesk' (for headings and brand elements)
  - Fallback: 'DM Sans', sans-serif
- **Headings**: 
  - `font-bold text-2xl` (main headings)
  - `font-semibold text-xl` (section headings)
- **Body Text**: 
  - `text-base font-normal` (standard text)
  - `text-sm text-gray-500` (subtle/hint text)
- **Buttons & CTAs**: 
  - `text-sm font-medium uppercase` (button labels)
  - Primary: `bg-brand-primary text-white`
  - Secondary: `bg-white text-brand-primary border border-brand-primary`

### 4.3 UI Components (Aligned with Style Guide)

#### Buttons
- **Primary Button**
  ```jsx
  <button className="bg-brand-primary text-white text-sm font-medium uppercase px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
    View Portfolio
  </button>
  ```
- **Secondary Button**
  ```jsx
  <button className="bg-white text-brand-primary border border-brand-primary text-sm font-medium uppercase px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
    Learn More
  </button>
  ```

#### Cards
- **Feature Card**
  ```jsx
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
      {/* Icon */}
    </div>
    <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
    <p className="text-gray-600">Monitor your portfolio value with live price updates.</p>
  </div>
  ```

#### Navigation
- **Desktop Navigation**
  - Logo (left-aligned)
  - Navigation links (center-aligned)
  - CTA button (right-aligned)
- **Mobile Navigation**
  - Hamburger menu for mobile
  - Full-screen overlay menu with links and CTA

#### Footer
- Simple, clean design with:
  - Logo and tagline
  - Key links (Privacy, Terms, Contact)
  - Social media icons
  - Copyright information

## 5. Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 6. Deliverables

### 6.1 High-Fidelity Mockups
- **Desktop (1440px)**
  - Full landing page layout
  - Hover states for interactive elements
  - Focus states for accessibility
- **Tablet (768px)**
  - Optimized layout for medium screens
  - Adjusted spacing and font sizes
- **Mobile (375px)**
  - Mobile-first responsive design
  - Touch-friendly interactive elements
  - Collapsed navigation

### 6.2 Interactive Prototype
- **Figma Prototype** including:
  - Navigation between sections
  - Form interactions
  - Mobile menu toggle
  - Button hover/focus states
  - Smooth scroll behavior
  - Loading states for async actions

### 6.3 Design Assets
- **Icons**
  - SVG format with `currentColor` for theming
  - Standardized 24x24px grid
  - Optimized for performance
- **Illustrations**
  - Custom SVG illustrations in brand colors
  - Light/dark mode variants
- **Images**
  - WebP format with fallbacks
  - Optimized for fast loading
  - Properly sized for different breakpoints

### 6.4 Style Guide Documentation
- **Color System**
  - Primary, secondary, and accent colors
  - Semantic color usage
  - Light/dark mode values
- **Typography**
  - Type scale with responsive sizes
  - Line height and letter spacing
  - Text styles and combinations
- **Component Library**
  - Button variants and states
  - Form controls
  - Cards and containers
  - Navigation patterns
- **Spacing System**
  - 4px baseline grid
  - Consistent spacing scale
  - Responsive spacing utilities

### 6.5 Implementation Notes
- **Tailwind Configuration**
  - Custom theme extensions
  - Color palette variables
  - Breakpoint overrides
- **Accessibility**
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader support
  - Reduced motion preferences
- **Performance**
  - Critical CSS loading
  - Image optimization
  - Font loading strategy
  - Lazy loading for below-the-fold content
- **Browser Support**
  - Chrome, Firefox, Safari, Edge (latest 2 versions)
  - Mobile Safari and Chrome for Android
  - Progressive enhancement for older browsers

## 7. Technical Considerations
- Optimized image assets
- Web font loading strategy
- Performance optimization notes
- Browser compatibility

## 8. Timeline
1. **Day 1-2**: Research & Wireframing
2. **Day 3-4**: High-fidelity mockups
3. **Day 5**: Interactive prototype
4. **Day 6**: Design review & revisions
5. **Day 7**: Final assets delivery

## 9. Developer Handoff

### 9.1 Design Assets
- **Source Files**: `assets/` directory contains all design assets
  - `optimized/` - Web-optimized images (WebP + fallback PNG)
  - `source/` - Original design files (if applicable)

### 9.2 Image Assets
| Asset | Format | Dimensions | Purpose |
|-------|--------|------------|---------|
| `app-dashboard-preview.webp` | WebP | 1200x675 | Hero section dashboard preview |
| `app-dashboard-preview-fallback.png` | PNG | 1200x675 | Fallback for older browsers |

### 9.3 Implementation Notes
#### Image Optimization
- Use WebP with PNG fallback for all images
- Implement lazy loading for below-the-fold images
- Use `loading="lazy"` attribute for non-critical images

#### Responsive Images
```html
<picture>
  <source srcset="assets/optimized/image.webp" type="image/webp">
  <img 
    src="assets/optimized/image-fallback.png" 
    alt="Descriptive alt text"
    width="1200" 
    height="675"
    loading="lazy">
</picture>
```

### 9.4 Performance Considerations
- Preload critical images using `<link rel="preload">`
- Set explicit width/height to prevent layout shifts
- Use `fetchpriority="high"` for above-the-fold images

### 9.5 Accessibility
- All images must have meaningful alt text
- Decorative images should have empty alt (alt="")
- Ensure sufficient color contrast for text over images

## 10. Next Steps
1. Review and approve the design direction
2. Provide feedback on wireframes before high-fidelity mockups
3. Schedule design review sessions
4. Prepare final asset export for development
4. Plan for handoff to development team