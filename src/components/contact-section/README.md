# Contact Section Components

This directory contains all the components for the contact page of the NextByte website.

## Components

### ContactHeader

- **File**: `contact-header.jsx`
- **Purpose**: Hero section with contact information and quick contact cards
- **Features**:
  - Animated background with floating elements
  - Quick contact cards for email, phone, and location
  - Responsive design with gradient backgrounds

### ContactInfo

- **File**: `contact-info.jsx`
- **Purpose**: Detailed contact information and company statistics
- **Features**:
  - Contact details cards (email, phone, address, hours)
  - Company statistics showcase
  - Gradient background with animated elements

### ContactForm

- **File**: `contact-form.jsx`
- **Purpose**: Interactive contact form with validation
- **Features**:
  - Form validation and submission handling
  - Success state with confirmation message
  - Split layout with form and info panel
  - Loading states and error handling

### ContactMap

- **File**: `contact-map.jsx`
- **Purpose**: Office location display with transportation information
- **Features**:
  - Placeholder map with office location
  - Transportation options (BART, Muni, Parking)
  - Office hours and contact details
  - Interactive elements

### FAQSection

- **File**: `faq-section.jsx`
- **Purpose**: Frequently asked questions with expandable answers
- **Features**:
  - Accordion-style FAQ display
  - Smooth animations for expand/collapse
  - Common questions about courses and services
  - Call-to-action for additional support

### BackgroundDecorations

- **File**: `background-decorations.jsx`
- **Purpose**: Subtle animated background elements
- **Features**:
  - Floating gradient orbs
  - Grid and dot patterns
  - Smooth animations
  - Non-intrusive design

## Usage

The contact page is located at `/contact` and uses all these components together:

```jsx
import { ContactHeader } from "@/components/contact-section/contact-header";
import { ContactForm } from "@/components/contact-section/contact-form";
import { ContactInfo } from "@/components/contact-section/contact-info";
import { ContactMap } from "@/components/contact-section/contact-map";
import { FAQSection } from "@/components/contact-section/faq-section";
import { BackgroundDecorations } from "@/components/contact-section/background-decorations";
```

## Styling

All components use:

- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Consistent color scheme (blue/purple gradients)
- Responsive design patterns

## Dependencies

- `framer-motion` - For animations
- `lucide-react` - For icons
- `@/components/ui/button` - For button components
- Tailwind CSS classes for styling
