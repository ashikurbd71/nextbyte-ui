"use client"

import { motion } from "framer-motion"
import { Star, Award, Video } from "lucide-react"
import Image from "next/image"
import { getAllInstructors } from "@/lib/utils"

export default function InstructorTab({ courseData }) {
    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    // Helper function to validate image URL
    const isValidImageUrl = (url) => {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    // Debug: Log the course data to see what's available
    console.log("Course Data:", courseData)
    console.log("Instructor data:", courseData?.instructor)
    console.log("Instructors data:", courseData?.instructors)

    // Try different possible property names for instructor data
    const getInstructorData = () => {
        // Try different possible property names
        const possibleNames = ['instructor', 'instructors', 'teacher', 'teachers', 'author', 'authors']

        for (const name of possibleNames) {
            if (courseData && courseData[name]) {
                console.log(`Found instructor data under property: ${name}`, courseData[name])
                return courseData[name]
            }
        }

        // If no instructor data found, return null
        console.log("No instructor data found in courseData")
        return null
    }

    const instructorData = getInstructorData()
    const instructors = getAllInstructors(instructorData)

    console.log("Processed instructors:", instructors)

    if (!instructors || instructors.length === 0) {
        return (
            <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="text-center text-gray-300 py-8"
            >
                <p>Instructor information not available</p>
                <p className="text-sm mt-2">Debug: No instructor data found in courseData</p>
                <p className="text-xs mt-1">Available properties: {courseData ? Object.keys(courseData).join(', ') : 'No courseData'}</p>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-1">
                    {instructors.length === 1 ? 'Course Instructor' : 'Course Instructors'}
                </h3>
                <p className="text-gray-300 text-sm">
                    Learn from our expert instructors
                </p>
            </div>

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 gap-4">
                {instructors.map((instructor, index) => (
                    <motion.div
                        key={instructor.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                        style={{ maxHeight: '160px' }}
                    >
                        <div className="flex items-center space-x-4">
                            {/* Instructor Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500">
                                    {instructor.photoUrl && isValidImageUrl(instructor.photoUrl) ? (
                                        <Image
                                            src={instructor.photoUrl}
                                            alt={instructor.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none'
                                                e.target.nextSibling.style.display = 'flex'
                                            }}
                                        />
                                    ) : null}
                                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold" style={{ display: instructor.photoUrl && isValidImageUrl(instructor.photoUrl) ? 'none' : 'flex' }}>
                                        {instructor.name.charAt(0)}
                                    </div>
                                </div>
                            </div>

                            {/* Instructor Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-white mb-1 truncate">
                                    {instructor.name}
                                </h4>
                                <p className="text-purple-400 text-sm mb-2">
                                    {instructor.designation}
                                </p>

                                {/* Quick Stats */}
                                <div className="flex items-center space-x-4 text-xs text-gray-300">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 text-yellow-400" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Award className="w-3 h-3 text-purple-400" />
                                        <span>{instructor.experience} years</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Video className="w-3 h-3 text-blue-400" />
                                        <span>{courseData.totalJoin || 0}+ students</span>
                                    </div>
                                </div>

                                {/* Short Bio */}
                                <p className="text-gray-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                                    {instructor.bio}
                                </p>
                            </div>

                            {/* Social Links */}
                            {(instructor.fbLink || instructor.linkedinLink || instructor.instaLink) && (
                                <div className="flex-shrink-0 flex flex-col gap-2">
                                    {instructor.fbLink && (
                                        <a
                                            href={instructor.fbLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                    )}
                                    {instructor.linkedinLink && (
                                        <a
                                            href={instructor.linkedinLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-6 h-6 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                    )}
                                    {instructor.instaLink && (
                                        <a
                                            href={instructor.instaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
