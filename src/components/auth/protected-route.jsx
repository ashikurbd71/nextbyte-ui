"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRedirect } from "@/hooks/use-redirect"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }) {
    const { user, loading, isAuthenticated, checkUserBanStatus } = useAuth()
    const { saveRedirectUrl } = useRedirect()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Save current URL before redirecting to login
            saveRedirectUrl(pathname)

            // Redirect to login if not authenticated
            router.push("/login")
        }
    }, [loading, isAuthenticated, pathname, saveRedirectUrl, router])

    // Check for banned users on every render
    useEffect(() => {
        if (!loading && user) {
            // Check if user is banned or inactive
            if (user.isBanned === true || user.isActive === false) {
                // The auth context will handle the logout automatically
                // This is just an additional check for the protected route
                return
            }
        }
    }, [loading, user])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white/70">Loading...</p>
                </motion.div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // Will redirect to login
    }

    // Additional check for banned users
    if (user && (user.isBanned === true || user.isActive === false)) {
        return null // Will be handled by auth context
    }

    return children
}
