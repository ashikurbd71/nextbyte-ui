import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

/**
 * Custom hook for handling real-time user data updates
 * This hook ensures that components stay in sync with the latest user data
 * and automatically handles banned user logout
 */
export function useRealtimeUpdates() {
    const { user, updateUser, checkUserBanStatus } = useAuth()

    useEffect(() => {
        // Listen for custom user data update events
        const handleUserDataUpdate = (event) => {
            const updatedUserData = event.detail
            if (updatedUserData && updatedUserData !== user) {
                // Check if the updated user data indicates a banned status
                if (updatedUserData.isBanned === true || updatedUserData.isActive === false) {
                    // The auth context will handle the logout automatically
                    return
                }
                updateUser(updatedUserData)
            }
        }

        // Listen for localStorage changes (for cross-tab synchronization)
        const handleStorageChange = (e) => {
            if (e.key === 'userData' && e.newValue) {
                try {
                    const newUserData = JSON.parse(e.newValue)

                    // Check if the new user data indicates a banned status
                    if (newUserData.isBanned === true || newUserData.isActive === false) {
                        // The auth context will handle the logout automatically
                        return
                    }

                    if (newUserData !== user) {
                        updateUser(newUserData)
                    }
                } catch (error) {
                    console.error('Error parsing user data from storage:', error)
                }
            }
        }

        // Add event listeners
        window.addEventListener('userDataUpdated', handleUserDataUpdate)
        window.addEventListener('storage', handleStorageChange)

        // Cleanup event listeners
        return () => {
            window.removeEventListener('userDataUpdated', handleUserDataUpdate)
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [user, updateUser])

    return { user }
}

/**
 * Hook for components that need to react to user data changes
 * This is useful for components that display user information
 * and need to handle banned user scenarios
 */
export function useUserDataSync() {
    const { user, checkUserBanStatus } = useAuth()

    useEffect(() => {
        // This effect will run whenever user data changes
        // Components can use this to trigger additional updates or side effects
        if (user) {
            // Check for banned status on every user data change
            if (user.isBanned === true || user.isActive === false) {
                // The auth context will handle the logout automatically
                return
            }

            // You can add any additional logic here that should run when user data changes
            // console.log('User data updated:', user)
        }
    }, [user])

    return { user }
}

/**
 * Hook specifically for handling banned user scenarios
 * This hook provides additional utilities for components that need to
 * handle banned user states or show appropriate messages
 */
export function useBannedUserHandler() {
    const { user, checkUserBanStatus, handleBannedUserLogout } = useAuth()

    useEffect(() => {
        // Check user status on mount and when user changes
        if (user) {
            const isBanned = checkUserBanStatus()
            if (isBanned) {
                // The auth context will handle the logout automatically
                return
            }
        }
    }, [user, checkUserBanStatus])

    return {
        user,
        isBanned: user?.isBanned === true,
        isInactive: user?.isActive === false,
        checkUserBanStatus,
        handleBannedUserLogout
    }
}
