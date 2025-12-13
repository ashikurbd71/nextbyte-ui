"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { getCourseById } from "@/app/apis/course-apis/courseApis"
import { initiatePayment } from "@/app/apis/enrollment-apis/enrollmentApis"
import { useAuth } from "@/contexts/auth-context"
import { useRedirect } from "@/hooks/use-redirect"
import { toast } from 'sonner'
import { Loader2 } from "lucide-react"
import {
    CourseHeader,
    CoursePreview,
    TabNavigation,
    TabContent,
    CourseSidebar
} from "@/components/course-details"

export function CourseDetailPageClient() {
    const router = useRouter()
    const params = useParams()
    const { user } = useAuth()
    const { saveRedirectUrl } = useRedirect()
    const [activeTab, setActiveTab] = useState('overview')
    const [isLiked, setIsLiked] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const [courseData, setCourseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [error, setError] = useState(null)
    const [mounted, setMounted] = useState(false)
    const [courseId, setCourseId] = useState(null)

    // Get courseId from route parameters using useParams
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Get course ID from route params
        const id = params?.id

        if (id) {
            setCourseId(id)
        } else {
            setError("Course ID is required")
            setLoading(false)
        }
    }, [mounted, params])

    useEffect(() => {
        if (!courseId) return

        const fetchCourseData = async () => {
            try {
                setLoading(true)
                const response = await getCourseById(courseId)
                setCourseData(response.data)
            } catch (error) {
                console.error("Error fetching course data:", error)
                setError(error.message || "Failed to load course data")
            } finally {
                setLoading(false)
            }
        }

        fetchCourseData()
    }, [courseId])

    const handlePayment = async () => {
        if (!user) {
            // Save current page URL for redirect after login
            const currentUrl = window.location.href
            saveRedirectUrl(currentUrl)

            // Show toast and redirect to login page
            toast.error("Please login to enroll in this course")
            router.push('/login')
            return
        }

        if (!courseData) {
            toast.error("Course data not available")
            return
        }

        setPaymentLoading(true)

        try {
            const paymentData = {
                courseId: courseData.id,
            }

            const response = await initiatePayment(paymentData)

            if (response.success && response.data?.gatewayUrl) {
                // Redirect to SSL payment gateway
                window.location.href = response.data.gatewayUrl
            } else {
                toast.error("Payment initiation failed")
            }
        } catch (error) {
            console.error("Payment error:", error)
            toast.error(error.message || "Payment initiation failed")
        } finally {
            setPaymentLoading(false)
        }
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
    }

    const handleShare = () => {
        setShowShareMenu(!showShareMenu)
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
                    <p className="text-white">Loading course details...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !courseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || "Course not found"}</p>
                    <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        )
    }

    // Calculate average rating
    const averageRating = courseData.reviews && courseData.reviews.length > 0
        ? courseData.reviews.reduce((sum, review) => sum + review.rating, 0) / courseData.reviews.length
        : 0

    // Calculate total lessons
    const totalLessons = courseData.modules?.reduce((sum, module) =>
        sum + (module.lessons?.length || 0), 0) || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <Navigation />

            <div className="py-24">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* Course Header */}
                    <CourseHeader courseData={courseData} averageRating={averageRating} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 order-1 lg:order-1">
                            {/* Course Preview Video */}
                            <CoursePreview courseData={courseData} />

                            {/* Tabs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                                    {/* Tab Navigation */}
                                    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                                    {/* Tab Content */}
                                    <TabContent
                                        activeTab={activeTab}
                                        courseData={courseData}
                                        averageRating={averageRating}
                                        totalLessons={totalLessons}
                                    />
                                </Card>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 order-2 lg:order-2">
                            <CourseSidebar
                                courseData={courseData}
                                paymentLoading={paymentLoading}
                                handlePayment={handlePayment}
                                isLiked={isLiked}
                                handleLike={handleLike}
                                showShareMenu={showShareMenu}
                                handleShare={handleShare}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
