"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { CourseAnalyticsContent } from "./course-analytics-content"

/**
 * CourseAnalyticsPage - Client Component
 * 
 * This component needs "use client" because it:
 * 1. Uses React hooks (useState, useEffect, useSearchParams)
 * 2. Accesses browser APIs and client-side state
 * 3. Handles user interactions and authentication
 * 4. Manages component state and side effects
 * 
 * Suspense is required because:
 * 1. useSearchParams() is a client-side hook that can cause hydration mismatches
 * 2. Next.js requires Suspense boundaries around components using useSearchParams()
 * 3. This prevents the "useSearchParams() should be wrapped in a suspense boundary" error
 * 4. Suspense provides a fallback UI while the component is loading
 */
export function CourseAnalyticsPage() {
    const { user: authUser, logout } = useAuth()

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={authUser}>
                <CourseAnalyticsContent />
            </AppLayout>
        </ProtectedRoute>
    )
}
