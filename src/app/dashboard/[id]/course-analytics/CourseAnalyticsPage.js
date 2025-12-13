"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { CourseAnalyticsContent } from "./course-analytics-content"

export function CourseAnalyticsPage() {
    const { user: authUser, logout } = useAuth()

    return (
        <ProtectedRoute>
            <AppLayout onLogout={logout} user={authUser}>
                <CourseAnalyticsContent />
            </AppLayout>
        </ProtectedRoute>
    )
}

