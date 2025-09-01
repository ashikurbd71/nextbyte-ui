# About Section Components

This directory contains the modularized components for the About section of the NextByte landing page. The original large component has been broken down into smaller, more manageable and reusable components.

## Component Structure

```
about-section/
├── index.js                    # Main export file
├── about-header.jsx           # Section header with badge and title
├── ceo-section.jsx            # CEO prominent display card
├── mentors-section.jsx        # Mentors section with grid
├── mentor-card.jsx            # Reusable mentor card component
├── company-stats.jsx          # Company statistics cards
├── background-decorations.jsx # Background decorative elements
└── README.md                  # This documentation
```

## Components

### AboutHeader

- **Purpose**: Displays the section title, badge, and description
- **Props**: None
- **Features**: Animated badge, gradient text styling

### CEOSection

- **Purpose**: Prominent display of the CEO with image, bio, and social links
- **Props**: None
- **Features**: Large card layout, achievements badges, social media links

### MentorsSection

- **Purpose**: Grid display of expert mentors
- **Props**: None
- **Features**: Uses MentorCard components, animated grid layout

### MentorCard

- **Purpose**: Reusable card component for displaying mentor information
- **Props**:
  - `mentor`: Object containing mentor data
  - `delay`: Animation delay (optional)
- **Features**: Configurable colors, achievements, social links

### CompanyStats

- **Purpose**: Displays company statistics in card format
- **Props**: None
- **Features**: Animated stat cards with icons and gradients

### BackgroundDecorations

- **Purpose**: Provides decorative background elements
- **Props**: None
- **Features**: Floating animated elements with gradients

## Usage

### Import all components

```jsx
import {
  AboutHeader,
  CEOSection,
  MentorsSection,
  CompanyStats,
  BackgroundDecorations,
} from "./about-section";
```

### Use in main component

```jsx
export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <BackgroundDecorations />

      <div className="max-w-7xl mx-auto">
        <AboutHeader />
        <CEOSection />
        <MentorsSection />
        <CompanyStats />
      </div>
    </section>
  );
}
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Maintainability**: Easier to update and debug individual sections
4. **Testability**: Each component can be tested in isolation
5. **Code Organization**: Clear separation of concerns
6. **Performance**: Better code splitting and lazy loading potential

## Data Structure

### Mentor Data Format

```javascript
{
    name: "Mentor Name",
    role: "Senior Mentor",
    image: "/path/to/image.png",
    experience: "4+ Years",
    description: "Mentor description...",
    achievements: ["500+ Students", "React Expert", "Web Dev"],
    achievementColors: "from-blue-50 to-purple-50",
    socialLinks: [
        {
            url: "https://facebook.com/username",
            icon: "facebook",
            bgColor: "bg-blue-600",
            hoverColor: "bg-blue-700"
        }
        // ... more social links
    ]
}
```

## Styling

All components use Tailwind CSS classes and maintain consistent styling with:

- Responsive design (sm:, md:, lg: breakpoints)
- Hover effects and transitions
- Gradient backgrounds
- Shadow effects
- Border styling

## Animation

Components use Framer Motion for animations:

- Fade-in effects on scroll
- Staggered animations for grid items
- Smooth transitions
- Viewport-based triggers
