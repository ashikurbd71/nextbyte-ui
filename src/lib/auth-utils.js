/**
 * Utility functions for authentication and redirect handling
 */

/**
 * Generate a login URL with redirect parameter
 * @param {string} redirectUrl - The URL to redirect to after login
 * @returns {string} - Login URL with redirect parameter
 */
export function getLoginUrl(redirectUrl = null) {
    if (!redirectUrl) {
        return '/login'
    }

    // Encode the redirect URL to be safe in query parameters
    const encodedRedirect = encodeURIComponent(redirectUrl)
    return `/login?redirect=${encodedRedirect}`
}

/**
 * Check if user is authenticated (client-side)
 * @returns {boolean} - True if user is authenticated
 */
export function isAuthenticated() {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')

        if (!token || !userData) {
            return false
        }

        const user = JSON.parse(userData)

        // Check if user is banned or inactive
        if (user.isBanned === true || user.isActive === false) {
            return false
        }

        return true
    } catch (error) {
        console.error('Error checking authentication:', error)
        return false
    }
}

/**
 * Get current user data from localStorage
 * @returns {object|null} - User data or null if not authenticated
 */
export function getCurrentUser() {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const userData = localStorage.getItem('userData')
        if (!userData) {
            return null
        }

        const user = JSON.parse(userData)

        // Check if user is banned or inactive
        if (user.isBanned === true || user.isActive === false) {
            return null
        }

        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Auth token or null if not found
 */
export function getAuthToken() {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        return localStorage.getItem('authToken')
    } catch (error) {
        console.error('Error getting auth token:', error)
        return null
    }
}

/**
 * Clear all authentication data
 */
export function clearAuthData() {
    if (typeof window === 'undefined') {
        return
    }

    try {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('redirectUrl')
        console.log('Authentication data cleared')
    } catch (error) {
        console.error('Error clearing auth data:', error)
    }
}

/**
 * Handle login redirection with improved error handling
 * @param {object} userData - User data from login response
 * @param {string} token - Authentication token
 * @param {string} redirectUrl - Optional redirect URL
 * @param {function} router - Next.js router instance
 */
export function handleLoginRedirect(userData, token, redirectUrl = null, router) {
    try {
        // Store authentication data
        localStorage.setItem("authToken", token)
        localStorage.setItem("userData", JSON.stringify(userData))

        console.log("Login successful, handling redirect...")

        // Handle redirect after successful login
        if (redirectUrl) {
            // Clear the redirect URL from localStorage
            localStorage.removeItem('redirectUrl')
            console.log("Redirecting to provided URL:", redirectUrl)
            router.push(redirectUrl)
        } else {
            // Check if there's a saved redirect URL
            const savedRedirectUrl = localStorage.getItem('redirectUrl')
            if (savedRedirectUrl) {
                localStorage.removeItem('redirectUrl')
                console.log("Redirecting to saved URL:", savedRedirectUrl)
                router.push(savedRedirectUrl)
            } else {
                console.log("Redirecting to dashboard (default)")
                router.push('/dashboard')
            }
        }
    } catch (error) {
        console.error("Error during login redirect:", error)
        // Fallback to dashboard if there's an error
        router.push('/dashboard')
    }
}

/**
 * Check if user is banned or inactive
 * @param {object} userData - User data to check
 * @returns {boolean} - True if user is banned or inactive
 */
export function isUserBannedOrInactive(userData) {
    if (!userData) return false

    return userData.isBanned === true || userData.isActive === false
}

/**
 * Handle banned or inactive user logout
 * @param {string} reason - Reason for logout
 * @param {function} router - Next.js router instance
 */
export function handleBannedUserLogout(reason = "Your account has been banned. Please contact support for assistance.", router) {
    // Clear auth data
    clearAuthData()

    // Show notification to user
    console.warn("User banned:", reason)

    // Redirect to home page with ban message
    if (router) {
        router.push("/?banned=true")
    }
}

/**
 * Check and handle inactive user
 * @param {object} userData - User data to check
 * @param {function} router - Next.js router instance
 * @returns {boolean} - True if user is active, false if banned/inactive
 */
export function checkAndHandleInactiveUser(userData, router) {
    if (isUserBannedOrInactive(userData)) {
        handleBannedUserLogout("Your account has been deactivated. Please contact support for assistance.", router)
        return false
    }

    return true
}

/**
 * Save redirect URL for after login
 * @param {string} url - The URL to redirect to after login
 */
export function saveRedirectUrl(url) {
    if (typeof window === 'undefined') {
        return
    }

    // Don't save login page as redirect URL
    if (!url.includes('/login')) {
        try {
            localStorage.setItem('redirectUrl', url)
            console.log("Saved redirect URL:", url)
        } catch (error) {
            console.error("Error saving redirect URL:", error)
        }
    }
}

/**
 * Get saved redirect URL
 * @returns {string|null} - Saved redirect URL or null
 */
export function getSavedRedirectUrl() {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        return localStorage.getItem('redirectUrl')
    } catch (error) {
        console.error("Error getting saved redirect URL:", error)
        return null
    }
}

/**
 * Clear saved redirect URL
 */
export function clearSavedRedirectUrl() {
    if (typeof window === 'undefined') {
        return
    }

    try {
        localStorage.removeItem('redirectUrl')
        console.log("Cleared saved redirect URL")
    } catch (error) {
        console.error("Error clearing saved redirect URL:", error)
    }
}



/**
 * Handle banned user response from API
 * This function should be called when API responses indicate a user is banned
 * @param {Object} userData - User data from API response
 * @param {Function} logoutFunction - Function to call for logout
 * @param {Function} redirectFunction - Function to call for redirect
 * @returns {boolean} - True if user was banned/inactive and logout was triggered
 */
export function handleBannedUserResponse(userData, logoutFunction, redirectFunction) {
    if (isUserBannedOrInactive(userData)) {
        // Clear auth data
        if (typeof window !== 'undefined') {
            localStorage.removeItem("authToken")
            localStorage.removeItem("userData")
        }

        // Call logout function if provided
        if (logoutFunction) {
            logoutFunction()
        }

        // Redirect to home with ban message
        if (redirectFunction) {
            const reason = userData.isBanned ?
                "Your account has been banned. Please contact support for assistance." :
                "Your account has been deactivated. Please contact support for assistance."

            redirectFunction(`/?banned=true&reason=${encodeURIComponent(reason)}`)
        }

        return true
    }

    return false
}

/**
 * Create an API response interceptor for automatic banned user detection
 * This can be used with fetch or axios to automatically check responses
 * @param {Function} logoutFunction - Function to call for logout
 * @param {Function} redirectFunction - Function to call for redirect
 * @returns {Function} - Interceptor function
 */
export function createBannedUserInterceptor(logoutFunction, redirectFunction) {
    return (response) => {
        // Check if response contains user data that indicates banned status
        if (response && response.data && response.data.user) {
            handleBannedUserResponse(response.data.user, logoutFunction, redirectFunction)
        }

        return response
    }
}

/**
 * Enhanced fetch wrapper that automatically handles banned user responses
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {Function} logoutFunction - Function to call for logout
 * @param {Function} redirectFunction - Function to call for redirect
 * @returns {Promise} - Fetch promise
 */
export async function fetchWithBanCheck(url, options = {}, logoutFunction, redirectFunction) {
    try {
        const response = await fetch(url, options)
        const data = await response.json()

        // Check if response contains user data that indicates banned status
        if (data && data.user) {
            handleBannedUserResponse(data.user, logoutFunction, redirectFunction)
        }

        return { response, data }
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}
