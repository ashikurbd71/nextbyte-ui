"use client"

import { motion } from "framer-motion"
import { CourseCard } from "./course-card"
import { Sparkles, BookOpen, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { getAllCourses } from "@/app/apis/course-apis/courseApis"

export function OurPopuralCourse() {

    const [courses, setCourses] = useState([])

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await getAllCourses()
            console.log('Course data:', response?.data) // Add this line to debug
            // Filter courses where isFeatured is true
            const featuredCourses = response?.data?.filter(course =>
                course.isFeatured === true &&
                course.isActive === true &&
                course.isPublished === true
            ) || []
            setCourses(featuredCourses)
        }
        fetchCourses()
    }, [])



    return (
        <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
                <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating icons */}
            <motion.div
                className="absolute top-16 sm:top-32 left-10 sm:left-20 text-blue-500 opacity-30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>
            <motion.div
                className="absolute bottom-16 sm:bottom-32 right-16 sm:right-32 text-purple-500 opacity-30"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>

            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 sm:mb-6 border border-blue-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-700">
                            Our Popular Courses
                        </span>
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
                        Our <span className="gradient-text">Popular Courses</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
                        Choose from our comprehensive selection of tech courses designed by industry experts.
                        Start your journey to becoming a tech professional today.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {courses?.map((course, index) => (
                        <CourseCard key={course.id || course.title || index} course={course} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-8 sm:mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-700">
                            Explore 200+ more courses in our catalog
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
