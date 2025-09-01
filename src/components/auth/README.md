# Authentication & Redirect System

This directory contains components and utilities for handling authentication and automatic redirects in the NextByte application.

## Overview

The authentication system provides:

- Automatic redirect to login page for unauthenticated users
- Redirect back to the original page after successful login
- Support for URL parameters to specify redirect destinations
- Persistent redirect URLs across browser sessions

## Components

### ProtectedRoute

A component that wraps content and automatically redirects unauthenticated users to the login page.

```jsx
import { ProtectedRoute } from "@/components/auth/protected-route";

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### withAuth (Higher-Order Component)

A higher-order component that can wrap any page component to add authentication protection.

```jsx
import { withAuth } from "@/components/auth/with-auth";

function MyPage() {
  return <div>Protected content</div>;
}

export default withAuth(MyPage, {
  redirectTo: "/login",
  showLoading: true,
});
```

## Hooks

### useRedirect

A custom hook that provides utilities for managing redirect URLs.

```jsx
import { useRedirect } from "@/hooks/use-redirect";

function MyComponent() {
  const {
    saveRedirectUrl,
    getRedirectUrl,
    clearRedirectUrl,
    redirectToSavedUrl,
  } = useRedirect();

  // Save current page URL before redirecting to login
  const handleLoginClick = () => {
    saveRedirectUrl(window.location.pathname);
    router.push("/login");
  };

  // Redirect to saved URL after login
  const handleAfterLogin = () => {
    redirectToSavedUrl("/dashboard"); // fallback to dashboard
  };
}
```

## Utilities

### auth-utils.js

Utility functions for authentication and redirect handling.

```jsx
import {
  getLoginUrl,
  isAuthenticated,
  getCurrentUser,
  saveRedirectUrl,
} from "@/lib/auth-utils";

// Generate login URL with redirect parameter
const loginUrl = getLoginUrl("/dashboard");

// Check if user is authenticated
const authenticated = isAuthenticated();

// Get current user data
const user = getCurrentUser();

// Save redirect URL
saveRedirectUrl("/some-protected-page");
```

## How It Works

### 1. Unauthenticated User Access

When an unauthenticated user tries to access a protected page:

1. The `ProtectedRoute` or `withAuth` component detects the user is not authenticated
2. The current page URL is saved to localStorage using `saveRedirectUrl()`
3. The user is redirected to the login page

### 2. Login Process

During the login process:

1. The login page checks for redirect parameters in the URL
2. If found, the redirect URL is saved to localStorage
3. After successful login, the auth context automatically redirects to the saved URL

### 3. Post-Login Redirect

After successful login:

1. The auth context checks for a saved redirect URL in localStorage
2. If found, the user is redirected to that URL and the saved URL is cleared
3. If no saved URL exists, the user is redirected to the dashboard

## Usage Examples

### Protecting a Page

```jsx
// Using ProtectedRoute
function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

// Using withAuth HOC
function ProfilePage() {
  return <ProfileContent />;
}

export default withAuth(ProfilePage);
```

### Manual Redirect Handling

```jsx
function CoursePage() {
  const { saveRedirectUrl } = useRedirect();
  const router = useRouter();

  const handleEnrollClick = () => {
    if (!isAuthenticated()) {
      saveRedirectUrl("/course/123");
      router.push("/login");
    } else {
      // Proceed with enrollment
      enrollInCourse();
    }
  };
}
```

### Login with Redirect Parameter

```jsx
// Navigate to login with redirect parameter
router.push("/login?redirect=" + encodeURIComponent("/course/123"));

// Or use the utility function
router.push(getLoginUrl("/course/123"));
```

## Configuration

The redirect system can be configured through the auth context:

```jsx
// In auth-context.js
const login = (userData, token, redirectUrl = null) => {
  // ... login logic

  if (redirectUrl) {
    router.push(redirectUrl);
  } else {
    const savedRedirectUrl = localStorage.getItem("redirectUrl");
    if (savedRedirectUrl) {
      localStorage.removeItem("redirectUrl");
      router.push(savedRedirectUrl);
    } else {
      router.push("/dashboard"); // default redirect
    }
  }
};
```

## Security Considerations

- Redirect URLs are validated to prevent open redirects
- Login page URLs are never saved as redirect destinations
- All redirect URLs are cleared after successful login
- URL parameters are properly encoded/decoded

## Browser Compatibility

The system uses localStorage for persistence, which is supported in all modern browsers. For older browsers, the system gracefully falls back to default redirects.

# Banned User Handling

This directory contains components and utilities for handling banned users in the application. When a user's `isBanned` property is set to `true`, the system automatically logs them out and redirects them to the home page with a notification.

## Components

### ProtectedRoute

The `ProtectedRoute` component now includes automatic banned user detection. It checks for banned users on every render and prevents access to protected routes.

### BanNotification

A notification component that displays when users are redirected to the home page due to being banned. It shows a dismissible alert with the ban reason.

## Hooks

### useBannedUserHandler

A custom hook that provides utilities for handling banned user scenarios:

```javascript
import { useBannedUserHandler } from "@/hooks/use-realtime-updates";

function MyComponent() {
  const {
    user,
    isBanned,
    isInactive,
    checkUserBanStatus,
    handleBannedUserLogout,
  } = useBannedUserHandler();

  // Use these values in your component
}
```

## Auth Context Features

The auth context now includes:

- **Automatic banned user detection** on app load
- **Real-time status checking** every 5 minutes
- **Cross-tab synchronization** for banned user status
- **Automatic logout and redirect** when banned status is detected

### New Methods

- `checkUserBanStatus()` - Manually check if current user is banned
- `handleBannedUserLogout(reason)` - Force logout with custom reason

## Utility Functions

### auth-utils.js

```javascript
import {
  isUserBannedOrInactive,
  handleBannedUserResponse,
  createBannedUserInterceptor,
  fetchWithBanCheck,
} from "@/lib/auth-utils";

// Check if user data indicates banned status
const isBanned = isUserBannedOrInactive(userData);

// Handle API responses that might contain banned user data
handleBannedUserResponse(userData, logoutFunction, redirectFunction);

// Create an interceptor for API calls
const interceptor = createBannedUserInterceptor(
  logoutFunction,
  redirectFunction
);

// Use enhanced fetch with automatic ban checking
const { response, data } = await fetchWithBanCheck(
  url,
  options,
  logoutFunction,
  redirectFunction
);
```

## How It Works

1. **On App Load**: The auth context checks stored user data for banned status
2. **Real-time Monitoring**: Periodic checks every 5 minutes for banned status
3. **Cross-tab Sync**: LocalStorage changes trigger banned user detection across tabs
4. **API Response Handling**: Utility functions can check API responses for banned user data
5. **Automatic Logout**: When banned status is detected, user is automatically logged out
6. **User Notification**: Banned users are redirected to home page with a notification

## Usage Examples

### In Components

```javascript
import { useBannedUserHandler } from "@/hooks/use-realtime-updates";

function Dashboard() {
  const { isBanned, isInactive } = useBannedUserHandler();

  if (isBanned || isInactive) {
    return <div>Access denied</div>;
  }

  return <div>Dashboard content</div>;
}
```

### In API Calls

```javascript
import { fetchWithBanCheck } from "@/lib/auth-utils";
import { useAuth } from "@/contexts/auth-context";

function MyComponent() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleApiCall = async () => {
    const { response, data } = await fetchWithBanCheck(
      "/api/user/profile",
      { method: "GET" },
      logout,
      router.push
    );

    // Process response...
  };
}
```

## Configuration

The system automatically handles banned users without additional configuration. However, you can customize:

- **Check interval**: Modify the 5-minute interval in auth-context.js
- **Redirect URL**: Change the redirect destination in handleBannedUserLogout
- **Notification duration**: Adjust the auto-hide timer in BanNotification
- **Ban reasons**: Customize the messages shown to users

## Security Notes

- Banned user detection happens on both client and server side
- LocalStorage is cleared immediately when banned status is detected
- Cross-tab synchronization ensures consistent banned user handling
- API responses are checked for banned user data to prevent unauthorized access
