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

            // Handle specific error for existing certificate
            if (error.message && error.message.includes('Certificate already exists')) {
                toast.error('📜 Certificate already exists for this enrollment! You can download it from your profile.')
            } else if (error.statusCode === 400 && error.error === 'Bad Request') {
                toast.error('📜 Certificate already exists for this enrollment! You can download it from your profile.')
            } else {
                toast.error('Failed to generate certificate. Please try again.')
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
            toast.error('Failed to update progress. Please try again.')
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
                    toast.error('Failed to update progress. Please try again.')
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
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-white">Course Modules</h3>
                        {isUpdatingProgress && (
                            <div className="flex items-center gap-2 text-xs text-green-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Updating progress...</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {modules.map((module, moduleIndex) => {
                            const moduleProgress = getModuleProgress(module)
                            const isUnlocked = isModuleUnlocked(moduleIndex)
                            const isActive = moduleIndex === currentModuleIndex
                            const isExpanded = expandedModules.has(moduleIndex)
                            const moduleAssignments = module?.assignments || []
                            const completedAssignments = moduleAssignments.filter(assignment =>
                                submittedAssignments.has(assignment.id)
                            ).length

                            return (
                                <div key={module.id}>
                                    <div
                                        className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${isActive
                                            ? 'bg-purple-500/20 border border-purple-500/30'
                                            : isUnlocked
                                                ? 'bg-white/5 hover:bg-white/10'
                                                : 'bg-white/5 opacity-50 cursor-not-allowed'
                                            }`}
                                        onClick={() => isUnlocked && setCurrentModuleIndex(moduleIndex)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm sm:text-base font-medium text-white flex items-center gap-2">
                                                {isUnlocked ? (
                                                    <Unlock className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                )}
                                                <span className="truncate">{module?.title}</span>
                                            </h4>
                                            <div className="flex items-center gap-2 flex-shrink-0">

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleModuleExpansion(moduleIndex)
                                                    }}
                                                    className="text-white hover:bg-white/20 p-1"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                                            <span>{formatDuration(module?.duration)}</span>
                                            <span>{module?.lessons?.length || 0} lessons</span>
                                        </div>

                                        {/* Assignment Progress */}
                                        {moduleAssignments.length > 0 && (
                                            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <FileText className="w-3 h-3" />
                                                    Assignments: {completedAssignments}/{moduleAssignments.length}
                                                </span>
                                            </div>
                                        )}

                                        <div className="w-full bg-white/20 rounded-full h-1">
                                            <div
                                                className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                                                style={{ width: `${moduleProgress}%` }}
                                            />
                                        </div>

                                        {/* Enhanced Progress Bar */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                                                <span>Progress</span>
                                                <span>{moduleProgress}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-500 ease-out ${moduleProgress === 100
                                                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                        : 'bg-gradient-to-r from-purple-400 to-blue-500'
                                                        }`}
                                                    style={{ width: `${moduleProgress}%` }}
                                                />
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
                                                        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Module Complete! 🎉
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className="mt-2 space-y-1">
                                                            {/* Completion Checklist */}
                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                <div className={`flex items-center gap-1 ${allLessonsComplete ? 'text-green-400' : 'text-gray-400'}`}>
                                                                    {allLessonsComplete ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                                                    <span>Lessons: {detailedProgress.lesson}%</span>
                                                                </div>
                                                                <div className={`flex items-center gap-1 ${allAssignmentsComplete ? 'text-green-400' : 'text-gray-400'}`}>
                                                                    {allAssignmentsComplete ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                                                    <span>Assignments: {detailedProgress.assignment}%</span>
                                                                </div>
                                                            </div>

                                                            {/* Progress towards completion */}
                                                            {moduleProgress < 100 && (
                                                                <div className="text-xs text-yellow-400 text-center">
                                                                    {moduleProgress < 50 ? '🚀 Getting started...' :
                                                                        moduleProgress < 80 ? '📚 Making good progress...' :
                                                                            '🎯 Almost there!'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    {/* Collapsible Content */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="ml-2 sm:ml-4 space-y-3 sm:space-y-4"
                                        >
                                            {/* Lessons */}
                                            {module?.lessons && (
                                                <div className="space-y-2">
                                                    <h5 className="text-sm font-medium text-white">Lessons</h5>
                                                    {module.lessons
                                                        .filter(lesson => lesson.isActive === true)
                                                        .map((lesson, lessonIndex) => {
                                                            const lessonUnlocked = isLessonUnlocked(moduleIndex, lessonIndex)
                                                            const isCompleted = completedLessons?.has(lesson?.id)
                                                            const isCurrentLesson = lessonIndex === currentLessonIndex
                                                            const lessonProgress = videoProgress?.[lesson?.id]
                                                            const hasProgress = lessonProgress && lessonProgress.currentTime > 0
                                                            const progressPercentage = hasProgress && lessonProgress.duration
                                                                ? Math.round((lessonProgress.currentTime / lessonProgress.duration) * 100)
                                                                : 0

                                                            return (
                                                                <div
                                                                    key={lesson?.id}
                                                                    className={`p-2 sm:p-3 rounded cursor-pointer transition-colors ${isCurrentLesson
                                                                        ? 'bg-purple-400/20 border border-purple-400/30'
                                                                        : lessonUnlocked
                                                                            ? 'bg-white/5 hover:bg-white/10'
                                                                            : 'bg-white/5 opacity-50 cursor-not-allowed'
                                                                        }`}
                                                                    onClick={() => {
                                                                        if (lessonUnlocked && handleModuleAndLessonSelect) {
                                                                            handleModuleAndLessonSelect(moduleIndex, lessonIndex)
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                            {getLessonIcon(lesson, isCompleted, hasProgress, lessonUnlocked)}
                                                                            <span className="text-xs sm:text-sm text-white truncate">
                                                                                {lesson?.title}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                                            {getLessonContentIndicator(lesson)}
                                                                            {hasProgress && !isCompleted && (
                                                                                <span className="text-xs text-yellow-400">
                                                                                    {progressPercentage}%
                                                                                </span>
                                                                            )}
                                                                            <span className="text-xs text-gray-300">
                                                                                {formatDuration(lesson?.duration)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {hasProgress && !isCompleted && (
                                                                        <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                                                                            <div
                                                                                className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                                                                                style={{ width: `${progressPercentage}%` }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
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
                                    )
                                    }
                                </div>
                            )
                        })}
                    </div>

                    {/* Complete Course Button - Only visible when progress is 100% */}
                    {(() => {
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
                    })()}
                </div>
            </Card >

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
