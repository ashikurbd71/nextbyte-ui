"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from 'sonner'


import { motion } from "framer-motion";
import { VideoPlayer, VideoInfo, CourseModules, NotesSection, ProgressBar, LessonContent } from "@/components/dashboard"
import { useAuth } from "@/contexts/auth-context"
import { submitAssignment, resubmitAssignment, getSubmissionById } from "@/app/apis/assignment-submesion/assignmentsubmesionApis"
import { updateEnrollmentProgress } from "@/app/apis/enrollment-apis/enrollmentApis"
import { Play } from 'lucide-react';
export function VideoContent({ enrollment }) {
    const { user } = useAuth()
    const courseId = enrollment?.course?.id
    const courseTitle = enrollment?.course?.name
    const progress = enrollment?.progress
    const modules = enrollment?.course?.modules || []
    // Get totalModules from course entity
    const totalModules = enrollment?.course?.totalModules || modules.length

    // Helper function to get sorted lessons for a module
    const getSortedLessons = (module) => {
        return module?.lessons
            ?.filter(lesson => lesson.isActive === true)
            ?.sort((a, b) => {
                const orderA = a.order !== undefined ? a.order : 0
                const orderB = b.order !== undefined ? b.order : 0
                return orderA - orderB
            }) || []
    }

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
            // Silently fail - this is not critical for user experience
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
            // Return default position if there's an error
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
            // Show user-friendly error message
            toast.error('Unable to save your progress. Please try refreshing the page.')
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
        if (user?.id && courseId && modules.length > 0) {
            const savedProgress = loadVideoProgress()
            setVideoProgress(savedProgress)

            // Restore completed lessons from saved progress
            const savedCompletedLessons = savedProgress.completedLessons ? new Set(savedProgress.completedLessons) : new Set()
            setCompletedLessons(savedCompletedLessons)

            // Restore current position
            const savedPosition = loadCurrentPosition()

            // Verify that the saved position is valid
            const savedModule = modules[savedPosition.moduleIndex]
            const savedLesson = savedModule?.lessons?.[savedPosition.lessonIndex]

            // Helper to check if a lesson is unlocked (using saved completed lessons)
            const checkLessonUnlocked = (moduleIdx, lessonIdx) => {
                // First module is always unlocked
                if (moduleIdx === 0) {
                    const module = modules[moduleIdx]
                    if (!module?.lessons?.length) return false
                    const sortedLessons = getSortedLessons(module)
                    if (sortedLessons.length === 0) return false
                    const targetLesson = module.lessons[lessonIdx]
                    if (!targetLesson) return false
                    const sortedIndex = sortedLessons.findIndex(l => l.id === targetLesson.id)
                    // First lesson in sorted order is always unlocked
                    if (sortedIndex === 0) return true
                    // For other lessons, check if previous is completed
                    if (sortedIndex > 0) {
                        const previousLesson = sortedLessons[sortedIndex - 1]
                        return previousLesson ? savedCompletedLessons.has(previousLesson.id) : true
                    }
                    return false
                }
                // For other modules, first check if module is unlocked
                const previousModule = modules[moduleIdx - 1]
                if (!previousModule) return false
                const moduleProgress = previousModule.lessons?.filter(lesson =>
                    savedCompletedLessons.has(lesson.id)
                ).length || 0
                const totalLessons = previousModule.lessons?.length || 0
                if (totalLessons === 0 || Math.round((moduleProgress / totalLessons) * 100) !== 100) {
                    return false
                }
                // Module is unlocked, check lesson
                const module = modules[moduleIdx]
                if (!module?.lessons?.length) return false
                const sortedLessons = getSortedLessons(module)
                if (sortedLessons.length === 0) return false
                const targetLesson = module.lessons[lessonIdx]
                if (!targetLesson) return false
                const sortedIndex = sortedLessons.findIndex(l => l.id === targetLesson.id)
                // First lesson in sorted order is always unlocked
                if (sortedIndex === 0) return true
                // For other lessons, check if previous is completed
                if (sortedIndex > 0) {
                    const previousLesson = sortedLessons[sortedIndex - 1]
                    return previousLesson ? savedCompletedLessons.has(previousLesson.id) : true
                }
                return false
            }

            // Check if saved position is valid and unlocked
            if (savedModule && savedLesson && checkLessonUnlocked(savedPosition.moduleIndex, savedPosition.lessonIndex)) {
                setCurrentModuleIndex(savedPosition.moduleIndex)
                setCurrentLessonIndex(savedPosition.lessonIndex)
            } else {
                // If saved position is invalid or locked, find first unlocked lesson
                let found = false
                for (let moduleIdx = 0; moduleIdx < modules.length && !found; moduleIdx++) {
                    const module = modules[moduleIdx]
                    if (!module?.lessons?.length) continue
                    const sortedLessons = getSortedLessons(module)
                    if (sortedLessons.length === 0) continue

                    // First module is always accessible, others need previous module completed
                    if (moduleIdx === 0 || checkLessonUnlocked(moduleIdx, 0)) {
                        const firstLesson = sortedLessons[0]
                        const originalIndex = module.lessons.findIndex(l => l.id === firstLesson.id)
                        if (originalIndex !== -1) {
                            setCurrentModuleIndex(moduleIdx)
                            setCurrentLessonIndex(originalIndex)
                            saveCurrentPosition(moduleIdx, originalIndex)
                            found = true
                        }
                    }
                }
                // Fallback to first module, first lesson
                if (!found) {
                    const firstModule = modules[0]
                    if (firstModule?.lessons?.length) {
                        const sortedLessons = getSortedLessons(firstModule)
                        if (sortedLessons.length > 0) {
                            const firstLesson = sortedLessons[0]
                            const originalIndex = firstModule.lessons.findIndex(l => l.id === firstLesson.id)
                            if (originalIndex !== -1) {
                                setCurrentModuleIndex(0)
                                setCurrentLessonIndex(originalIndex)
                                saveCurrentPosition(0, originalIndex)
                            }
                        }
                    }
                }
            }

            // Restore assignment submissions
            const savedSubmissions = loadAssignmentSubmissions()
            setAssignmentSubmissions(savedSubmissions)

            // Restore submitted assignments set
            const savedSubmittedSet = loadSubmittedAssignments()
            setSubmittedAssignments(savedSubmittedSet)
        }
    }, [user?.id, courseId, modules, loadVideoProgress, loadCurrentPosition, loadAssignmentSubmissions, loadSubmittedAssignments])

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
        // Always unlock the module if it's the first module
        if (moduleIndex === 0) {
            // For the first module, unlock the first lesson (by order) and subsequent lessons based on completion
            const currentModule = modules[moduleIndex]
            if (!currentModule?.lessons?.length) return false

            // Get sorted lessons for this module
            const sortedLessons = getSortedLessons(currentModule)
            if (sortedLessons.length === 0) return false

            // Find the lesson at the given index
            const targetLesson = currentModule.lessons[lessonIndex]
            if (!targetLesson) return false

            // Find the position of this lesson in the sorted array
            const sortedIndex = sortedLessons.findIndex(l => l.id === targetLesson.id)

            // First lesson in sorted order is always unlocked
            if (sortedIndex === 0) return true

            // For other lessons, check if previous lesson is completed
            if (sortedIndex > 0) {
                const previousLesson = sortedLessons[sortedIndex - 1]
                return previousLesson ? completedLessons.has(previousLesson.id) : true
            }

            return false
        }

        // For other modules, check if module is unlocked first
        if (!isModuleUnlocked(moduleIndex)) return false

        const currentModule = modules[moduleIndex]
        if (!currentModule?.lessons?.length) return false

        // Get sorted lessons for this module
        const sortedLessons = getSortedLessons(currentModule)
        if (sortedLessons.length === 0) return false

        // Find the lesson at the given index
        const targetLesson = currentModule.lessons[lessonIndex]
        if (!targetLesson) return false

        // Find the position of this lesson in the sorted array
        const sortedIndex = sortedLessons.findIndex(l => l.id === targetLesson.id)

        // First lesson in sorted order is always unlocked for each module
        if (sortedIndex === 0) return true

        // For other lessons, check if previous lesson is completed
        if (sortedIndex > 0) {
            const previousLesson = sortedLessons[sortedIndex - 1]
            return previousLesson ? completedLessons.has(previousLesson.id) : true
        }

        return false
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

            // Show success toast
            const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === lessonId)
            if (lesson) {
                toast.success(`✅ Lesson "${lesson.title}" completed successfully!`)
            }

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
            toast.success(`📊 Course progress updated to ${overallProgress}%`)
        } catch (error) {
            console.error('Error updating enrollment progress from video completion:', error)
            const errorMessage = error?.message || 'Failed to update course progress'
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

    // Function to update enrollment progress when assignment is submitted
    const updateEnrollmentProgressFromAssignment = async (submittedAssignmentId, submittedAssignmentsSet) => {
        if (!enrollment?.id || !modules) return

        try {
            setIsUpdatingProgress(true)
            let totalProgress = 0
            const totalModules = enrollment?.course?.totalModules || modules.length
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
            toast.success(`📊 Course progress updated to ${overallProgress}%`)
        } catch (error) {
            console.error('Error updating enrollment progress from assignment submission:', error)
            const errorMessage = error?.message || 'Failed to update course progress'
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
            const errorMessage = error?.message || 'Failed to submit assignment'
            let userFriendlyMessage = 'Unable to submit assignment. Please try again.'

            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
            } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                userFriendlyMessage = 'Your session has expired. Please log in again.'
            } else if (errorMessage.includes('validation') || errorMessage.includes('required')) {
                userFriendlyMessage = 'Please fill in all required fields correctly.'
            } else if (errorMessage.includes('duplicate') || errorMessage.includes('already')) {
                userFriendlyMessage = 'This assignment has already been submitted.'
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                userFriendlyMessage = 'Assignment not found. Please refresh the page.'
            }

            setSubmissionErrors(prev => ({
                ...prev,
                [assignmentId]: userFriendlyMessage
            }))
            toast.error(userFriendlyMessage)
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
            const errorMessage = error?.message || 'Failed to resubmit assignment'
            let userFriendlyMessage = 'Unable to resubmit assignment. Please try again.'

            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
            } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                userFriendlyMessage = 'Your session has expired. Please log in again.'
            } else if (errorMessage.includes('validation') || errorMessage.includes('required')) {
                userFriendlyMessage = 'Please fill in all required fields correctly.'
            } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
                userFriendlyMessage = 'Submission not found. Please refresh the page.'
            }

            setSubmissionErrors(prev => ({
                ...prev,
                [submissionId]: userFriendlyMessage
            }))
            toast.error(userFriendlyMessage)
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
        // Mark current lesson as completed before moving to next (if not already completed)
        if (currentLesson?.id && !completedLessons.has(currentLesson.id)) {
            handleLessonComplete(currentLesson.id)
        }

        // Get sorted lessons for current module
        const sortedLessons = getSortedLessons(currentModule)

        // Find current lesson index in sorted array
        const currentSortedIndex = sortedLessons.findIndex(lesson => lesson.id === currentLesson?.id)

        if (currentSortedIndex < sortedLessons.length - 1) {
            // Move to next lesson in current module
            const nextLesson = sortedLessons[currentSortedIndex + 1]
            const nextLessonOriginalIndex = currentModule.lessons.findIndex(l => l.id === nextLesson.id)
            setCurrentLessonIndex(nextLessonOriginalIndex)
            saveCurrentPosition(currentModuleIndex, nextLessonOriginalIndex)
            toast.info(`📚 Moving to next lesson: ${nextLesson?.title}`)
        } else if (currentModuleIndex < modules.length - 1) {
            // Move to first lesson of next module
            const nextModule = modules[currentModuleIndex + 1]
            const nextModuleSortedLessons = getSortedLessons(nextModule)

            if (nextModuleSortedLessons.length > 0) {
                const firstLesson = nextModuleSortedLessons[0]
                const firstLessonOriginalIndex = nextModule.lessons.findIndex(l => l.id === firstLesson.id)
                setCurrentModuleIndex(currentModuleIndex + 1)
                setCurrentLessonIndex(firstLessonOriginalIndex)
                saveCurrentPosition(currentModuleIndex + 1, firstLessonOriginalIndex)
                toast.info(`🚀 Moving to next module: ${nextModule?.title}`)
            }
        }
    }

    const handlePrevious = () => {
        // Get sorted lessons for current module
        const sortedLessons = getSortedLessons(currentModule)

        // Find current lesson index in sorted array
        const currentSortedIndex = sortedLessons.findIndex(lesson => lesson.id === currentLesson?.id)

        if (currentSortedIndex > 0) {
            // Move to previous lesson in current module
            const previousLesson = sortedLessons[currentSortedIndex - 1]
            const previousLessonOriginalIndex = currentModule.lessons.findIndex(l => l.id === previousLesson.id)
            setCurrentLessonIndex(previousLessonOriginalIndex)
            saveCurrentPosition(currentModuleIndex, previousLessonOriginalIndex)
            toast.info(`📚 Moving to previous lesson: ${previousLesson?.title}`)
        } else if (currentModuleIndex > 0) {
            // Move to last lesson of previous module
            const previousModule = modules[currentModuleIndex - 1]
            const previousModuleSortedLessons = getSortedLessons(previousModule)

            if (previousModuleSortedLessons.length > 0) {
                const lastLesson = previousModuleSortedLessons[previousModuleSortedLessons.length - 1]
                const lastLessonOriginalIndex = previousModule.lessons.findIndex(l => l.id === lastLesson.id)
                setCurrentModuleIndex(currentModuleIndex - 1)
                setCurrentLessonIndex(lastLessonOriginalIndex)
                saveCurrentPosition(currentModuleIndex - 1, lastLessonOriginalIndex)
                toast.info(`🚀 Moving to previous module: ${previousModule?.title}`)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl py-8 sm:py-12 md:py-16 mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-400/30 shadow-lg">
                            <Play className="w-6 h-6 text-purple-300" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                            {courseTitle}
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-1">
                            <ProgressBar
                                progress={progress}
                                size="lg"
                                showPercentage={false}
                                className="mb-2"
                            />
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-300 text-sm sm:text-base font-medium">Course Progress</span>
                                <div className="flex items-center gap-3">
                                    {isSaving && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full border border-green-400/20"
                                        >
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="font-medium">Saving...</span>
                                        </motion.div>
                                    )}
                                    {isUpdatingProgress && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded-full border border-blue-400/20"
                                        >
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="font-medium">Updating...</span>
                                        </motion.div>
                                    )}
                                    <span className="text-white font-bold text-base sm:text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        {progress}%
                                    </span>
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
                            canGoNext={(() => {
                                const sortedLessons = getSortedLessons(currentModule)
                                const currentSortedIndex = sortedLessons.findIndex(lesson => lesson.id === currentLesson?.id)
                                return currentSortedIndex < sortedLessons.length - 1 || currentModuleIndex < modules?.length - 1
                            })()}
                            canGoPrevious={(() => {
                                const sortedLessons = getSortedLessons(currentModule)
                                const currentSortedIndex = sortedLessons.findIndex(lesson => lesson.id === currentLesson?.id)
                                return currentSortedIndex > 0 || currentModuleIndex > 0
                            })()}
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
                            totalModules={totalModules}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

