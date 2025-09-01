"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Star } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ReviewModal from "./review-modal"
import { createReview } from "@/app/apis/reviews-apis/reviewsApis"
import { useAuth } from "@/contexts/auth-context"
import { toast } from 'sonner'
import { getInstructorName } from "@/lib/utils"

export default function CourseCard({ course, index }) {
    const router = useRouter()
    const { user } = useAuth()
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    const handleAnalyticsClick = () => {
        const params = new URLSearchParams({
            id: course.id,
            title: course?.course?.name,
            progress: course.progress,
            instructor: getInstructorName(course?.course?.instructor),
            totalStudents: course?.course?.totalJoin
        })
        router.push(`/dashboard/course-analytics?${params.toString()}`)
    }



    const handleReviewSubmit = async (reviewData) => {
        try {
            await createReview(reviewData)
            // Show success message
            toast.success("Review submitted successfully!")
        } catch (error) {
            console.error("Error submitting review:", error)

            // Handle specific error messages from the API
            if (error.message && error.message.includes("already reviewed")) {
                toast.error("You have already reviewed this course!")
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error("Failed to submit review. Please try again.")
            }

            throw error
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <div className="relative h-32 sm:h-40 lg:h-48">
                    <Image
                        src={course?.course?.thumbnail}
                        alt={course?.course?.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-1">
                            {course?.course?.name}
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm">
                            by {getInstructorName(course?.course?.instructor)}
                        </p>
                    </div>
                </div>
                <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-xs sm:text-sm">Progress</span>
                        <span className="text-white font-semibold text-sm sm:text-base">{course?.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course?.progress}%` }}
                        />
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-4">
                        <Button
                            className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-lg text-xs sm:text-sm py-1.5 sm:py-2"
                            onClick={() => {
                                const params = new URLSearchParams({
                                    id: course.id,
                                    title: course?.course?.name,
                                    progress: course.progress,
                                    instructor: getInstructorName(course?.course?.instructor)
                                })
                                router.push(`/dashboard/video?${params.toString()}`)
                            }}
                        >
                            Continue
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAnalyticsClick}
                            className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-lg px-2 sm:px-3"
                        >
                            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsReviewModalOpen(true)}
                            className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-lg px-2 sm:px-3"
                            title="Write a Review"
                        >
                            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                course={course}
                onSubmit={handleReviewSubmit}
            />
        </motion.div>
    )
}
