"use client"

import { Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { Loader2 } from "lucide-react"
import { CourseAnalyticsContent } from "./course-analytics-content"

// Loading component for Suspense fallback
function CourseAnalyticsLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                <p className="text-white/70">Loading course analytics...</p>
            </div>
        </div>
    )
}

export default function CourseAnalyticsPage() {
    const { user: authUser, logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={authUser}>
                <Suspense fallback={<CourseAnalyticsLoading />}>
                    <CourseAnalyticsContent />
                </Suspense>
            </AppLayout>
        </ProtectedRoute>
    )
}
