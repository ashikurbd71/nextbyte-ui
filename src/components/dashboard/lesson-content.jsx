"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { YouTubePlayer, extractYouTubeVideoId } from "@/components/ui/youtube-player"
import { Play, Download, FileText, Eye, CheckCircle } from "lucide-react"
import { toast } from 'sonner'

export function LessonContent({
    lesson,
    onLessonComplete,
    isCompleted,
    videoProgress,
    onTimeUpdate,
    formatTime,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious
}) {
    const [isReading, setIsReading] = useState(false)
    const [hasDownloaded, setHasDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const downloadLinkRef = useRef(null)

    // Reset states when lesson changes
    useEffect(() => {
        setIsReading(false)
        setHasDownloaded(false)
        setIsDownloading(false)
    }, [lesson?.id])

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            // Cleanup any pending timeouts or state updates
            setIsReading(false)
            setHasDownloaded(false)
            setIsDownloading(false)
        }
    }, [])

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

    const contentType = getLessonContentType(lesson)
    // Handle both full YouTube URLs and direct video IDs
    const getYouTubeVideoId = (videoUrl) => {
        if (!videoUrl) return null

        // If it's already a video ID (no slashes or dots), return as is
        if (!videoUrl.includes('/') && !videoUrl.includes('.')) {
            return videoUrl
        }

        // Otherwise, extract from URL
        return extractYouTubeVideoId(videoUrl)
    }

    const youtubeVideoId = lesson?.videoUrl ? getYouTubeVideoId(lesson.videoUrl) : null
    const isYouTubeVideo = !!youtubeVideoId

    // Handle file download
    const handleFileDownload = () => {
        if (lesson?.fileUrl) {
            setIsDownloading(true)

            // Use a hidden anchor element that's already in the DOM
            if (downloadLinkRef.current) {
                downloadLinkRef.current.href = lesson.fileUrl
                downloadLinkRef.current.click()
            } else {
                // Fallback: use window.open
                window.open(lesson.fileUrl, '_blank', 'noopener,noreferrer')
            }

            setHasDownloaded(true)
            setIsDownloading(false)

            // Mark lesson as completed after download
            if (!isCompleted && onLessonComplete) {
                setTimeout(() => {
                    onLessonComplete(lesson.id)
                }, 1000)
            }
        }
    }

    // Handle text reading completion
    const handleTextRead = () => {
        setIsReading(true)
        // Mark lesson as completed after reading
        if (!isCompleted && onLessonComplete) {
            setTimeout(() => {
                onLessonComplete(lesson.id)
            }, 2000) // Give user time to read
        }
    }

    // YouTube player state change handler
    const handleYouTubeStateChange = (event) => {
        try {
            if (event.data === window.YT?.PlayerState?.ENDED && !isCompleted && onLessonComplete) {
                // Mark lesson as completed when YouTube video ends
                onLessonComplete(lesson.id)
            }
        } catch (error) {
            console.error('Error in YouTube player state change:', error)
            // Silently handle - this is not critical for user experience
        }
    }

    const renderContent = () => {
        try {
            switch (contentType) {
                case 'video':
                    return (
                        <div className="relative aspect-video bg-black  overflow-hidden">
                            {isYouTubeVideo ? (
                                <YouTubePlayer
                                    videoId={youtubeVideoId}
                                    onStateChange={handleYouTubeStateChange}
                                    className="w-full  h-full"
                                />
                            ) : (
                                <video
                                    src={lesson.videoUrl}
                                    title={lesson.title || "Course Video"}
                                    className="w-full p-5 h-full"
                                    controls
                                    onTimeUpdate={(e) => {
                                        try {
                                            if (onTimeUpdate) {
                                                onTimeUpdate(e.target.currentTime, e.target.duration)
                                            }
                                        } catch (error) {
                                            console.error('Error updating video time:', error)
                                        }
                                    }}
                                    onEnded={() => {
                                        try {
                                            if (!isCompleted && onLessonComplete) {
                                                onLessonComplete(lesson.id)
                                            }
                                        } catch (error) {
                                            console.error('Error handling video end:', error)
                                        }
                                    }}
                                    onError={(e) => {
                                        console.error('Video error:', e)
                                        toast.error('Unable to load video. Please check your internet connection or try refreshing the page.')
                                    }}
                                />
                            )}
                        </div>
                    )

                case 'file':
                    return (
                        <div className="p-6 text-center">
                            <div className="mb-4">
                                <Download className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Lesson Material
                                </h3>
                                <p className="text-gray-300 mb-6">
                                    {lesson.description || "Open the lesson material to continue learning."}
                                </p>

                                {/* Show file URL for reference */}
                                <div className="text-xs text-gray-400 mb-4 p-2 bg-white/5 rounded">
                                    <span className="break-all">{lesson.fileUrl}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleFileDownload}
                                    disabled={isDownloading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 w-full disabled:opacity-50"
                                >
                                    {isDownloading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Opening File...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Open File
                                        </>
                                    )}
                                </Button>
                            </div>

                            {hasDownloaded && (
                                <div className="mt-4 flex items-center justify-center text-green-400">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span>File opened successfully!</span>
                                </div>
                            )}
                        </div>
                    )

                case 'text':
                    return (
                        <div className="p-6">
                            <div className="mb-4">
                                <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2 text-center">
                                    {lesson.title}
                                </h3>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
                                <div className="text-gray-200 whitespace-pre-wrap">
                                    {lesson.text}
                                </div>
                            </div>

                            <div className="text-center">
                                <Button
                                    onClick={handleTextRead}
                                    disabled={isReading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                                >
                                    {isReading ? (
                                        <>
                                            <Eye className="w-4 h-4 mr-2" />
                                            Reading...
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 mr-2" />
                                            Mark as Read
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )

                default:
                    return (
                        <div className="p-6 text-center">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Content Coming Soon
                                </h3>
                                <p className="text-gray-300">
                                    This lesson content is being prepared. Please check back later or continue with the next lesson.
                                </p>
                            </div>
                        </div>
                    )
            }
        } catch (error) {
            console.error('Error rendering content:', error)
            return (
                <div className="p-6 text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Unable to Load Content
                        </h3>
                        <p className="text-gray-300 mb-4">
                            We encountered an issue while loading this lesson. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="space-y-4">
            <Card className="bg-black/20 backdrop-blur-xl p-3 border-white/20 overflow-hidden">
                {renderContent()}
            </Card>

            {/* Lesson Completion Status */}
            {isCompleted && (
                <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Lesson Completed! 🎉</span>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </Button>

                <Button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next →
                </Button>
            </div>

            {/* Hidden download link */}
            <a
                ref={downloadLinkRef}
                style={{ display: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
            />
        </div>
    )
}
