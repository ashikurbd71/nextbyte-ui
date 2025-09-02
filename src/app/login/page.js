import { Suspense } from "react"
import { LoginPageClient } from "./LoginPageClient"

// Loading component for Suspense fallback
function LoginLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading login page...</p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginPageClient />
        </Suspense>
    )
}
