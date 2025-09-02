import { Suspense } from "react"
import { CourseDetailPageClient } from "./CourseDetailPageClient"

// Loading component for Suspense fallback
function CourseDetailLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
            </div>
        </div>
    )
}

export default function CourseDetailPage() {
    return (
        <Suspense fallback={<CourseDetailLoading />}>
            <CourseDetailPageClient />
        </Suspense>
    )
}
