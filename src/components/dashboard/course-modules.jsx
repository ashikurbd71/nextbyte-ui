"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AssignmentSubmissionReview } from "./assignment-submission-review"
import { updateEnrollmentProgress } from "@/app/apis/enrollment-apis/enrollmentApis"
import { generateCertificate } from "@/app/apis/certificate-apis/certificateApis"
import { toast } from 'sonner'
import {
    Lock,
    Unlock,
    FileText,
    CheckCircle,
    Circle,
    ChevronUp,
    ChevronDown,
    Github,
    Globe,
    Clock,
    Eye,
    Play,
    Download,
    File,
    RefreshCw
} from "lucide-react"

export function CourseModules({
    modules,
    currentModuleIndex,
    currentLessonIndex,
    completedLessons,
    submittedAssignments,
    assignmentSubmissions,
    setCurrentModuleIndex,
    setCurrentLessonIndex,
    handleModuleAndLessonSelect,
    handleLessonComplete,
    handleAssignmentSubmit,
    updateAssignmentSubmission,
    handleAssignmentResubmit,
    fetchLatestSubmission,
    getModuleProgress,
    isModuleUnlocked,
    isLessonUnlocked,
    isAssignmentUnlocked,
    formatDuration,
    videoProgress,
    getLastWatchedPosition,
    formatTime,
    isSubmittingAssignment,
    isResubmittingAssignment,
    submissionErrors,
    submissionSuccess,
    enrollmentId,
    totalModules // Add this prop
}) {
    const [expandedModules, setExpandedModules] = useState(() => new Set())
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
    const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false)
    const [progressMilestones, setProgressMilestones] = useState(() => new Set())
    const [moduleProgressHistory, setModuleProgressHistory] = useState({})

    const toggleModuleExpansion = (moduleIndex) => {
        const newExpanded = new Set(expandedModules)
        if (newExpanded.has(moduleIndex)) {
            newExpanded.delete(moduleIndex)
        } else {
            newExpanded.add(moduleIndex)
        }
        setExpandedModules(newExpanded)
    }

    // Helper function to determine lesson content type
    const getLessonContentType = (lesson) => {
        if (lesson?.videoUrl && lesson.videoUrl.trim() !== '') {
            return 'video'
        } else if (lesson?.fileUrl && lesson.fileUrl.trim() !== '') {
            return 'file'
        } else if (lesson?.text && lesson.text.trim() !== '') {
            return 'text'
        }
        return 'none'
    }

    // Helper function to get lesson icon based on content type
    const getLessonIcon = (lesson, isCompleted, hasProgress, lessonUnlocked) => {
        const contentType = getLessonContentType(lesson)

        if (isCompleted) {
            return <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
        } else if (hasProgress) {
            return <Clock className="w-3 h-3 text-yellow-400 flex-shrink-0" />
        } else if (lessonUnlocked) {
            switch (contentType) {
                case 'video':
                    return <Play className="w-3 h-3 text-blue-400 flex-shrink-0" />
                case 'file':
                    return <Download className="w-3 h-3 text-purple-400 flex-shrink-0" />
                case 'text':
                    return <FileText className="w-3 h-3 text-green-400 flex-shrink-0" />
                default:
                    return <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
            }
        } else {
            return <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
        }
    }

    // Helper function to get lesson content indicator
    const getLessonContentIndicator = (lesson) => {
        const contentType = getLessonContentType(lesson)
        switch (contentType) {
            case 'video':
                return <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Video</span>
            case 'file':
                return <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded">File</span>
            case 'text':
                return <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Text</span>
            default:
                return <span className="text-xs text-gray-400 bg-gray-400/10 px-2 py-1 rounded">No Content</span>
        }
    }

    // Calculate overall course progress based on completed modules
    const calculateOverallProgress = () => {
        if (!modules || modules.length === 0 || !totalModules) return 0

        let completedModules = 0
        // totalModules comes from course entity

        modules.forEach((module) => {
            const moduleProgress = getModuleProgress(module)
            // A module is considered completed when it reaches 100%
            if (moduleProgress === 100) {
                completedModules++
            }
        })

        // Progress is calculated as (completed modules / total modules from course) * 100
        // This gives proportional progress based on course structure
        // Example: 5 total modules = 20% per module, 10 total modules = 10% per module
        return Math.round((completedModules / totalModules) * 100)
    }

    // Calculate detailed progress for a module
    const calculateDetailedProgress = (module) => {
        const moduleAssignments = module?.assignments || []
        const completedAssignments = moduleAssignments.filter(assignment =>
            submittedAssignments.has(assignment.id)
        ).length
        const allAssignmentsComplete = moduleAssignments.length === 0 || completedAssignments === moduleAssignments.length

        const moduleLessons = module?.lessons || []
        const allLessonsComplete = moduleLessons.every(lesson =>
            completedLessons?.has(lesson.id)
        )

        const lessonProgress = moduleLessons.reduce((sum, lesson) => {
            const lessonProgress = videoProgress?.[lesson.id]
            if (lessonProgress && lessonProgress.duration > 0) {
                return sum + Math.round((lessonProgress.currentTime / lessonProgress.duration) * 100)
            }
            return sum
        }, 0)

        const lessonPercentage = moduleLessons.length > 0 ? Math.round(lessonProgress / moduleLessons.length) : 0

        return {
            lesson: lessonPercentage,
            assignment: allAssignmentsComplete ? 100 : Math.round((completedAssignments / moduleAssignments.length) * 100)
        }
    }

    // Handle certificate generation
    const handleGenerateCertificate = async () => {
        if (!enrollmentId) {
            console.error('No enrollment ID available')
            toast.error('No enrollment ID available')
            return
        }

        try {
            setIsGeneratingCertificate(true)
            const result = await generateCertificate(enrollmentId)
            console.log('Certificate generated successfully:', result)
            toast.success('🎉 Certificate generated successfully! You can now download your certificate.')
        } catch (error) {
            console.error('Error generating certificate:', error)
            const errorMessage = error?.message || 'Failed to generate certificate'

            // Handle specific error for existing certificate
            if (errorMessage.includes('Certificate already exists') ||
                (error.statusCode === 400 && error.error === 'Bad Request')) {
                toast.error('📜 Certificate already exists for this enrollment! You can download it from your profile.')
            } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                toast.error('Unable to connect to the server. Please check your internet connection and try again.')
            } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                toast.error('Your session has expired. Please log in again.')
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                toast.error('Course information not found. Please refresh the page.')
            } else {
                toast.error('Unable to generate certificate. Please try again later.')
            }
        } finally {
            setIsGeneratingCertificate(false)
        }
    }

    // Function to trigger manual progress update for a specific module
    const triggerProgressUpdate = async (moduleIndex, updateType) => {
        if (!enrollmentId) {
            toast.error('No enrollment ID available for progress update.')
            return
        }

        const module = modules[moduleIndex]
        if (!module) {
            toast.error('Module not found.')
            return
        }

        let progressToUpdate = 0
        let message = ''

        if (updateType === 'video') {
            const lesson = module.lessons.find(l => l.isActive === true)
            if (lesson) {
                const lastWatchedPosition = getLastWatchedPosition(lesson.id)
                if (lastWatchedPosition) {
                    progressToUpdate = Math.round((lastWatchedPosition / lesson.duration) * 100)
                    message = `Video progress updated to ${progressToUpdate}% for lesson "${lesson.title}"`
                } else {
                    toast.info('No video progress found for this lesson.')
                    return
                }
            } else {
                toast.info('No active lesson found in this module.')
                return
            }
        } else if (updateType === 'assignment') {
            const assignment = module.assignments.find(a => !submittedAssignments.has(a.id))
            if (assignment) {
                progressToUpdate = 100 // Assuming 100% for completed assignments
                message = `Assignment progress updated to 100% for "${assignment.title}"`
            } else {
                toast.info('No unsubmitted assignments found in this module.')
                return
            }
        } else if (updateType === 'lesson') {
            const lesson = module.lessons.find(l => !completedLessons.has(l.id))
            if (lesson) {
                progressToUpdate = 100 // Assuming 100% for completed lessons
                message = `Lesson progress updated to 100% for "${lesson.title}"`
            } else {
                toast.info('No uncompleted lessons found in this module.')
                return
            }
        } else if (updateType === 'manual') {
            toast.info('Manual progress update triggered.')
            return
        }

        try {
            setIsUpdatingProgress(true)
            const progressData = {
                progress: progressToUpdate,
                completedModules: 0, // This will be calculated by the backend
                totalModules: totalModules,
                completedAssignments: 0, // This will be calculated by the backend
                totalAssignments: 0, // This will be calculated by the backend
                assignmentProgress: 0, // This will be calculated by the backend
                modulesWithMilestones: [], // This will be calculated by the backend
                lastUpdated: new Date().toISOString()
            }

            await updateEnrollmentProgress(enrollmentId, progressData)
            console.log('Progress updated successfully:', progressData)
            toast.success(message)
        } catch (error) {
            console.error('Error updating enrollment progress:', error)
            const errorMessage = error?.message || 'Failed to update progress'

            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                toast.error('Unable to connect to the server. Please check your internet connection and try again.')
            } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                toast.error('Your session has expired. Please log in again.')
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                toast.error('Course information not found. Please refresh the page.')
            } else {
                toast.error('Unable to update progress. Please try again later.')
            }
        } finally {
            setIsUpdatingProgress(false)
        }
    }

    // Calculate detailed progress for a module
    // Automatic progress update when video completion and assignment progress reach thresholds
    useEffect(() => {
        const checkAndUpdateProgress = async () => {
            if (!modules || modules.length === 0) return

            let totalProgress = 0
            // Use totalModules from course entity instead of modules.length
            // let totalModules = modules.length  // Remove this line
            let completedModules = 0
            let totalAssignments = 0
            let completedAssignments = 0
            let shouldUpdateProgress = false

            // Calculate overall course progress and check for per-module 10% milestones
            modules.forEach((module, moduleIndex) => {
                const moduleProgress = getModuleProgress(module)
                totalProgress += moduleProgress

                // Check if module is completed (100% progress)
                if (moduleProgress === 100) {
                    completedModules++
                }

                // Check for video completion and assignment progress
                const moduleAssignments = module?.assignments || []
                totalAssignments += moduleAssignments.length
                const moduleCompletedAssignments = moduleAssignments.filter(assignment =>
                    submittedAssignments.has(assignment.id)
                ).length
                completedAssignments += moduleCompletedAssignments

                // Track per-module progress and trigger API update at 10% milestone
                const moduleKey = `module-${moduleIndex}`
                const previousProgress = moduleProgressHistory[moduleKey] || 0

                // Check if module has reached 10% milestone for the first time
                if (moduleProgress >= 10 && previousProgress < 10) {
                    console.log(`🎯 Module ${moduleIndex + 1} reached 10% progress milestone!`)
                    shouldUpdateProgress = true

                    // Update progress history
                    setModuleProgressHistory(prev => ({
                        ...prev,
                        [moduleKey]: moduleProgress
                    }))

                    // Show toast for milestone achievement
                    toast.success(`🎉 Module ${moduleIndex + 1} progress: ${moduleProgress}%`)
                } else if (moduleProgress > previousProgress) {
                    // Update progress history for any progress increase
                    setModuleProgressHistory(prev => ({
                        ...prev,
                        [moduleKey]: moduleProgress
                    }))
                }

                // If module has assignments and at least 10% are completed, update progress
                if (moduleAssignments.length > 0 && moduleCompletedAssignments > 0) {
                    const assignmentProgress = (moduleCompletedAssignments / moduleAssignments.length) * 100
                    if (assignmentProgress >= 10) {
                        console.log(`Module ${moduleIndex + 1} has ${assignmentProgress}% assignment progress`)
                        shouldUpdateProgress = true
                    }
                }
            })

            const overallProgress = Math.round((completedModules / totalModules) * 100)
            const assignmentProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

            // Update enrollment progress if there's significant progress or milestone reached
            if (overallProgress > 0 && shouldUpdateProgress) {
                try {
                    setIsUpdatingProgress(true)

                    // Calculate which modules have reached 10% milestone
                    const modulesWithMilestones = modules.map((module, index) => {
                        const moduleProgress = getModuleProgress(module)
                        const moduleKey = `module-${index}`
                        const previousProgress = moduleProgressHistory[moduleKey] || 0
                        return {
                            moduleIndex: index,
                            moduleTitle: module.title,
                            currentProgress: moduleProgress,
                            reached10Percent: moduleProgress >= 10 && previousProgress < 10
                        }
                    }).filter(module => module.reached10Percent)

                    const progressData = {
                        progress: overallProgress,
                        completedModules: completedModules,
                        totalModules: totalModules,
                        completedAssignments: completedAssignments,
                        totalAssignments: totalAssignments,
                        assignmentProgress: assignmentProgress,
                        modulesWithMilestones: modulesWithMilestones,
                        lastUpdated: new Date().toISOString()
                    }

                    // Update enrollment progress if enrollmentId is available
                    if (enrollmentId) {
                        await updateEnrollmentProgress(enrollmentId, progressData)
                        console.log('Progress updated successfully:', progressData)
                    } else {
                        console.log('Progress update data (no enrollmentId):', progressData)
                    }
                } catch (error) {
                    console.error('Error updating enrollment progress:', error)
                    const errorMessage = error?.message || 'Failed to update progress'

                    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                        toast.error('Unable to connect to the server. Please check your internet connection and try again.')
                    } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                        toast.error('Your session has expired. Please log in again.')
                    } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                        toast.error('Course information not found. Please refresh the page.')
                    } else {
                        toast.error('Unable to update progress. Please try again later.')
                    }
                } finally {
                    setIsUpdatingProgress(false)
                }
            }
        }

        // Check progress whenever relevant state changes
        checkAndUpdateProgress()
    }, [modules, completedLessons, submittedAssignments, getModuleProgress, enrollmentId, totalModules])

    return (
        <>
            <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border border-white/20 shadow-2xl shadow-purple-500/10">
                <div className="p-5 sm:p-7">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-400/30">
                                <FileText className="w-5 h-5 text-purple-300" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Course Modules
                            </h3>
                        </div>
                        {isUpdatingProgress && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20"
                            >
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="font-medium">Saving...</span>
                            </motion.div>
                        )}
                    </div>
                    <div className="space-y-4 sm:space-y-5">
                        {modules
                            .sort((a, b) => {
                                // Sort by order field if it exists, otherwise maintain original order
                                const orderA = a.order !== undefined ? a.order : 0
                                const orderB = b.order !== undefined ? b.order : 0
                                return orderA - orderB
                            })
                            .map((module, moduleIndex) => {
                                const moduleProgress = getModuleProgress(module)
                                const isUnlocked = isModuleUnlocked(moduleIndex)
                                const isActive = moduleIndex === currentModuleIndex
                                const isExpanded = expandedModules.has(moduleIndex)
                                const moduleAssignments = module?.assignments || []
                                const completedAssignments = moduleAssignments.filter(assignment =>
                                    submittedAssignments.has(assignment.id)
                                ).length

                                return (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: moduleIndex * 0.1 }}
                                    >
                                        <motion.div
                                            className={`group relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
                                                ? 'bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-blue-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 scale-[1.02]'
                                                : isUnlocked
                                                    ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 hover:border-white/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10'
                                                    : 'bg-gradient-to-br from-gray-800/30 via-gray-800/20 to-transparent border border-gray-700/30 opacity-60 cursor-not-allowed'
                                                }`}
                                            whileHover={isUnlocked && !isActive ? { scale: 1.01, y: -2 } : {}}
                                            whileTap={isUnlocked ? { scale: 0.99 } : {}}
                                            onClick={() => {
                                                if (isUnlocked) {
                                                    setCurrentModuleIndex(moduleIndex)
                                                } else {
                                                    toast.info('Complete the previous module to unlock this one.')
                                                }
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isUnlocked
                                                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30'
                                                        : 'bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30'
                                                        }`}>
                                                        {isUnlocked ? (
                                                            <Unlock className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <Lock className="w-5 h-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`text-base sm:text-lg font-semibold truncate ${isUnlocked ? 'text-white' : 'text-gray-400'
                                                            }`}>
                                                            {module?.title}
                                                        </h4>
                                                        {moduleIndex === 0 && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full font-medium mt-1 border border-blue-400/30">
                                                                <Play className="w-3 h-3" />
                                                                Start Here
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleModuleExpansion(moduleIndex)
                                                    }}
                                                    className="flex-shrink-0 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className="w-5 h-5" />
                                                    </motion.div>
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-purple-300" />
                                                    <span>{formatDuration(module?.duration)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Play className="w-4 h-4 text-blue-300" />
                                                    <span>{module?.lessons?.length || 0} lessons</span>
                                                </div>
                                                {moduleAssignments.length > 0 && (
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText className="w-4 h-4 text-green-300" />
                                                        <span>{completedAssignments}/{moduleAssignments.length} assignments</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Modern Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-xs font-medium text-gray-300 mb-2">
                                                    <span>Module Progress</span>
                                                    <span className={`font-bold ${moduleProgress === 100 ? 'text-green-400' : 'text-purple-400'
                                                        }`}>
                                                        {moduleProgress}%
                                                    </span>
                                                </div>
                                                <div className="relative w-full h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${moduleProgress}%` }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${moduleProgress === 100
                                                            ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-500'
                                                            : 'bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400'
                                                            } shadow-lg`}
                                                    />
                                                    {moduleProgress > 0 && moduleProgress < 100 && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Module Completion Status */}
                                            {(() => {
                                                const detailedProgress = calculateDetailedProgress(module)
                                                const moduleAssignments = module?.assignments || []
                                                const completedAssignments = moduleAssignments.filter(assignment =>
                                                    submittedAssignments.has(assignment.id)
                                                ).length
                                                const allAssignmentsComplete = moduleAssignments.length === 0 || completedAssignments === moduleAssignments.length
                                                const allLessonsComplete = (module?.lessons || []).every(lesson =>
                                                    completedLessons?.has(lesson.id)
                                                )
                                                const isModuleComplete = moduleProgress === 100 && allAssignmentsComplete && allLessonsComplete

                                                if (isModuleComplete) {
                                                    return (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-green-300 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2.5 rounded-xl border border-green-400/30"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span>Module Complete! 🎉</span>
                                                        </motion.div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="mt-4 space-y-3">
                                                            {/* Completion Checklist */}
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${allLessonsComplete
                                                                    ? 'bg-green-500/10 border-green-400/30 text-green-300'
                                                                    : 'bg-gray-800/30 border-gray-700/30 text-gray-400'
                                                                    }`}>
                                                                    {allLessonsComplete ? (
                                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                                    ) : (
                                                                        <Circle className="w-4 h-4" />
                                                                    )}
                                                                    <span className="text-xs font-medium">Lessons: {detailedProgress.lesson}%</span>
                                                                </div>
                                                                <div className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${allAssignmentsComplete
                                                                    ? 'bg-green-500/10 border-green-400/30 text-green-300'
                                                                    : 'bg-gray-800/30 border-gray-700/30 text-gray-400'
                                                                    }`}>
                                                                    {allAssignmentsComplete ? (
                                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                                    ) : (
                                                                        <Circle className="w-4 h-4" />
                                                                    )}
                                                                    <span className="text-xs font-medium">Assignments: {detailedProgress.assignment}%</span>
                                                                </div>
                                                            </div>

                                                            {/* Progress towards completion */}
                                                            {moduleProgress < 100 && (
                                                                <div className={`text-center p-3 rounded-xl border ${moduleProgress < 50
                                                                    ? 'bg-blue-500/10 border-blue-400/30 text-blue-300'
                                                                    : moduleProgress < 80
                                                                        ? 'bg-purple-500/10 border-purple-400/30 text-purple-300'
                                                                        : 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
                                                                    }`}>
                                                                    <span className="text-xs font-medium">
                                                                        {moduleProgress < 50 ? '🚀 Getting started...' :
                                                                            moduleProgress < 80 ? '📚 Making good progress...' :
                                                                                '🎯 Almost there!'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </motion.div>

                                        {/* Collapsible Content */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="mt-4 ml-2 sm:ml-4 space-y-3 sm:space-y-4"
                                            >
                                                {/* Lessons */}
                                                {module?.lessons && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-1 h-5 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
                                                            <h5 className="text-sm font-semibold text-white">Lessons</h5>
                                                        </div>
                                                        {module.lessons
                                                            .filter(lesson => lesson.isActive === true)
                                                            .sort((a, b) => {
                                                                // Sort by order field if it exists, otherwise maintain original order
                                                                const orderA = a.order !== undefined ? a.order : 0
                                                                const orderB = b.order !== undefined ? b.order : 0
                                                                return orderA - orderB
                                                            })
                                                            .map((lesson, lessonIndex) => {
                                                                // Find the original lesson index in the unsorted array
                                                                const originalLessonIndex = module.lessons.findIndex(l => l.id === lesson.id)

                                                                const lessonUnlocked = isLessonUnlocked(moduleIndex, originalLessonIndex)
                                                                const isCompleted = completedLessons?.has(lesson?.id)
                                                                const isCurrentLesson = originalLessonIndex === currentLessonIndex
                                                                const lessonProgress = videoProgress?.[lesson?.id]
                                                                const hasProgress = lessonProgress && lessonProgress.currentTime > 0
                                                                const progressPercentage = hasProgress && lessonProgress.duration
                                                                    ? Math.round((lessonProgress.currentTime / lessonProgress.duration) * 100)
                                                                    : 0

                                                                // Check if this is the first lesson in the sorted order
                                                                const sortedLessons = module.lessons
                                                                    .filter(l => l.isActive === true)
                                                                    .sort((a, b) => {
                                                                        const orderA = a.order !== undefined ? a.order : 0
                                                                        const orderB = b.order !== undefined ? b.order : 0
                                                                        return orderA - orderB
                                                                    })
                                                                const isFirstLesson = sortedLessons.length > 0 && sortedLessons[0].id === lesson.id

                                                                return (
                                                                    <motion.div
                                                                        key={lesson?.id}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: lessonIndex * 0.05 }}
                                                                        className={`group relative p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${isCurrentLesson
                                                                            ? 'bg-gradient-to-r from-purple-500/30 via-purple-500/20 to-blue-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/30'
                                                                            : lessonUnlocked
                                                                                ? 'bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 hover:border-white/30 hover:bg-white/10 hover:shadow-md hover:shadow-purple-500/10'
                                                                                : 'bg-gradient-to-r from-gray-800/30 via-gray-800/20 to-transparent border border-gray-700/30 opacity-60 cursor-not-allowed'
                                                                            }`}
                                                                        whileHover={lessonUnlocked && !isCurrentLesson ? { scale: 1.02, x: 4 } : {}}
                                                                        whileTap={lessonUnlocked ? { scale: 0.98 } : {}}
                                                                        onClick={() => {
                                                                            if (lessonUnlocked && handleModuleAndLessonSelect) {
                                                                                handleModuleAndLessonSelect(moduleIndex, originalLessonIndex)
                                                                            } else if (!lessonUnlocked) {
                                                                                // Show helpful message for locked lessons
                                                                                if (!isModuleUnlocked(moduleIndex)) {
                                                                                    toast.info('Complete the previous module to unlock this lesson.')
                                                                                } else {
                                                                                    toast.info('Complete the previous lesson to unlock this one.')
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-3">
                                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isCompleted
                                                                                    ? 'bg-green-500/20 border border-green-400/30'
                                                                                    : hasProgress
                                                                                        ? 'bg-yellow-500/20 border border-yellow-400/30'
                                                                                        : lessonUnlocked
                                                                                            ? 'bg-purple-500/20 border border-purple-400/30'
                                                                                            : 'bg-gray-700/30 border border-gray-600/30'
                                                                                    }`}>
                                                                                    {getLessonIcon(lesson, isCompleted, hasProgress, lessonUnlocked)}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <span className={`text-sm font-medium truncate block ${lessonUnlocked ? 'text-white' : 'text-gray-500'
                                                                                        }`}>
                                                                                        {lesson?.title}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-2 mt-1">
                                                                                        {isFirstLesson && lessonUnlocked && !isCompleted && (
                                                                                            <span className="inline-flex items-center gap-1 text-xs text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full font-medium border border-blue-400/30">
                                                                                                <Play className="w-3 h-3" />
                                                                                                Start
                                                                                            </span>
                                                                                        )}
                                                                                        {isCompleted && (
                                                                                            <span className="inline-flex items-center gap-1 text-xs text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full font-medium border border-green-400/30">
                                                                                                <CheckCircle className="w-3 h-3" />
                                                                                                Done
                                                                                            </span>
                                                                                        )}
                                                                                        {!lessonUnlocked && (
                                                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-700/30 px-2 py-0.5 rounded-full font-medium border border-gray-600/30">
                                                                                                <Lock className="w-3 h-3" />
                                                                                                Locked
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                                {getLessonContentIndicator(lesson)}
                                                                                {hasProgress && !isCompleted && (
                                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                                                                                        <span className="text-xs font-semibold text-yellow-300">
                                                                                            {progressPercentage}%
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                <span className="text-xs text-gray-400 font-medium">
                                                                                    {formatDuration(lesson?.duration)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {hasProgress && !isCompleted && (
                                                                            <div className="mt-3 w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden border border-gray-700/50">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    animate={{ width: `${progressPercentage}%` }}
                                                                                    transition={{ duration: 0.5 }}
                                                                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full shadow-sm"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        {isCompleted && (
                                                                            <div className="mt-3 w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden border border-gray-700/50">
                                                                                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full shadow-sm" style={{ width: "100%" }} />
                                                                            </div>
                                                                        )}
                                                                    </motion.div>
                                                                )
                                                            })}
                                                    </div>
                                                )}

                                                {/* Assignments */}
                                                {moduleAssignments.length > 0 && (
                                                    <div className="space-y-3">
                                                        <h5 className="text-sm font-medium text-white">Assignments</h5>
                                                        {moduleAssignments.map((assignment) => {
                                                            const isSubmitted = submittedAssignments.has(assignment.id)
                                                            const submission = assignmentSubmissions[assignment.id] || {}
                                                            const assignmentUnlocked = isAssignmentUnlocked(moduleIndex)

                                                            return (
                                                                <div key={assignment.id} className={`border border-white/20 rounded-lg p-3 ${!assignmentUnlocked ? 'opacity-60' : ''}`}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h6 className="text-sm font-medium text-white truncate">
                                                                            {assignment.title}
                                                                        </h6>
                                                                        {isSubmitted && (
                                                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                                        )}
                                                                    </div>

                                                                    <p className="text-xs text-gray-300 mb-3">
                                                                        {assignment.description}
                                                                    </p>

                                                                    <div className="space-y-2 mb-3">
                                                                        <div className="flex items-center gap-2 text-xs">
                                                                            <Github className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                                            {assignmentUnlocked ? (
                                                                                <a
                                                                                    href={assignment.githubLink}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-400 hover:underline truncate"
                                                                                >
                                                                                    GitHub Repository
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-gray-500 flex items-center gap-1">
                                                                                    <Lock className="w-3 h-3" />
                                                                                    GitHub Repository
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs">
                                                                            <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                                            {assignmentUnlocked ? (
                                                                                <a
                                                                                    href={assignment.liveLink}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-400 hover:underline truncate"
                                                                                >
                                                                                    Live Demo
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-gray-500 flex items-center gap-1">
                                                                                    <Lock className="w-3 h-3" />
                                                                                    Live Demo
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-xs text-gray-400 mb-3">
                                                                        <div>Total Marks: {assignment.totalMarks}</div>
                                                                        <div>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                                                                    </div>

                                                                    {!assignmentUnlocked && (
                                                                        <div className="text-xs text-yellow-400 mb-3">
                                                                            Complete all lessons to unlock this assignment
                                                                        </div>
                                                                    )}

                                                                    {assignmentUnlocked && !isSubmitted && (
                                                                        <div className="space-y-2">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="GitHub Link"
                                                                                value={submission.githubLink || ''}
                                                                                onChange={(e) => updateAssignmentSubmission(assignment.id, 'githubLink', e.target.value)}
                                                                                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-xs"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Live Link"
                                                                                value={submission.liveLink || ''}
                                                                                onChange={(e) => updateAssignmentSubmission(assignment.id, 'liveLink', e.target.value)}
                                                                                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-xs"
                                                                            />
                                                                            <textarea
                                                                                placeholder="Description"
                                                                                value={submission.description || ''}
                                                                                onChange={(e) => updateAssignmentSubmission(assignment.id, 'description', e.target.value)}
                                                                                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-xs h-20 resize-none"
                                                                            />

                                                                            {/* Error Message */}
                                                                            {submissionErrors[assignment.id] && (
                                                                                <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded">
                                                                                    {submissionErrors[assignment.id]}
                                                                                </div>
                                                                            )}

                                                                            {/* Success Message */}
                                                                            {submissionSuccess[assignment.id] && (
                                                                                <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded">
                                                                                    {submissionSuccess[assignment.id]}
                                                                                </div>
                                                                            )}

                                                                            <Button
                                                                                onClick={() => handleAssignmentSubmit(assignment.id)}
                                                                                disabled={isSubmittingAssignment}
                                                                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs py-2"
                                                                            >
                                                                                {isSubmittingAssignment ? 'Submitting...' : 'Submit Assignment'}
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    {isSubmitted && (
                                                                        <div className="space-y-2">
                                                                            <div className={`text-xs p-2 rounded ${submission.status === 'approved'
                                                                                ? 'text-green-400 bg-green-400/10'
                                                                                : submission.status === 'rejected'
                                                                                    ? 'text-red-400 bg-red-400/10'
                                                                                    : 'text-yellow-400 bg-yellow-400/10'
                                                                                }`}>
                                                                                {submission.status === 'approved'
                                                                                    ? 'Assignment approved!'
                                                                                    : submission.status === 'rejected'
                                                                                        ? 'Assignment needs revision'
                                                                                        : 'Assignment submitted successfully!'
                                                                                }
                                                                            </div>

                                                                            {/* Show submission details */}
                                                                            {submission.submittedAt && (
                                                                                <div className="text-xs text-gray-400">
                                                                                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                                                                </div>
                                                                            )}

                                                                            {submission.marks !== undefined && (
                                                                                <div className="text-xs text-blue-400">
                                                                                    Marks: {submission.marks}/{assignment.totalMarks}
                                                                                </div>
                                                                            )}

                                                                            {/* {submission.status && (
                                                                            <div className={`text-xs ${submission.status === 'approved'
                                                                                ? 'text-green-400'
                                                                                : submission.status === 'pending'
                                                                                    ? 'text-red-400'
                                                                                    : 'text-yellow-400'
                                                                                }`}>
                                                                                Status: {submission.status}
                                                                            </div>
                                                                        )} */}

                                                                            {/* Review Button */}
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={async () => {
                                                                                    // Fetch latest submission data
                                                                                    if (submission.submissionId && fetchLatestSubmission) {
                                                                                        const latestSubmission = await fetchLatestSubmission(submission.submissionId)
                                                                                        if (latestSubmission) {
                                                                                            setSelectedSubmission(latestSubmission)
                                                                                        } else {
                                                                                            setSelectedSubmission(submission)
                                                                                        }
                                                                                    } else {
                                                                                        setSelectedSubmission(submission)
                                                                                    }
                                                                                    setSelectedAssignment(assignment)
                                                                                    setShowReviewModal(true)
                                                                                }}
                                                                                className="w-full text-white border-white/20 hover:bg-white/10 text-xs py-1"
                                                                            >
                                                                                <Eye className="w-3 h-3 mr-1" />
                                                                                View Review
                                                                            </Button>
                                                                        </div>
                                                                    )
                                                                    }
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )
                            })}
                    </div>

                {/* Complete Course Button - Only visible when progress is 100% */}
                {
                    (() => {
                        const overallProgress = calculateOverallProgress()
                        if (overallProgress === 100) {
                            return (
                                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
                                    <div className="text-center">
                                        <h4 className="text-lg font-semibold text-green-400 mb-2">
                                            🎉 Congratulations! Course Completed!
                                        </h4>
                                        <p className="text-sm text-gray-300 mb-4">
                                            You've successfully completed all modules and assignments. Generate your certificate now!
                                        </p>
                                        <Button
                                            onClick={handleGenerateCertificate}
                                            disabled={isGeneratingCertificate}
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGeneratingCertificate ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Generating Certificate...
                                                </>
                                            ) : (
                                                <>
                                                    🏆 Generate Certificate
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    })()
                }
            </div>
        </Card>

        {/* Assignment Review Modal */}
        {
        showReviewModal && selectedSubmission && selectedAssignment && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <AssignmentSubmissionReview
                        submission={selectedSubmission}
                        assignment={selectedAssignment}
                        onResubmit={handleAssignmentResubmit}
                        isResubmitting={isResubmittingAssignment}
                    />

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewModal(false)}
                            className="text-white border-white/20 hover:bg-white/10"
                        >
                            Close
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }
        </>
    )
}
