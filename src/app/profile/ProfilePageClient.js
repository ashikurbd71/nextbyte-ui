"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layout"
import { motion } from "framer-motion"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import {
    ProfileHeader,
    ProfileCard,
    PersonalInfoForm,
    CertificatesSection,
    PaymentHistory,
    useProfile
} from "@/components/profile"
import { getCurrentUserPaymentHistory, getStudentPerformance } from "../apis/enrollment-apis/enrollmentApis"
import { getCurrentUserCertificates } from "../apis/certificate-apis/certificateApis"

/**
 * ProfilePageClient - Client Component
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
export function ProfilePageClient() {
    const { logout } = useAuth()

    // Use real-time updates hook to ensure the profile stays in sync
    useRealtimeUpdates()

    const [paymentHistory, setPaymentHistory] = useState([])
    const [certificates, setCertificates] = useState([])
    const [studentPerformance, setStudentPerformance] = useState([])

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const response = await getCurrentUserPaymentHistory()
                setPaymentHistory(response)
            } catch (error) {
                console.error("Error fetching payment history:", error)
            }
        }
        const fetchCertificates = async () => {
            try {
                const response = await getCurrentUserCertificates()
                setCertificates(response)
            } catch (error) {
                console.error("Error fetching certificates:", error)
            }
        }
        const fetchStudentPerformance = async () => {
            try {
                const response = await getStudentPerformance()
                setStudentPerformance(response)
            } catch (error) {
                console.error("Error fetching student performance:", error)
            }
        }

        fetchCertificates()
        fetchPaymentHistory()
        fetchStudentPerformance()
    }, [])

    const {
        user,
        editedUser,
        isEditing,
        isUploading,
        isLoading,
        fileInputRef,
        handleFileUpload,
        handleCameraClick,
        handleSave,
        handleEdit,
        handleCancel,
        handleInputChange
    } = useProfile()

    const handleLogout = () => {
        logout()
    }

    return (
        <ProtectedRoute>
            <AppLayout onLogout={handleLogout} user={user}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <ProfileHeader />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <ProfileCard
                                    user={user}
                                    isEditing={isEditing}
                                    studentPerformance={studentPerformance}
                                    isUploading={isUploading}
                                    fileInputRef={fileInputRef}
                                    onCameraClick={handleCameraClick}
                                    onFileUpload={handleFileUpload}
                                    onEdit={handleEdit}
                                    onCancel={handleCancel}
                                />
                            </div>

                            {/* Personal Information Form */}
                            <div className="lg:col-span-2">
                                <PersonalInfoForm
                                    user={user}
                                    editedUser={editedUser}
                                    isEditing={isEditing}
                                    isLoading={isLoading}
                                    onInputChange={handleInputChange}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            </div>
                        </div>

                        {/* Certificates Section */}
                        <CertificatesSection certificates={certificates} />

                        {/* Payment History Section */}
                        <div className="mt-8">
                            <PaymentHistory paymentHistory={paymentHistory} />
                        </div>
                    </motion.div>
                </div>
            </AppLayout>
        </ProtectedRoute>
    )
}
