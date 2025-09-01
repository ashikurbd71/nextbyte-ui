"use client"

import { motion } from "framer-motion"
import CourseCard from "./course-card"
import { getUserEnrollments } from "@/app/apis/enrollment-apis/enrollmentApis"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RecentCourses() {
    const [userEnrollments, setUserEnrollments] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isNavigating, setIsNavigating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchUserEnrollments = async () => {
            try {
                setLoading(true)
                const userEnrollments = await getUserEnrollments()
                console.log('Raw user enrollments:', userEnrollments)
                setUserEnrollments(userEnrollments)
            } catch (error) {
                console.error('Error fetching user enrollments:', error)
                setError(error.message)
                // Set default courses if API fails

            } finally {
                setLoading(false)
            }
        }
        fetchUserEnrollments()
    }, [])

    const handleExploreClick = () => {
        setIsNavigating(true)

        // Navigate to home page first
        router.push('/')

        // Use a more robust approach to ensure smooth scrolling after navigation
        const handleScrollToCourses = () => {
            const coursesSection = document.getElementById('courses')
            if (coursesSection) {
                // Get the navigation height for proper offset
                const navElement = document.querySelector('nav')
                const navHeight = navElement ? navElement.offsetHeight : 80

                // Calculate target position with proper offset
                const targetPosition = coursesSection.offsetTop - navHeight - 20

                // Use smooth scrolling
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })

                // Reset navigation state after successful scroll
                setTimeout(() => setIsNavigating(false), 1000)
            }
        }

        // Try multiple times to ensure the element is available after navigation
        setTimeout(handleScrollToCourses, 100)
        setTimeout(handleScrollToCourses, 300)
        setTimeout(handleScrollToCourses, 500)

        // Fallback: reset navigation state if scrolling fails
        setTimeout(() => setIsNavigating(false), 2000)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 lg:mb-8"
        >
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Continue Learning</h2>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={`skeleton-${item}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + item * 0.1 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg h-64 animate-pulse"
                        />
                    ))}
                </div>
            ) : userEnrollments && userEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {userEnrollments.map((course, index) => (
                        <CourseCard key={course.id || `enrollment-${index}`} course={course} index={index} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-8">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-semibold text-lg">No Courses Enrolled</h3>
                                <p className="text-white/70 text-sm max-w-md">
                                    You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog!
                                </p>
                            </div>
                            <Button
                                onClick={handleExploreClick}
                                disabled={isNavigating}
                                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-lg px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{isNavigating ? 'Navigating...' : 'Explore Courses'}</span>
                                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isNavigating ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
