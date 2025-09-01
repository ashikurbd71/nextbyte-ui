"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { Loader2 } from "lucide-react"
import { VideoContent } from "./video-content"
import { getEnrollmentById } from "@/app/apis/enrollment-apis/enrollmentApis"
import { useSearchParams } from "next/navigation"

// Loading component for Suspense fallback
function VideoLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
                <p className="text-white/70">Loading video player...</p>
            </div>
        </div>
    )
}

export default function VideoPage() {
    const { user: authUser, logout } = useAuth()
    const [enrollment, setEnrollment] = useState(null)
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        const fetchEnrollment = async () => {
            if (id) {
                const enrollment = await getEnrollmentById(id)
                setEnrollment(enrollment)
            }
        }
        fetchEnrollment()
    }, [id])

    console.log(enrollment)

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={authUser}>
                <Suspense fallback={<VideoLoading />}>
                    <VideoContent enrollment={enrollment} />
                </Suspense>
            </AppLayout>
        </ProtectedRoute>
    )
}
