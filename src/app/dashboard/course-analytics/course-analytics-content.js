"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { X, Trophy, BarChart3, TrendingUp, Users, Award, Calendar, Target, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Leaderboard from "@/components/dashboard/leaderboard"
import AssignmentsChart from "@/components/dashboard/assignments-chart"
import { getCourseLeaderboard } from "@/app/apis/enrollment-apis/enrollmentApis"
import { useAuth } from "@/contexts/auth-context"

export function CourseAnalyticsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState("leaderboard")
    const [course, setCourse] = useState(null)
    const [leaderboardData, setLeaderboardData] = useState(null)
    const [totalStudents, setTotalStudents] = useState(0)
    const { user: authUser } = useAuth()

    // Get course data from URL params
    useEffect(() => {
        const courseId = searchParams.get('id')
        const courseTitle = searchParams.get('title')
        const courseProgress = searchParams.get('progress')
        const courseInstructor = searchParams.get('instructor')
        const totalStudents = searchParams.get('totalStudents')

        if (courseId) {
            setCourse({
                id: courseId,
                title: courseTitle || "Course Analytics",
                progress: parseInt(courseProgress) || 0,
                instructor: courseInstructor || "Instructor"
            })
            setTotalStudents(parseInt(totalStudents) || 0)
        }
        const fetchCourseAnalytics = async () => {
            const response = await getCourseLeaderboard(courseId)
            setLeaderboardData(response)
        }
        fetchCourseAnalytics()
    }, [searchParams])

    console.log(leaderboardData)



    const loginuserRank = leaderboardData?.find(student => student.student.id === authUser.id)

    console.log(loginuserRank)




    const tabs = [
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "assignments", label: "Assignments", icon: BarChart3 },


    ]

    const handleBack = () => {
        router.push('/dashboard')
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
                        {course?.title || "Course"} Analytics
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
                                : "text-white hover:text-gray-900 hover:bg-gray-100"
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
                            userRank={loginuserRank?.rank}
                            averageScore={loginuserRank?.averageMarks}
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
                        <AssignmentsChart courseId={course?.id} />
                    </motion.div>
                )}




            </div>
        </div>
    )
}
