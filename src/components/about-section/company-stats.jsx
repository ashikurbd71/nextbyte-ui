"use client"

import { motion } from "framer-motion"
import { Users, Star, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { getDashboardStatistics } from "@/app/apis/statistics-apis/statisticsApis"

export function CompanyStats() {
    const [stats, setStats] = useState([])

    useEffect(() => {
        const fetchStats = async () => {
            const response = await getDashboardStatistics()
            setStats(response)
        }
        fetchStats()
    }, [])

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
        >
            {/* First Card - Students */}
            <motion.div
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200/50 hover-lift transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stats?.users?.totalStudents || "1,000+"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Active Students</p>
            </motion.div>

            {/* Second Card - Courses */}
            <motion.div
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200/50 hover-lift transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stats?.courses?.totalActive || "50+"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Expert Courses</p>
            </motion.div>

            {/* Third Card - Certificates */}
            <motion.div
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200/50 hover-lift transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {stats?.certificates?.totalIssued || "500+"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Certificates Issued</p>
            </motion.div>
        </motion.div>
    )
}
