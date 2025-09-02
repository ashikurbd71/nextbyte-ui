"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { WelcomeSection, StatsGrid, RecentCourses } from "@/components/dashboard"
import { getStudentPerformance } from "../apis/enrollment-apis/enrollmentApis"

/**
 * DashboardPageClient - Client Component
 * 
 * This component needs "use client" because it:
 * 1. Uses React hooks (useState, useEffect)
 * 2. Handles authentication and user state
 * 3. Manages API calls and data fetching
 * 4. Uses browser APIs and client-side state
 * 
 * Suspense is required because:
 * 1. The useRealtimeUpdates hook uses useSearchParams() internally through useRedirect
 * 2. Next.js requires Suspense boundaries around components using useSearchParams()
 * 3. This prevents the "useSearchParams() should be wrapped in a suspense boundary" error
 * 4. Suspense provides a fallback UI while the component is loading
 */
export function DashboardPageClient() {
    const { user: authUser, logout } = useAuth()

    // Use real-time updates hook to ensure the dashboard stays in sync
    useRealtimeUpdates()

    const [user, setUser] = useState({
        name: authUser?.name || "John Doe",
        phone: authUser?.phone || "+1234567890",
        email: authUser?.email || "john@example.com",
        photoURL: authUser?.photoURL || authUser?.photoUrl || "/ceo.png"
    })

    // Update user state when authUser changes
    useEffect(() => {
        if (authUser) {
            setUser({
                name: authUser.name || "John Doe",
                phone: authUser.phone || "+1234567890",
                email: authUser.email || "john@example.com",
                photoURL: authUser.photoURL || authUser.photoUrl || "/ceo.png"
            })
        }
    }, [authUser])

    const [performance, setPerformance] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                setLoading(true)
                const data = await getStudentPerformance()
                setPerformance(data)
            } catch (error) {
                console.error('Error fetching performance:', error)
                setError(error.message)
                // Set default performance data if API fails
                setPerformance({
                    totalCourses: 0,
                    completedCourses: 0,
                    averageScore: 0,
                    totalHours: 0
                })
            } finally {
                setLoading(false)
            }
        }
        // Only fetch if user is authenticated
        if (authUser) {
            fetchPerformance()
        } else {
            setLoading(false)
        }
    }, [authUser])

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={user}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-16">
                    <WelcomeSection user={user} />
                    <StatsGrid stats={performance || {
                        totalCourses: 0,
                        completedCourses: 0,
                        averageScore: 0,
                        totalHours: 0
                    }} />
                    <RecentCourses />
                </div>
            </AppLayout>
        </ProtectedRoute>
    )
}
