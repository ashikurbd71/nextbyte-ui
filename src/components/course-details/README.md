# Course Details Components

This directory contains the modular components for the course details page, providing better code organization and maintainability.

## Component Structure

### Main Components

- **`CourseHeader`** - Displays the course title, description, and key statistics (rating, students, duration)
- **`CoursePreview`** - Shows the course preview video or placeholder
- **`TabNavigation`** - Navigation tabs for different content sections
- **`TabContent`** - Manages the display of different tab contents
- **`CourseSidebar`** - Sidebar with pricing, enrollment button, features, and contact info

### Tab Content Components

- **`OverviewTab`** - What you'll learn, technologies, and requirements
- **`CurriculumTab`** - Course modules and lessons structure
- **`InstructorTab`** - Instructor information, bio, and stats
- **`ReviewsTab`** - Student reviews and ratings

## Usage

```jsx
import {
    CourseHeader,
    CoursePreview,
    TabNavigation,
    TabContent,
    CourseSidebar
} from "@/components/course-details"

// In your main component
<CourseHeader courseData={courseData} averageRating={averageRating} />
<CoursePreview courseData={courseData} />
<TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
<TabContent
    activeTab={activeTab}
    courseData={courseData}
    averageRating={averageRating}
    totalLessons={totalLessons}
/>
<CourseSidebar
    courseData={courseData}
    paymentLoading={paymentLoading}
    handlePayment={handlePayment}
    isLiked={isLiked}
    handleLike={handleLike}
    showShareMenu={showShareMenu}
    handleShare={handleShare}
/>
```

## Benefits

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be reused in other parts of the application
3. **Maintainability** - Easier to maintain and update individual sections
4. **Testing** - Each component can be tested independently
5. **Performance** - Better code splitting and lazy loading opportunities
6. **Developer Experience** - Easier to understand and work with smaller, focused components

## Props Interface

### CourseHeader

- `courseData` - Course information object
- `averageRating` - Calculated average rating number

### CoursePreview

- `courseData` - Course information object (uses promoVideoUrl)

### TabNavigation

- `activeTab` - Currently active tab string
- `setActiveTab` - Function to change active tab

### TabContent

- `activeTab` - Currently active tab string
- `courseData` - Course information object
- `averageRating` - Calculated average rating number
- `totalLessons` - Total number of lessons

### CourseSidebar

- `courseData` - Course information object
- `paymentLoading` - Payment processing state
- `handlePayment` - Payment handler function
- `isLiked` - Course like state
- `handleLike` - Like handler function
- `showShareMenu` - Share menu visibility state
- `handleShare` - Share handler function
