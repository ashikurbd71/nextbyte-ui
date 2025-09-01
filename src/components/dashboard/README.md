# Dashboard Components

## Review Functionality

### Overview

The dashboard now includes a review system that allows users to rate and comment on courses they've enrolled in.

### Components

#### ReviewModal (`review-modal.jsx`)

A modal component that allows users to:

- Rate courses using a 5-star system
- Write comments (up to 500 characters)
- Submit reviews to the backend API

**Features:**

- Interactive star rating with hover effects
- Form validation (rating and comment required)
- Loading states during submission
- Responsive design with smooth animations

#### CourseCard (`course-card.jsx`)

Updated to include:

- Review button (star icon) next to analytics button
- Integration with ReviewModal
- Review submission handling

### API Integration

#### Reviews API (`src/app/apis/reviews-apis/reviewsApis.js`)

Provides the following functions:

- `createReview(reviewData)` - Submit a new review
- `getAllReviews()` - Get all reviews
- `getReviewsByCourseId(courseId)` - Get reviews for a specific course
- `getReviewsByUserId(userId)` - Get reviews by a specific user

### Review Data Structure

```javascript
{
  rating: 5,           // Number (1-5)
  comment: "string",   // String (max 500 chars)
  courseId: 2,         // Number
  userId: 2           // Number (from auth context)
}
```

### Usage

1. Click the star icon on any course card in the dashboard
2. Rate the course using the interactive star system
3. Write a comment about your experience
4. Submit the review

### Authentication

The review system uses the auth context to get the current user's ID automatically. Users must be logged in to submit reviews.

### Error Handling

- Form validation for required fields
- API error handling with user-friendly messages
- Loading states to prevent multiple submissions
