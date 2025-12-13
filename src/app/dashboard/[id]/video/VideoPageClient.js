"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { VideoContent } from "./video-content"
import { getEnrollmentById } from "@/app/apis/enrollment-apis/enrollmentApis"

export function VideoPageClient() {
    const { user: authUser, logout } = useAuth()
    const params = useParams()
    const [enrollment, setEnrollment] = useState(null)
    const [loading, setLoading] = useState(true)

    // Get enrollment ID from route params
    const enrollmentId = params?.id

    useEffect(() => {
        const fetchEnrollment = async () => {
            if (!enrollmentId) return

            try {
                setLoading(true)
                const enrollmentData = await getEnrollmentById(enrollmentId)
                setEnrollment(enrollmentData)
            } catch (error) {
                console.error("Error fetching enrollment:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEnrollment()
    }, [enrollmentId])

    if (loading && !enrollment) {
        return (
            <ProtectedRoute>
                <AppLayout onLogout={logout} user={authUser}>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading video player...</p>
                        </div>
                    </div>
                </AppLayout>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={logout} user={authUser}>
                <VideoContent enrollment={enrollment} />
            </AppLayout>
        </ProtectedRoute>
    )
}

