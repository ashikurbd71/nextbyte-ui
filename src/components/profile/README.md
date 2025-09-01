# Profile Components

This directory contains all the components related to the user profile functionality. The components have been structured for better maintainability, reusability, and separation of concerns.

## Component Structure

```
src/components/profile/
├── README.md
├── index.js                    # Main export file
├── use-profile.js             # Custom hook for profile logic
├── profile-header.jsx         # Profile page header
├── profile-card.jsx           # Left sidebar profile card
├── personal-info-form.jsx     # Right side personal information form
├── avatar-upload.jsx          # Avatar upload functionality
├── profile-stats.jsx          # User statistics display
├── form-field.jsx             # Reusable form field component
└── certificates-section.jsx   # Certificates display section
```

## Components Overview

### 1. `useProfile` Hook
**File:** `use-profile.js`
- Manages all profile state and logic
- Handles file uploads, form submissions, and API calls
- Returns all necessary state and handlers

### 2. `ProfileHeader`
**File:** `profile-header.jsx`
- Displays the page title and description
- Includes motion animations

### 3. `ProfileCard`
**File:** `profile-card.jsx`
- Left sidebar component
- Contains avatar, user info, stats, and edit button
- Composed of `AvatarUpload` and `ProfileStats` components

### 4. `PersonalInfoForm`
**File:** `personal-info-form.jsx`
- Right side form component
- Handles all personal information fields
- Includes save/cancel buttons
- Uses `FormField` components for individual fields

### 5. `AvatarUpload`
**File:** `avatar-upload.jsx`
- Handles profile photo upload
- Includes camera button and file input
- Shows loading state during upload

### 6. `ProfileStats`
**File:** `profile-stats.jsx`
- Displays user statistics (courses, completion rate)
- Grid layout for stats display

### 7. `FormField`
**File:** `form-field.jsx`
- Reusable form field component
- Handles both view and edit modes
- Includes appropriate icons for each field type

### 8. `CertificatesSection`
**File:** `certificates-section.jsx`
- Displays user certificates
- Includes download functionality

## Usage Example

```jsx
import {
    ProfileHeader,
    ProfileCard,
    PersonalInfoForm,
    CertificatesSection,
    useProfile
} from "@/components/profile"

export default function ProfilePage() {
    const {
        user,
        editedUser,
        isEditing,
        isUploading,
        isLoading,
        fileInputRef,
        handleFileUpload,
        handleCameraClick,
        handleSave,
        handleEdit,
        handleCancel,
        handleInputChange
    } = useProfile()

    return (
        <div>
            <ProfileHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ProfileCard
                    user={user}
                    isEditing={isEditing}
                    isUploading={isUploading}
                    fileInputRef={fileInputRef}
                    onCameraClick={handleCameraClick}
                    onFileUpload={handleFileUpload}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                />
                
                <PersonalInfoForm
                    user={user}
                    editedUser={editedUser}
                    isEditing={isEditing}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
            
            <CertificatesSection certificates={certificates} />
        </div>
    )
}
```

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Maintainability**: Easy to modify individual components without affecting others
4. **Testability**: Each component can be tested independently
5. **Custom Hook**: Business logic is separated from UI components
6. **Type Safety**: Clear props interface for each component

## Props Interface

Each component has well-defined props that are documented in their respective files. The main data flow is:

1. `useProfile` hook manages all state and logic
2. State is passed down to components as props
3. Event handlers are passed down as callback props
4. Components are purely presentational and don't manage their own state

This structure follows React best practices and makes the codebase more maintainable and scalable.
