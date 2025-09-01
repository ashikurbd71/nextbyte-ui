"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { TrendingUp, Users, BookOpen, Award, Clock } from "lucide-react"
import { getDashboardStatistics } from "@/app/apis/statistics-apis/statisticsApis"

export function StatsSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const data = await getDashboardStatistics()
                setStats(data)
            } catch (err) {
                console.error('Error fetching statistics:', err)
                setError(err.message)

            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    // Default stats for fallback
    const defaultStats = {
        activeStudents: "50K+",
        expertCourses: "200+",
        successRate: "95%",
        support: "24/7"
    }

    // Use API data if available, otherwise use default stats
    const displayStats = Object.keys(stats).length > 0 ? stats : defaultStats

    return (
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-float"></div>
                <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
                        Trusted by <span className="gradient-text">Thousands</span> of Students
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
                        Our platform has helped students achieve their tech career goals
                    </p>
                </motion.div>

                {/* Loading state */}
                {loading && (
                    <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="inline-flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-600">Loading statistics...</span>
                        </div>
                    </motion.div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <motion.div
                        className="text-center py-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <span className="text-red-600 text-sm">⚠️ Using default statistics (API unavailable)</span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    ref={ref}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Active Students Card */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-gray-200/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="text-white">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                    {stats.users?.totalStudents}
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 font-medium">
                                    Active Students
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
                        </div>
                        <motion.div
                            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>

                    {/* Expert Courses Card */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="text-white">
                                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    {stats?.courses?.totalActive}
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 font-medium">
                                    Expert Courses
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
                        </div>
                        <motion.div
                            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>

                    {/* Success Rate Card */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="text-white">
                                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                                    95%
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 font-medium">
                                    Success Rate
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
                        </div>
                        <motion.div
                            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>

                    {/* Support Card */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className="relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-gray-200/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <div className="text-white">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                    24/7
                                </div>
                                <div className="text-sm sm:text-base text-gray-600 font-medium">
                                    Support
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl"></div>
                        </div>
                        <motion.div
                            className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-8 sm:mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full border border-green-200">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="text-xs sm:text-sm font-medium text-green-700">
                            Growing rapidly - Join the community today!
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
