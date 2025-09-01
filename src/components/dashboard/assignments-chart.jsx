"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Award, Clock, CheckCircle, Loader2, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentUserAssignmentMarks } from "@/app/apis/enrollment-apis/enrollmentApis"

/**
 * AssignmentsChart Component
 * 
 * Displays assignment performance data for a specific course with charts and detailed breakdowns.
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.courseId - The ID of the course to fetch assignment data for
 * 
 * @example
 * // Basic usage
 * <AssignmentsChart courseId="2" />
 * 
 * @example
 * // With dynamic course ID
 * <AssignmentsChart courseId={course.id} />
 * 
 * Features:
 * - Fetches real assignment data from API endpoint: /enrollments/course/{courseId}/student/{userId}/assignment-marks
 * - Displays summary statistics (average score, completed assignments, best score)
 * - Interactive bar chart showing assignment performance
 * - Detailed assignment cards with progress bars
 * - Loading and error states
 * - Responsive design with glassmorphism styling
 * - Motion animations for smooth user experience
 * - Mobile-first responsive design with responsive text
 */
export default function AssignmentsChart({ courseId }) {
    const [assignmentData, setAssignmentData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAssignmentData = async () => {
            if (!courseId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)
                const data = await getCurrentUserAssignmentMarks(courseId)
                console.log('Assignment data:', data)
                setAssignmentData(data)
            } catch (error) {
                console.error('Error fetching assignment data:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAssignmentData()
    }, [courseId])

    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-500"
        if (score >= 80) return "text-blue-500"
        if (score >= 70) return "text-yellow-500"
        return "text-red-500"
    }

    const getScoreBgColor = (score) => {
        if (score >= 90) return "bg-green-500/20"
        if (score >= 80) return "bg-blue-500/20"
        if (score >= 70) return "bg-yellow-500/20"
        return "bg-red-500/20"
    }

    const getScoreGradient = (score) => {
        if (score >= 90) return "from-green-500 to-emerald-500"
        if (score >= 80) return "from-blue-500 to-purple-500"
        if (score >= 70) return "from-yellow-500 to-orange-500"
        return "from-red-500 to-pink-500"
    }

    const getStatusIcon = (score) => {
        if (score >= 90) return Award
        if (score >= 80) return TrendingUp
        if (score >= 70) return CheckCircle
        return Clock
    }

    // Transform API data to chart format
    const transformDataForChart = (data) => {
        if (!data?.assignmentMarks) return []

        return data.assignmentMarks.map((assignment, index) => ({
            name: `Assignment ${index + 1}: ${assignment.assignmentTitle}`,
            score: assignment.marks,
            maxScore: assignment.totalMarks,
            percentage: assignment.percentage,
            submittedAt: new Date(assignment.submittedAt).toLocaleDateString(),
            assignmentId: assignment.assignmentId,
            serialNumber: index + 1,
            key: `${assignment.assignmentId}-${index}`
        }))
    }

    // Get summary data from API response
    const getSummaryData = (data) => {
        if (!data?.summary) return {
            averageScore: 0,
            completedAssignments: 0,
            totalAssignments: 0,
            highestMarks: 0,
            lowestMarks: 0
        }

        return {
            averageScore: data.summary.averagePercentage,
            completedAssignments: data.summary.totalAssignments,
            totalAssignments: data.summary.totalAssignments,
            highestMarks: data.summary.highestMarks,
            lowestMarks: data.summary.lowestMarks
        }
    }

    const chartData = transformDataForChart(assignmentData)
    const summary = getSummaryData(assignmentData)

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 sm:space-y-6"
            >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {[1, 2, 3, 4].map((item) => (
                        <Card key={`skeleton-${item}`} className="bg-white/10 backdrop-blur-xl border-white/20">
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg animate-pulse" />
                                    <div className="space-y-1 sm:space-y-2 flex-1">
                                        <div className="h-3 sm:h-4 bg-white/20 rounded animate-pulse" />
                                        <div className="h-4 sm:h-6 bg-white/30 rounded animate-pulse w-12 sm:w-16" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-center h-60 sm:h-80">
                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
            >
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-semibold text-base sm:text-lg">Error Loading Assignments</h3>
                                <p className="text-white/70 text-xs sm:text-sm max-w-md px-4">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
        >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white/70 text-xs sm:text-sm">Average Score</p>
                                <p className="text-lg sm:text-xl font-bold text-white">{summary.averageScore}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white/70 text-xs sm:text-sm">Completed</p>
                                <p className="text-lg sm:text-xl font-bold text-white">{summary.completedAssignments}/{summary.totalAssignments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white/70 text-xs sm:text-sm">Best Score</p>
                                <p className="text-lg sm:text-xl font-bold text-white">{summary.highestMarks}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-white/70 text-xs sm:text-sm">Total Assignments</p>
                                <p className="text-lg sm:text-xl font-bold text-white">{summary.totalAssignments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-white text-lg sm:text-xl font-semibold">Assignment Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="h-60 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        fontSize={10}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        fontSize={10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value, name, props) => [`${value}%`, 'Score']}
                                        labelFormatter={(label) => label}
                                    />
                                    <Bar
                                        dataKey="percentage"
                                        fill="url(#colorGradient)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Assignment Details */}
            {chartData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {chartData.map((assignment, index) => {
                        const StatusIcon = getStatusIcon(assignment.percentage)
                        return (
                            <motion.div
                                key={assignment.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center shadow-lg flex-shrink-0">
                                                #{assignment.serialNumber}
                                            </span>
                                            <h4 className="font-semibold text-sm sm:text-lg text-white truncate">{assignment.name}</h4>
                                        </div>
                                        <p className="text-white/70 text-xs sm:text-sm">Submitted: {assignment.submittedAt}</p>
                                    </div>
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${getScoreGradient(assignment.percentage)} rounded-lg flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0`}>
                                        <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-xs sm:text-sm">Score</span>
                                        <span className={`font-bold text-base sm:text-lg ${getScoreColor(assignment.percentage)}`}>
                                            {assignment.score}/{assignment.maxScore}
                                        </span>
                                    </div>

                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className={`bg-gradient-to-r ${getScoreGradient(assignment.percentage)} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${assignment.percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-white/60">
                                        <span>0%</span>
                                        <span>{assignment.percentage}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8 sm:py-12"
                >
                    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold text-base sm:text-lg">No Assignments Available</h3>
                                    <p className="text-white/70 text-xs sm:text-sm max-w-md px-4">
                                        You don't have any assignments to display yet. Check back later for new assignments!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
}

