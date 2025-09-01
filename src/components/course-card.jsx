"use client"

import { Star, Clock, Users, ArrowRight, User, Tag, Award, Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getInstructorName, getInstructorDesignation } from "@/lib/utils"

export function CourseCard({ course, index }) {
    const router = useRouter()

    const handleViewDetails = () => {
        const params = new URLSearchParams({
            id: course.id,
            title: course.name,
            slug: course.slugName,
        })
        router.push(`/course-details?${params.toString()}`)
    }

    // Calculate average rating from reviews
    const averageRating = course.reviews && course.reviews.length > 0
        ? (course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length).toFixed(1)
        : "0.0"

    // Calculate availability percentage
    const availabilityPercentage = course.totalSeat > 0
        ? Math.round(((course.totalSeat - course.totalJoin) / course.totalSeat) * 100)
        : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group cursor-pointer"
        >
            <Card className="relative h-full overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white/80 backdrop-blur-sm border border-gray-200/30 hover:border-purple-300/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 rounded-2xl">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating particles */}
                <motion.div
                    className="absolute top-3 left-3 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-60"
                    animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60"
                    animate={{ y: [0, 8, 0], x: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 blur-xl"></div>

                <CardHeader className="relative z-10 p-3 sm:p-4">
                    {/* Course image with enhanced styling */}
                    <div className="relative mb-3 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                        <Image
                            src={course.thumbnail || '/courseimage.jpg'}
                            alt={course.name || 'Course image'}
                            height={150}
                            width={500}
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Animated glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>

                        {/* Enhanced Price badge with glass effect */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-2xl border border-white/50 group-hover:bg-white/95 transition-all duration-300">
                            <div className="flex flex-col items-end gap-0.5">
                                {course.discountPrice && course.discountPrice !== course.price ? (
                                    <>
                                        <span className="text-xs line-through text-gray-400 decoration-red-400 decoration-2">৳{course.price}</span>
                                        <span className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">৳{course.discountPrice}</span>
                                    </>
                                ) : (
                                    <span className="text-base font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">৳{course.price}</span>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Discount percentage badge */}
                        {course.discountPrice && course.discountPrice !== course.price && (
                            <motion.div
                                className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl px-2 py-1 shadow-2xl font-bold text-xs"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
                                </div>
                            </motion.div>
                        )}

                        {/* Premium badge for featured courses */}
                        {course.isFeatured && (
                            <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg px-2 py-1 shadow-lg font-bold text-xs">
                                <div className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    FEATURED
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced title with gradient effect */}
                    <CardTitle className="text-lg sm:text-xl text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-500 font-bold mb-2">
                        {course.name}
                    </CardTitle>

                    {/* Enhanced instructor info */}
                    {course.instructor && (
                        <motion.div
                            className="flex items-center gap-2 mb-2 p-2 bg-gray-50/50 rounded-lg group-hover:bg-purple-50/50 transition-all duration-300"
                            whileHover={{ x: 5 }}
                        >
                            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-700">
                                    {getInstructorName(course.instructor)}
                                </span>
                                {getInstructorDesignation(course.instructor) && (
                                    <span className="text-xs text-gray-500">
                                        {getInstructorDesignation(course.instructor)}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )}
                </CardHeader>

                <CardContent className="relative z-10 p-3 sm:p-4">
                    {/* Enhanced course stats with better styling */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-gradient-to-r from-gray-50/50 to-purple-50/30 rounded-lg group-hover:from-purple-50/50 group-hover:to-blue-50/30 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Star className="h-3 w-3 text-white fill-current" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">{averageRating}</span>
                                <span className="text-xs text-gray-500">({course.reviews?.length || 0} reviews)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Clock className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{course.duration}</span>
                        </div>
                    </div>

                    {/* Enhanced course info with icons */}
                    <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50/30 rounded-lg group-hover:bg-purple-50/30 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <Users className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{course.totalJoin} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${availabilityPercentage > 50 ? 'bg-green-500' :
                                availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                } animate-pulse`}></div>
                            <span className="text-sm font-medium text-gray-700">{availabilityPercentage}% available</span>
                        </div>
                    </div>

                    {/* Enhanced technologies section */}
                    {course.technologies && course.technologies.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-gradient-to-r from-blue-50/50 to-purple-50/30 rounded-lg group-hover:from-purple-50/50 group-hover:to-blue-50/30 transition-all duration-300">
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <Tag className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {course.technologies.slice(0, 3).map((tech, idx) => (
                                    <span key={idx} className="text-xs bg-white/80 text-gray-700 px-2 py-1 rounded-full border border-gray-200 font-medium">
                                        {tech.name}
                                    </span>
                                ))}
                                {course.technologies.length > 3 && (
                                    <span className="text-xs text-gray-500 font-medium">+{course.technologies.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Enhanced button with better animations */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:from-purple-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-2.5 sm:py-3 text-sm sm:text-base group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 rounded-xl"
                            onClick={handleViewDetails}
                        >
                            <span>View Details</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </motion.div>

                    {/* Enhanced floating elements */}
                    <motion.div
                        className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-80"
                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-80"
                        animate={{ y: [0, 6, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </CardContent>

                {/* Enhanced corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
        </motion.div>
    )
}
