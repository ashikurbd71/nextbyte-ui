"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, ChevronRight, FileText, ChevronDown, Eye, X } from "lucide-react"
import { YouTubePlayer, extractYouTubeVideoId } from "@/components/ui/youtube-player"

export default function CurriculumTab({ courseData, totalLessons }) {
    const [expandedModules, setExpandedModules] = useState(() => new Set())
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [showVideoModal, setShowVideoModal] = useState(false)

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

    const handlePlayVideo = (lesson) => {
        if (lesson.videoUrl) {
            setSelectedVideo(lesson)
            setShowVideoModal(true)
        }
    }

    const closeVideoModal = () => {
        setShowVideoModal(false)
        setSelectedVideo(null)
    }

    const isFirstModule = (moduleIndex) => {
        return moduleIndex === 0
    }

    const getVideoId = (videoUrl) => {
        if (!videoUrl) return null
        return extractYouTubeVideoId(videoUrl)
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
                courseData.modules.map((module, index) => {
                    const isExpanded = expandedModules.has(module.id)
                    const isFirst = isFirstModule(index)
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
                                            {isFirst && (
                                                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                    Free Preview
                                                </span>
                                            )}
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
                                                {module.lessons.map((lesson, lessonIndex) => {
                                                    const hasVideo = lesson.videoUrl && lesson.videoUrl.trim() !== ''
                                                    const canPlay = isFirst && hasVideo

                                                    return (
                                                        <motion.li
                                                            key={lesson.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: lessonIndex * 0.05 }}
                                                            className={`flex items-center justify-between space-x-2 lg:space-x-3 text-gray-300 ${canPlay ? 'hover:bg-white/5 p-2 rounded cursor-pointer' : ''}`}
                                                            onClick={canPlay ? () => handlePlayVideo(lesson) : undefined}
                                                        >
                                                            <div className="flex items-center space-x-2 lg:space-x-3 flex-1">
                                                                {canPlay ? (
                                                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />
                                                                ) : (
                                                                    <Play className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-purple-400 flex-shrink-0" />
                                                                )}
                                                                <span className="text-xs sm:text-sm lg:text-base">{lesson.title}</span>
                                                                {lesson.isPreview && (
                                                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                                        Preview
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {canPlay && (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                                                        Play
                                                                    </span>
                                                                    <Eye className="w-3 h-3 text-green-400" />
                                                                </div>
                                                            )}
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

            {/* Video Modal */}
            {showVideoModal && selectedVideo && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/20">
                            <h3 className="text-lg font-semibold text-white">
                                {selectedVideo.title}
                            </h3>
                            <button
                                onClick={closeVideoModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="relative aspect-video bg-black">
                            {getVideoId(selectedVideo.videoUrl) ? (
                                <YouTubePlayer
                                    videoId={getVideoId(selectedVideo.videoUrl)}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-white">
                                        <Play className="w-12 h-12 mx-auto mb-4 text-white/60" />
                                        <p className="text-white/60">Video not available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/20">
                            <p className="text-sm text-gray-300">
                                This is a preview video from the first module. Enroll in the course to access all videos and content.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}
