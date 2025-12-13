"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, BarChart3, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Leaderboard from "@/components/dashboard/leaderboard"
import AssignmentsChart from "@/components/dashboard/assignments-chart"
import { getCourseLeaderboard } from "@/app/apis/enrollment-apis/enrollmentApis"
import { useAuth } from "@/contexts/auth-context"

export function CourseAnalyticsContent() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const { user: authUser } = useAuth()

    const [activeTab, setActiveTab] = useState("leaderboard")
    const [leaderboardData, setLeaderboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Get course ID from route params
    const courseId =7;


    // Get optional course data from query params (for display purposes)
    const courseTitle = searchParams.get('title') || "Course Analytics"
    const totalStudents = parseInt(searchParams.get('totalStudents') || '0')

    useEffect(() => {
        const fetchCourseAnalytics = async () => {
            if (!courseId) return

            try {
                setLoading(true)
                const response = await getCourseLeaderboard(courseId)
                setLeaderboardData(response)
            } catch (error) {
                console.error("Error fetching course analytics:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourseAnalytics()
    }, [courseId])

    const loginUserRank = useMemo(() => {
        if (!leaderboardData || !authUser?.id) return null
        return leaderboardData.find(student => student.student.id === authUser.id)
    }, [leaderboardData, authUser?.id])

    const tabs = [
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "assignments", label: "Assignments", icon: BarChart3 },
    ]

    const handleBack = () => {
        router.push('/dashboard')
    }

    if (loading && !leaderboardData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course analytics...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-3 sm:mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Back to Dashboard</span>
                </Button>

                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-2xl">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent leading-tight">
                        {courseTitle} Analytics
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base lg:text-lg">Track your performance and compare with peers</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
                <div className="flex space-x-1 min-w-max">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "default" : "ghost"}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm ${activeTab === tab.id
                                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
                {activeTab === "leaderboard" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 sm:space-y-6"
                    >
                        <Leaderboard
                            leaderboardData={leaderboardData}
                            userRank={loginUserRank?.rank}
                            averageScore={loginUserRank?.averageMarks}
                            totalStudents={totalStudents}
                        />
                    </motion.div>
                )}

                {activeTab === "assignments" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 sm:space-y-6"
                    >
                        <AssignmentsChart courseId={courseId} />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

