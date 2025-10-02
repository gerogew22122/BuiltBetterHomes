# Design Guidelines: Built Better Homes Website

## Design Approach
**Reference-Based Preservation**: Maintain the original Built Better Homes website design while ensuring optimal functionality and modern web standards. This is a construction/home building company website, so the design should convey trust, professionalism, and showcase projects effectively.

## Core Design Principles

### Color Palette
**Preserve Original Colors**: Extract and maintain the existing color scheme from the website assets. Typical for construction/home building sites:
- Primary: Professional blues or earth tones
- Secondary: Complementary accent colors
- Neutrals: Clean grays for backgrounds and text

### Typography
**Maintain Original Fonts**: Use the exact font families from the original site
- Preserve heading hierarchy and sizing
- Maintain body text readability (16px minimum for body)
- Keep consistent line heights for readability

### Layout System
**Preserve Original Structure**: Maintain the website's existing grid system and spacing
- Use original container widths and breakpoints
- Preserve section padding and margins
- Maintain responsive behavior at all viewport sizes

## Component Specifications

### Navigation
- Preserve original navigation structure and styling
- Ensure mobile hamburger menu (if present) functions smoothly
- Maintain hover states and active link indicators
- Keep logo placement and sizing consistent

### Hero Section
**Large Hero Image**: Construction/home building sites typically feature:
- Full-width hero with stunning home photography or project showcase
- Overlay text with clear value proposition
- Primary CTA button (e.g., "Get a Quote", "View Projects")
- Ensure image loads quickly with appropriate optimization

### Content Sections
**Project Showcases**: 
- Gallery grids displaying completed homes/projects
- Before/after comparisons if present
- High-quality photography with captions
- Filter/category options if available

**Services/Features**:
- Multi-column layout for service offerings
- Icons paired with descriptions
- Clear benefit statements

**Testimonials/Social Proof**:
- Customer reviews with authentic photos
- Project completion stats
- Industry certifications or awards

**Contact/CTA Sections**:
- Contact form with clear fields
- Phone/email/address information
- Map integration if present
- Office hours and response time expectations

### Footer
- Multi-column layout with navigation links
- Contact information and business details
- Social media links
- Trust badges (licenses, associations, certifications)

## Images
**Critical Image Placements**:
- Hero: Large, professional home/construction photography
- Projects: High-resolution gallery images of completed work
- About: Team photos and company facilities
- Process: Step-by-step visual guides
- All images should be optimized for web delivery while maintaining quality

## Technical Requirements
- Preserve all original JavaScript functionality (forms, galleries, animations)
- Maintain existing CSS styling and effects
- Ensure all internal links route correctly
- Configure proper MIME types for all assets
- Implement efficient caching strategies
- Mobile-responsive at all breakpoints

## Accessibility
- Maintain proper heading hierarchy (h1-h6)
- Ensure all images have descriptive alt text
- Form labels properly associated with inputs
- Sufficient color contrast (WCAG AA minimum)
- Keyboard navigation support

## Performance
- Optimize image loading (lazy load below-fold images)
- Minify CSS/JS if not already done
- Implement browser caching headers
- Compress assets where appropriate
- Fast server response times