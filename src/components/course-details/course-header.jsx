"use client"

import { motion } from "framer-motion"
import { Star, Users, Clock } from "lucide-react"

export default function CourseHeader({ courseData, averageRating }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
        >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                {courseData.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-3 sm:mb-4 lg:mb-6 max-w-4xl leading-relaxed">
                Master the fundamentals and advanced concepts of {courseData.name}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 text-white/80 text-xs sm:text-sm lg:text-base">
                <div className="flex items-center space-x-1 lg:space-x-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="hidden sm:inline">({courseData.reviews?.length || 0} reviews)</span>
                    <span className="sm:hidden">({courseData.reviews?.length || 0})</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">{courseData.totalJoin || 0} students enrolled</span>
                    <span className="sm:hidden">{courseData.totalJoin || 0} students</span>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">{courseData.duration}</span>
                    <span className="sm:hidden">{courseData.duration}</span>
                </div>
            </div>
        </motion.div>
    )
}
