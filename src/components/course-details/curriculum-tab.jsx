"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, ChevronRight, FileText, ChevronDown, Video, Lock } from "lucide-react"
import { YouTubePlayer, extractYouTubeVideoId } from "@/components/ui/youtube-player"

export default function CurriculumTab({ courseData, totalLessons }) {
    const [expandedModules, setExpandedModules] = useState(() => new Set())
    const [expandedLessons, setExpandedLessons] = useState(() => new Set())

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    const toggleModule = (moduleId) => {
        const newExpanded = new Set(expandedModules)
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId)
        } else {
            newExpanded.add(moduleId)
        }
        setExpandedModules(newExpanded)
    }

    const toggleLesson = (lessonId) => {
        const newExpanded = new Set(expandedLessons)
        if (newExpanded.has(lessonId)) {
            newExpanded.delete(lessonId)
        } else {
            newExpanded.add(lessonId)
        }
        setExpandedLessons(newExpanded)
    }

    return (
        <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="space-y-3 sm:space-y-4"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Course Curriculum</h3>
                <div className="text-gray-300 text-xs sm:text-sm lg:text-base">
                    <span className="font-semibold">{totalLessons} lessons</span> • {courseData.duration}
                </div>
            </div>

            {courseData.modules && courseData.modules.length > 0 ? (
                courseData.modules
                    .sort((a, b) => {
                        // Sort modules by order field if it exists, otherwise maintain original order
                        const orderA = a.order !== undefined ? a.order : 0
                        const orderB = b.order !== undefined ? b.order : 0
                        return orderA - orderB
                    })
                    .map((module, index) => {
                        const isExpanded = expandedModules.has(module.id)
                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-white/20 rounded-lg overflow-hidden"
                            >
                                <div
                                    className="bg-white/10 p-3 sm:p-4 lg:p-4 cursor-pointer hover:bg-white/20 transition-colors"
                                    onClick={() => toggleModule(module.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-white font-semibold text-xs sm:text-sm lg:text-base">
                                                {module.title}
                                            </h4>
                                            <p className="text-gray-300 text-xs sm:text-xs lg:text-sm">
                                                {module.lessons?.length || 0} lessons • {module.duration}
                                            </p>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-white flex-shrink-0 ml-2"
                                        >
                                            {isExpanded ? (
                                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                            ) : (
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && module.lessons && module.lessons.length > 0 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="bg-white/5 overflow-hidden"
                                        >
                                            <div className="p-3 sm:p-4 lg:p-4">
                                                <ul className="space-y-1 sm:space-y-2">
                                                    {module.lessons
                                                        .sort((a, b) => {
                                                            // Sort lessons by order field if it exists, otherwise maintain original order
                                                            const orderA = a.order !== undefined ? a.order : 0
                                                            const orderB = b.order !== undefined ? b.order : 0
                                                            return orderA - orderB
                                                        })
                                                        .map((lesson, lessonIndex) => {
                                                            const isLessonExpanded = expandedLessons.has(lesson.id)
                                                            const videoId = lesson.videoUrl ? extractYouTubeVideoId(lesson.videoUrl) : null
                                                            const isFirstModule = index === 0 // Check if this is the first module
                                                            const isLocked = !isFirstModule // Lock all lessons except in first module

                                                            return (
                                                                <motion.li
                                                                    key={lesson.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: lessonIndex * 0.05 }}
                                                                    className={`border border-white/10 rounded-lg overflow-hidden ${isLocked ? 'opacity-60' : ''}`}
                                                                >
                                                                    {/* Lesson Header - Clickable only if not locked */}
                                                                    <div
                                                                        className={`flex items-center space-x-2 lg:space-x-3 text-gray-300 p-2 sm:p-3 transition-colors ${isLocked
                                                                            ? 'cursor-not-allowed'
                                                                            : 'cursor-pointer hover:bg-white/10'
                                                                            }`}
                                                                        onClick={() => !isLocked && toggleLesson(lesson.id)}
                                                                    >
                                                                        {isLocked ? (
                                                                            <Lock className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gray-500 flex-shrink-0" />
                                                                        ) : (
                                                                            <Video className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-purple-400 flex-shrink-0" />
                                                                        )}
                                                                        <span className={`text-xs sm:text-sm lg:text-base flex-1 ${isLocked ? 'text-gray-500' : ''}`}>
                                                                            {lesson.title}
                                                                        </span>
                                                                        {lesson.isPreview && !isLocked && (
                                                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                                                Preview
                                                                            </span>
                                                                        )}
                                                                        {isLocked && (
                                                                            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                                                                                Locked
                                                                            </span>
                                                                        )}
                                                                        {!isLocked && (
                                                                            <motion.div
                                                                                animate={{ rotate: isLessonExpanded ? 90 : 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="text-white flex-shrink-0 ml-2"
                                                                            >
                                                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                                                            </motion.div>
                                                                        )}
                                                                    </div>

                                                                    {/* Collapsible Video Content - Only for unlocked lessons */}
                                                                    <AnimatePresence>
                                                                        {!isLocked && isLessonExpanded && videoId && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                                className="bg-white/5 overflow-hidden"
                                                                            >
                                                                                <div className="p-2 sm:p-3">
                                                                                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                                                                        <YouTubePlayer
                                                                                            videoId={videoId}
                                                                                            className="w-full h-full"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.li>
                                                            )
                                                        })}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })
            ) : (
                <div className="text-center text-gray-300 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-white/30" />
                    <p>No curriculum available yet</p>
                </div>
            )}
        </motion.div>
    )
}
