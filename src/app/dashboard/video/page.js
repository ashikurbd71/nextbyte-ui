import { Suspense } from "react"
import { VideoPageClient } from "./VideoPageClient"

// Loading component for Suspense fallback
function VideoLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video player...</p>
            </div>
        </div>
    )
}

export default function VideoPage() {
    return (
        <Suspense fallback={<VideoLoading />}>
            <VideoPageClient />
        </Suspense>
    )
}
