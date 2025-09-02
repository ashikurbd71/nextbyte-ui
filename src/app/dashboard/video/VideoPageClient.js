"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { VideoContent } from "./video-content"
import { getEnrollmentById } from "@/app/apis/enrollment-apis/enrollmentApis"

export function VideoPageClient() {
    const { user: authUser, logout } = useAuth()
    const searchParams = useSearchParams()
    const [enrollment, setEnrollment] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Get URL parameters using useSearchParams
        const id = searchParams.get('id')

        const fetchEnrollment = async () => {
            if (id) {
                const enrollment = await getEnrollmentById(id)
                setEnrollment(enrollment)
            }
        }
        fetchEnrollment()
    }, [mounted, searchParams])

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={authUser}>
                <VideoContent enrollment={enrollment} />
            </AppLayout>
        </ProtectedRoute>
    )
}
