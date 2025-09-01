"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Function to handle banned user logout
    const handleBannedUserLogout = useCallback((reason = "Your account has been banned. Please contact support for assistance.") => {
        // Clear auth data
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
        setUser(null)

        // Show notification to user (you can customize this)
        console.warn("User banned:", reason)

        // Redirect to home page with ban message
        router.push("/?banned=true")
    }, [router])

    // Function to check if user is banned and handle accordingly
    const checkUserStatus = useCallback((userData) => {
        if (!userData) return false

        if (userData.isBanned === true) {
            handleBannedUserLogout("Your account has been banned. Please contact support for assistance.")
            return true
        }

        if (userData.isActive === false) {
            handleBannedUserLogout("Your account has been deactivated. Please contact support for assistance.")
            return true
        }

        return false
    }, [handleBannedUserLogout])

    useEffect(() => {
        // Check if user is logged in on app load
        const checkAuth = () => {
            try {
                const authToken = localStorage.getItem("authToken")
                const userData = localStorage.getItem("userData")

                if (authToken && userData) {
                    const parsedUserData = JSON.parse(userData)

                    // Check user status and handle banned/inactive users
                    if (!checkUserStatus(parsedUserData)) {
                        setUser(parsedUserData)
                    }
                }
            } catch (error) {
                console.error("Error checking auth:", error)
                // Clear invalid data
                localStorage.removeItem("authToken")
                localStorage.removeItem("userData")
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [checkUserStatus])

    // Listen for localStorage changes to sync user data across tabs/windows
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "userData" && e.newValue) {
                try {
                    const newUserData = JSON.parse(e.newValue)

                    // Check user status and handle banned/inactive users
                    if (!checkUserStatus(newUserData)) {
                        setUser(newUserData)
                    }
                } catch (error) {
                    console.error("Error parsing user data from storage:", error)
                }
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [checkUserStatus])

    // Real-time user status check (can be called periodically or on specific events)
    useEffect(() => {
        if (!user) return

        // Check user status periodically (every 5 minutes)
        const interval = setInterval(() => {
            if (user && (user.isBanned === true || user.isActive === false)) {
                handleBannedUserLogout()
            }
        }, 5 * 60 * 1000) // 5 minutes

        return () => clearInterval(interval)
    }, [user, handleBannedUserLogout])

    const login = useCallback((userData, token, redirectUrl = null) => {
        // Check if user is banned before allowing login
        if (checkUserStatus(userData)) {
            return // handleBannedUserLogout will handle the redirect
        }

        try {
            // Store authentication data
            localStorage.setItem("authToken", token)
            localStorage.setItem("userData", JSON.stringify(userData))
            setUser(userData)

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
    }, [checkUserStatus, router])

    const logout = useCallback(() => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
        setUser(null)
        router.push("/")
    }, [router])

    const updateUser = useCallback((userData) => {
        // Check if the updated user data indicates a banned status
        if (checkUserStatus(userData)) {
            return // handleBannedUserLogout will handle the redirect
        }

        // Ensure we're updating with the complete user object
        const updatedUserData = typeof userData === 'object' ? userData : { ...user, ...userData }
        localStorage.setItem("userData", JSON.stringify(updatedUserData))
        setUser(updatedUserData)

        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUserData }))
    }, [checkUserStatus, user])

    // Function to force check user status (can be called from components)
    const checkUserBanStatus = useCallback(() => {
        if (user && checkUserStatus(user)) {
            return true // User is banned/inactive
        }
        return false
    }, [user, checkUserStatus])

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        updateUser,
        checkUserBanStatus,
        handleBannedUserLogout,
        isAuthenticated: !!user
    }), [user, loading, login, logout, updateUser, checkUserBanStatus, handleBannedUserLogout])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
