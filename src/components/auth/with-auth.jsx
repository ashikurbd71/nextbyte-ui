"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRedirect } from "@/hooks/use-redirect"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export function withAuth(Component, options = {}) {
    const { redirectTo = "/login", showLoading = true } = options

    return function AuthenticatedComponent(props) {
        const { user, loading, isAuthenticated } = useAuth()
        const { saveRedirectUrl } = useRedirect()
        const router = useRouter()
        const pathname = usePathname()

        useEffect(() => {
            if (!loading && !isAuthenticated) {
                // Save current URL before redirecting
                saveRedirectUrl(pathname)

                // Redirect to login if not authenticated
                router.push(redirectTo)
            }
        }, [loading, isAuthenticated, pathname, saveRedirectUrl, router, redirectTo])

        if (loading && showLoading) {
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

        return <Component {...props} />
    }
}
