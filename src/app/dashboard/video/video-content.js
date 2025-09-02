"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import { VideoPlayer, VideoInfo, CourseModules, NotesSection, ProgressBar, LessonContent } from "@/components/dashboard"
import { useAuth } from "@/contexts/auth-context"
import { submitAssignment, resubmitAssignment, getSubmissionById } from "@/app/apis/assignment-submesion/assignmentsubmesionApis"
import { updateEnrollmentProgress } from "@/app/apis/enrollment-apis/enrollmentApis"

export function VideoContent({ enrollment }) {
    const { user } = useAuth()
    const courseId = enrollment?.course?.id
    const courseTitle = enrollment?.course?.name
    const progress = enrollment?.progress
    const modules = enrollment?.course?.modules || []
    // Get totalModules from course entity
    const totalModules = enrollment?.course?.totalModules || modules.length

    const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

    // Wrapper functions to save position when changing modules/lessons
    const setCurrentModuleIndexWithSave = (moduleIndex) => {
        setCurrentModuleIndex(moduleIndex)
        saveCurrentPosition(moduleIndex, currentLessonIndex)
    }

    const setCurrentLessonIndexWithSave = (lessonIndex) => {
        setCurrentLessonIndex(lessonIndex)
        saveCurrentPosition(currentModuleIndex, lessonIndex)
    }

    const setCurrentModuleAndLessonWithSave = (moduleIndex, lessonIndex) => {
        setCurrentModuleIndex(moduleIndex)
        setCurrentLessonIndex(lessonIndex)
        saveCurrentPosition(moduleIndex, lessonIndex)
    }

    const handleModuleAndLessonSelect = (moduleIndex, lessonIndex) => {
        setCurrentModuleIndex(moduleIndex)
        setCurrentLessonIndex(lessonIndex)
        saveCurrentPosition(moduleIndex, lessonIndex)
    }
    const [completedLessons, setCompletedLessons] = useState(new Set())
    const [submittedAssignments, setSubmittedAssignments] = useState(new Set())
    const [assignmentSubmissions, setAssignmentSubmissions] = useState({})
    const [videoProgress, setVideoProgress] = useState({})
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false)
    const [isResubmittingAssignment, setIsResubmittingAssignment] = useState(false)
    const [submissionErrors, setSubmissionErrors] = useState({})
    const [submissionSuccess, setSubmissionSuccess] = useState({})
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false)
    const videoRef = useRef(null)

    // localStorage utility functions for current position
    const getCurrentPositionKey = (userId, courseId) => `current_position_${userId}_${courseId}`

    const saveCurrentPosition = useCallback((moduleIndex, lessonIndex) => {
        if (!user?.id || !courseId) return

        try {
            const key = getCurrentPositionKey(user.id, courseId)
            localStorage.setItem(key, JSON.stringify({ moduleIndex, lessonIndex }))
        } catch (error) {
            console.error('Error saving current position:', error)
        }
    }, [user?.id, courseId])

    const loadCurrentPosition = useCallback(() => {
        if (!user?.id || !courseId) return { moduleIndex: 0, lessonIndex: 0 }

        try {
            const key = getCurrentPositionKey(user.id, courseId)
            const savedPosition = localStorage.getItem(key)
            return savedPosition ? JSON.parse(savedPosition) : { moduleIndex: 0, lessonIndex: 0 }
        } catch (error) {
            console.error('Error loading current position:', error)
            return { moduleIndex: 0, lessonIndex: 0 }
        }
    }, [user?.id, courseId])

    // localStorage utility functions for assignment submissions
    const getAssignmentSubmissionsKey = (userId, courseId) => `assignment_submissions_${userId}_${courseId}`

    const saveAssignmentSubmissions = useCallback((submissions) => {
        if (!user?.id || !courseId) return

        try {
            const key = getAssignmentSubmissionsKey(user.id, courseId)
            localStorage.setItem(key, JSON.stringify(submissions))
        } catch (error) {
            console.error('Error saving assignment submissions:', error)
        }
    }, [user?.id, courseId])

    const loadAssignmentSubmissions = useCallback(() => {
        if (!user?.id || !courseId) return {}

        try {
            const key = getAssignmentSubmissionsKey(user.id, courseId)
            const savedSubmissions = localStorage.getItem(key)
            return savedSubmissions ? JSON.parse(savedSubmissions) : {}
        } catch (error) {
            console.error('Error loading assignment submissions:', error)
            return {}
        }
    }, [user?.id, courseId])

    const getSubmittedAssignmentsKey = (userId, courseId) => `submitted_assignments_${userId}_${courseId}`

    const saveSubmittedAssignments = useCallback((submittedSet) => {
        if (!user?.id || !courseId) return

        try {
            const key = getSubmittedAssignmentsKey(user.id, courseId)
            localStorage.setItem(key, JSON.stringify(Array.from(submittedSet)))
        } catch (error) {
            console.error('Error saving submitted assignments:', error)
        }
    }, [user?.id, courseId])

    const loadSubmittedAssignments = useCallback(() => {
        if (!user?.id || !courseId) return new Set()

        try {
            const key = getSubmittedAssignmentsKey(user.id, courseId)
            const savedSubmitted = localStorage.getItem(key)
            return savedSubmitted ? new Set(JSON.parse(savedSubmitted)) : new Set()
        } catch (error) {
            console.error('Error loading submitted assignments:', error)
            return new Set()
        }
    }, [user?.id, courseId])

    const currentModule = modules[currentModuleIndex]
    const currentLesson = currentModule?.lessons?.[currentLessonIndex]

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

    const currentVideoUrl = currentLesson?.videoUrl
    const currentFileUrl = currentLesson?.fileUrl
    const currentText = currentLesson?.text
    const currentContentType = getLessonContentType(currentLesson)

    // localStorage utility functions for video progress
    const getProgressKey = (userId, courseId) => `video_progress_${userId}_${courseId}`

    const saveVideoProgress = useCallback((progressData) => {
        if (!user?.id || !courseId) return

        try {
            setIsSaving(true)
            const key = getProgressKey(user.id, courseId)
            localStorage.setItem(key, JSON.stringify(progressData))

            // Show saving indicator briefly
            setTimeout(() => setIsSaving(false), 1000)
        } catch (error) {
            console.error('Error saving video progress:', error)
            setIsSaving(false)
        }
    }, [user?.id, courseId])

    const loadVideoProgress = useCallback(() => {
        if (!user?.id || !courseId) return {}

        try {
            const key = getProgressKey(user.id, courseId)
            const savedProgress = localStorage.getItem(key)
            return savedProgress ? JSON.parse(savedProgress) : {}
        } catch (error) {
            console.error('Error loading video progress:', error)
            return {}
        }
    }, [user?.id, courseId])

    const clearVideoProgress = () => {
        if (!user?.id || !courseId) return

        try {
            const key = getProgressKey(user.id, courseId)
            localStorage.removeItem(key)
            setVideoProgress({})
            setCompletedLessons(new Set())
        } catch (error) {
            console.error('Error clearing video progress:', error)
        }
    }

    const clearCurrentPosition = () => {
        if (!user?.id || !courseId) return

        try {
            const key = getCurrentPositionKey(user.id, courseId)
            localStorage.removeItem(key)
            setCurrentModuleIndex(0)
            setCurrentLessonIndex(0)
        } catch (error) {
            console.error('Error clearing current position:', error)
        }
    }

    // Load saved progress on component mount
    useEffect(() => {
        if (user?.id && courseId) {
            const savedProgress = loadVideoProgress()
            setVideoProgress(savedProgress)

            // Restore completed lessons from saved progress
            if (savedProgress.completedLessons) {
                setCompletedLessons(new Set(savedProgress.completedLessons))
            }

            // Restore current position
            const savedPosition = loadCurrentPosition()
            setCurrentModuleIndex(savedPosition.moduleIndex)
            setCurrentLessonIndex(savedPosition.lessonIndex)

            // Restore assignment submissions
            const savedSubmissions = loadAssignmentSubmissions()
            setAssignmentSubmissions(savedSubmissions)

            // Restore submitted assignments set
            const savedSubmittedSet = loadSubmittedAssignments()
            setSubmittedAssignments(savedSubmittedSet)
        }
    }, [user?.id, courseId, loadVideoProgress, loadCurrentPosition, loadAssignmentSubmissions, loadSubmittedAssignments])

    // Save progress when user leaves the page
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Save current video progress before leaving
            if (currentLesson?.id && videoRef?.current) {
                const currentTime = videoRef.current.currentTime
                const duration = videoRef.current.duration
                if (currentTime > 0) {
                    const newProgress = {
                        ...videoProgress,
                        [currentLesson.id]: {
                            currentTime,
                            duration,
                            lastWatched: new Date().toISOString()
                        }
                    }
                    saveVideoProgress(newProgress)
                }
            }
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Save progress when tab becomes hidden
                handleBeforeUnload()
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            // Save progress when component unmounts
            handleBeforeUnload()
        }
    }, [videoProgress, currentLesson?.id, saveVideoProgress])

    // Utility functions
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const formatDuration = (duration) => {
        if (!duration) return "0 minutes"
        return duration
    }

    const isValidVideoUrl = (url) => {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    // Progress calculation functions
    const getModuleProgress = (module) => {
        if (!module?.lessons?.length) return 0
        const completedCount = module.lessons.filter(lesson =>
            completedLessons.has(lesson.id)
        ).length
        return Math.round((completedCount / module.lessons.length) * 100)
    }

    const isModuleUnlocked = (moduleIndex) => {
        if (moduleIndex === 0) return true
        const previousModule = modules[moduleIndex - 1]
        return getModuleProgress(previousModule) === 100
    }

    const isLessonUnlocked = (moduleIndex, lessonIndex) => {
        if (!isModuleUnlocked(moduleIndex)) return false
        if (lessonIndex === 0) return true
        const currentModule = modules[moduleIndex]
        const previousLesson = currentModule?.lessons?.[lessonIndex - 1]
        return previousLesson ? completedLessons.has(previousLesson.id) : true
    }

    const isAssignmentUnlocked = (moduleIndex) => {
        const currentModule = modules[moduleIndex]
        if (!currentModule?.lessons?.length) return false
        return currentModule.lessons.every(lesson => completedLessons.has(lesson.id))
    }

    const getLastWatchedPosition = (lessonId) => {
        if (!videoProgress[lessonId]) return null
        return {
            currentTime: videoProgress[lessonId].currentTime,
            duration: videoProgress[lessonId].duration,
            lastWatched: videoProgress[lessonId].lastWatched
        }
    }

    // Event handlers
    const handleLessonComplete = (lessonId) => {
        setCompletedLessons(prev => {
            const newCompletedLessons = new Set([...prev, lessonId])

            // Save completed lessons to localStorage
            const progressToSave = {
                ...videoProgress,
                completedLessons: Array.from(newCompletedLessons)
            }
            saveVideoProgress(progressToSave)

            // Trigger automatic progress update when video is completed
            setTimeout(() => {
                updateEnrollmentProgressFromVideo(lessonId, newCompletedLessons)
            }, 1000)

            return newCompletedLessons
        })
    }

    // Function to update enrollment progress when video is completed
    const updateEnrollmentProgressFromVideo = async (completedLessonId, completedLessonsSet) => {
        if (!enrollment?.id || !modules) return

        try {
            setIsUpdatingProgress(true)
            let totalProgress = 0
            const totalModules = enrollment?.course?.totalModules || modules.length
            let completedModules = 0

            // Calculate overall course progress
            modules.forEach((module) => {
                const moduleProgress = getModuleProgress(module)
                totalProgress += moduleProgress

                // Check if module is completed (100% progress)
                if (moduleProgress === 100) {
                    completedModules++
                }
            })

            const overallProgress = Math.round(totalProgress / totalModules)

            // Update enrollment progress
            const progressData = {
                progress: overallProgress,

            }

            await updateEnrollmentProgress(enrollment.id, progressData)
            console.log('Video completion triggered progress update:', progressData)
        } catch (error) {
            console.error('Error updating enrollment progress from video completion:', error)
        } finally {
            setIsUpdatingProgress(false)
        }
    }

    // Function to update enrollment progress when assignment is submitted
    const updateEnrollmentProgressFromAssignment = async (submittedAssignmentId, submittedAssignmentsSet) => {
        if (!enrollment?.id || !modules) return

        try {
            setIsUpdatingProgress(true)
            let totalProgress = 0
            const totalModules = enrollment?.course?.totalModules
            let completedModules = 0
            let totalAssignments = 0
            let completedAssignments = 0

            // Calculate overall course progress including assignment progress
            modules.forEach((module) => {
                const moduleProgress = getModuleProgress(module)
                totalProgress += moduleProgress

                // Check if module is completed (100% progress)
                if (moduleProgress === 100) {
                    completedModules++
                }

                // Count assignments
                const moduleAssignments = module?.assignments || []
                totalAssignments += moduleAssignments.length
                const moduleCompletedAssignments = moduleAssignments.filter(assignment =>
                    submittedAssignmentsSet.has(assignment.id)
                ).length
                completedAssignments += moduleCompletedAssignments
            })

            const overallProgress = Math.round(totalProgress / totalModules)
            const assignmentProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

            // Update enrollment progress
            const progressData = {
                progress: overallProgress,

            }

            await updateEnrollmentProgress(enrollment.id, progressData)
            console.log('Assignment submission triggered progress update:', progressData)
        } catch (error) {
            console.error('Error updating enrollment progress from assignment submission:', error)
        } finally {
            setIsUpdatingProgress(false)
        }
    }

    const handleAssignmentSubmit = async (assignmentId) => {
        if (!user?.id) {
            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: 'User not authenticated'
            }))
            return
        }

        const submission = assignmentSubmissions[assignmentId]
        if (!submission) {
            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: 'No submission data found'
            }))
            return
        }

        // Basic validation
        if (!submission.description || submission.description.trim().length < 10) {
            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: 'Description must be at least 10 characters long'
            }))
            return
        }

        if (!submission.githubLink || !submission.liveLink) {
            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: 'GitHub link and live link are required'
            }))
            return
        }

        setIsSubmittingAssignment(true)
        setSubmissionErrors(prev => ({ ...prev, [assignmentId]: null }))

        try {
            const submissionData = {
                description: submission.description,
                githubLink: submission.githubLink,
                liveLink: submission.liveLink,
                assignmentId: assignmentId,
                studentId: user.id
            }

            const result = await submitAssignment(submissionData)

            // Update local state
            const newSubmittedSet = new Set([...submittedAssignments, assignmentId])
            setSubmittedAssignments(newSubmittedSet)

            const newSubmissions = {
                ...assignmentSubmissions,
                [assignmentId]: {
                    ...assignmentSubmissions[assignmentId],
                    submissionId: result.id,
                    submittedAt: result.submittedAt,
                    status: result.status
                }
            }
            setAssignmentSubmissions(newSubmissions)

            // Save to localStorage
            saveSubmittedAssignments(newSubmittedSet)
            saveAssignmentSubmissions(newSubmissions)

            setSubmissionSuccess(prev => ({
                ...prev,
                [assignmentId]: 'Assignment submitted successfully!'
            }))

            // Trigger automatic progress update when assignment is submitted
            setTimeout(() => {
                updateEnrollmentProgressFromAssignment(assignmentId, newSubmittedSet)
            }, 1000)

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSubmissionSuccess(prev => {
                    const newState = { ...prev }
                    delete newState[assignmentId]
                    return newState
                })
            }, 3000)

        } catch (error) {
            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: error.message || 'Failed to submit assignment'
            }))
        } finally {
            setIsSubmittingAssignment(false)
        }
    }

    const updateAssignmentSubmission = (assignmentId, field, value) => {
        const newSubmissions = {
            ...assignmentSubmissions,
            [assignmentId]: {
                ...assignmentSubmissions[assignmentId],
                [field]: value
            }
        }
        setAssignmentSubmissions(newSubmissions)
        saveAssignmentSubmissions(newSubmissions)
    }

    const fetchLatestSubmission = async (submissionId) => {
        try {
            const result = await getSubmissionById(submissionId)
            return result
        } catch (error) {
            console.error('Error fetching latest submission:', error)
            return null
        }
    }

    const handleAssignmentResubmit = async (submissionId, resubmissionData) => {
        if (!user?.id) {
            setSubmissionErrors(prev => ({
                ...prev,
                [submissionId]: 'User not authenticated'
            }))
            return
        }

        // Basic validation
        if (!resubmissionData.description || resubmissionData.description.trim().length < 10) {
            setSubmissionErrors(prev => ({
                ...prev,
                [submissionId]: 'Description must be at least 10 characters long'
            }))
            return
        }

        if (!resubmissionData.githubLink || !resubmissionData.liveLink) {
            setSubmissionErrors(prev => ({
                ...prev,
                [submissionId]: 'GitHub link and live link are required'
            }))
            return
        }

        setIsResubmittingAssignment(true)
        setSubmissionErrors(prev => ({ ...prev, [submissionId]: null }))

        try {
            const result = await resubmitAssignment(submissionId, resubmissionData)

            // Update local state
            const updatedSubmissions = { ...assignmentSubmissions }
            // Find the assignment ID for this submission
            Object.keys(updatedSubmissions).forEach(assignmentId => {
                if (updatedSubmissions[assignmentId].submissionId === submissionId) {
                    updatedSubmissions[assignmentId] = {
                        ...updatedSubmissions[assignmentId],
                        ...result,
                        status: 'pending',
                        marks: null,
                        feedback: null,
                        reviewedAt: null
                    }
                }
            })
            setAssignmentSubmissions(updatedSubmissions)

            // Save to localStorage
            saveAssignmentSubmissions(updatedSubmissions)

            setSubmissionSuccess(prev => ({
                ...prev,
                [submissionId]: 'Assignment resubmitted successfully!'
            }))

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSubmissionSuccess(prev => {
                    const newState = { ...prev }
                    delete newState[submissionId]
                    return newState
                })
            }, 3000)

        } catch (error) {
            setSubmissionErrors(prev => ({
                ...prev,
                [submissionId]: error.message || 'Failed to resubmit assignment'
            }))
        } finally {
            setIsResubmittingAssignment(false)
        }
    }

    const handleTimeUpdate = (currentTime, duration) => {
        if (!currentLesson?.id) return

        // Check if progress has actually changed to prevent unnecessary updates
        const lessonId = currentLesson.id
        const existingProgress = videoProgress[lessonId]

        // Only update if the progress has changed significantly (more than 1 second difference)
        if (existingProgress &&
            Math.abs(existingProgress.currentTime - currentTime) < 1 &&
            existingProgress.duration === duration) {
            return
        }

        // Update video progress state
        const newProgress = {
            ...videoProgress,
            [lessonId]: {
                currentTime,
                duration,
                lastWatched: new Date().toISOString()
            }
        }

        setVideoProgress(newProgress)

        // Save to localStorage
        saveVideoProgress(newProgress)
    }

    const handleNext = () => {
        if (currentLessonIndex < currentModule?.lessons?.length - 1) {
            const newLessonIndex = currentLessonIndex + 1
            setCurrentLessonIndex(newLessonIndex)
            saveCurrentPosition(currentModuleIndex, newLessonIndex)
        } else if (currentModuleIndex < modules.length - 1) {
            const newModuleIndex = currentModuleIndex + 1
            setCurrentModuleIndex(newModuleIndex)
            setCurrentLessonIndex(0)
            saveCurrentPosition(newModuleIndex, 0)
        }
    }

    const handlePrevious = () => {
        if (currentLessonIndex > 0) {
            const newLessonIndex = currentLessonIndex - 1
            setCurrentLessonIndex(newLessonIndex)
            saveCurrentPosition(currentModuleIndex, newLessonIndex)
        } else if (currentModuleIndex > 0) {
            const newModuleIndex = currentModuleIndex - 1
            const previousModule = modules[newModuleIndex]
            const newLessonIndex = previousModule?.lessons?.length - 1 || 0
            setCurrentModuleIndex(newModuleIndex)
            setCurrentLessonIndex(newLessonIndex)
            saveCurrentPosition(newModuleIndex, newLessonIndex)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl py-12 sm:py-16 md:py-24 mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{courseTitle}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1">
                            <ProgressBar
                                progress={progress}
                                size="lg"
                                showPercentage={false}
                                className="mb-2"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300 text-sm sm:text-base">Course Progress</span>
                                <div className="flex items-center gap-2">
                                    {isSaving && (
                                        <span className="text-green-400 text-xs animate-pulse">
                                            Saving progress...
                                        </span>
                                    )}
                                    {isUpdatingProgress && (
                                        <span className="text-blue-400 text-xs animate-pulse">
                                            Updating progress...
                                        </span>
                                    )}
                                    <span className="text-white font-semibold text-sm sm:text-base">{progress}%</span>
                                </div>
                            </div>
                            {/* Current Position Indicator */}
                            {currentModule && currentLesson && (
                                <div className="mt-2 text-xs text-gray-400">
                                    <span>Current: Module {currentModuleIndex + 1} - Lesson {currentLessonIndex + 1}</span>
                                    <span className="ml-2">({currentModule.title} - {currentLesson.title})</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Lesson Content Section */}
                    <div className="xl:col-span-2">
                        <LessonContent
                            lesson={currentLesson}
                            onLessonComplete={handleLessonComplete}
                            isCompleted={completedLessons.has(currentLesson?.id)}
                            videoProgress={videoProgress}
                            onTimeUpdate={handleTimeUpdate}
                            formatTime={formatTime}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            canGoNext={currentLessonIndex < currentModule?.lessons?.length - 1 || currentModuleIndex < modules?.length - 1}
                            canGoPrevious={currentLessonIndex > 0 || currentModuleIndex > 0}
                        />

                        <VideoInfo
                            currentLesson={currentLesson}
                            currentModule={currentModule}
                            formatDuration={formatDuration}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        <CourseModules
                            modules={modules}
                            currentModuleIndex={currentModuleIndex}
                            currentLessonIndex={currentLessonIndex}
                            completedLessons={completedLessons}
                            submittedAssignments={submittedAssignments}
                            assignmentSubmissions={assignmentSubmissions}
                            setCurrentModuleIndex={setCurrentModuleIndexWithSave}
                            setCurrentLessonIndex={setCurrentLessonIndexWithSave}
                            handleModuleAndLessonSelect={handleModuleAndLessonSelect}
                            handleLessonComplete={handleLessonComplete}
                            handleAssignmentSubmit={handleAssignmentSubmit}
                            updateAssignmentSubmission={updateAssignmentSubmission}
                            handleAssignmentResubmit={handleAssignmentResubmit}
                            fetchLatestSubmission={fetchLatestSubmission}
                            getModuleProgress={getModuleProgress}
                            isModuleUnlocked={isModuleUnlocked}
                            isLessonUnlocked={isLessonUnlocked}
                            isAssignmentUnlocked={isAssignmentUnlocked}
                            formatDuration={formatDuration}
                            videoProgress={videoProgress}
                            getLastWatchedPosition={getLastWatchedPosition}
                            formatTime={formatTime}
                            isSubmittingAssignment={isSubmittingAssignment}
                            isResubmittingAssignment={isResubmittingAssignment}
                            submissionErrors={submissionErrors}
                            submissionSuccess={submissionSuccess}
                            enrollmentId={enrollment?.id}
                            totalModules={totalModules} // Add this line
                        />

                        { }
                    </div>
                </div>
            </div>
        </div>
    )
}
