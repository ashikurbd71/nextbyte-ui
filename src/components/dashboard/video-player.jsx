"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Eye, Bookmark, ThumbsUp, ThumbsDown } from "lucide-react"
import { YouTubePlayer, extractYouTubeVideoId } from "@/components/ui/youtube-player"

export function VideoPlayer({
    currentVideoUrl,
    currentLesson,
    currentModule,
    onTimeUpdate,
    onLessonComplete,
    isValidVideoUrl,
    formatTime,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious,
    savedProgress,
    videoRef: externalVideoRef
}) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const internalVideoRef = useRef(null)
    const videoRef = externalVideoRef || internalVideoRef
    const hasInitialized = useRef(false)
    const lastSavedTime = useRef(0)

    // Extract YouTube video ID if the URL is a YouTube link
    const youtubeVideoId = currentVideoUrl ? extractYouTubeVideoId(currentVideoUrl) : null
    const isYouTubeVideo = !!youtubeVideoId

    // Save progress when component unmounts or lesson changes
    useEffect(() => {
        return () => {
            // Save current position when leaving the component
            if (videoRef.current && currentLesson?.id && !isYouTubeVideo) {
                const currentVideoTime = videoRef.current.currentTime
                if (currentVideoTime > 0) {
                    onTimeUpdate(currentVideoTime, videoRef.current.duration)
                }
            }
        }
    }, [currentLesson?.id, onTimeUpdate, isYouTubeVideo])

    // Load saved progress when lesson changes
    useEffect(() => {
        hasInitialized.current = false // Reset initialization flag
        if (currentLesson?.id && savedProgress?.[currentLesson.id]) {
            const lessonProgress = savedProgress[currentLesson.id]
            setCurrentTime(lessonProgress.currentTime || 0)
            lastSavedTime.current = lessonProgress.currentTime || 0
        } else {
            setCurrentTime(0)
            lastSavedTime.current = 0
        }
    }, [currentLesson?.id, savedProgress])

    const handleTimeUpdate = (e) => {
        const newCurrentTime = e.target.currentTime
        const newDuration = e.target.duration

        setCurrentTime(newCurrentTime)
        setDuration(newDuration)

        // Only update if there's a significant change (more than 2 seconds difference)
        if (Math.abs(newCurrentTime - lastSavedTime.current) >= 2) {
            onTimeUpdate(newCurrentTime, newDuration)
            lastSavedTime.current = newCurrentTime
        }

        // Mark lesson as completed if watched more than 90%
        if (currentLesson && newCurrentTime / newDuration >= 0.9) {
            onLessonComplete(currentLesson.id)
        }
    }

    // Handle video seeking to restore position
    const handleVideoSeek = (e) => {
        const video = e.target
        if (!hasInitialized.current && currentLesson?.id && savedProgress?.[currentLesson.id]) {
            const lessonProgress = savedProgress[currentLesson.id]
            if (lessonProgress.currentTime && lessonProgress.currentTime > 0) {
                video.currentTime = lessonProgress.currentTime
                hasInitialized.current = true
            }
        }
    }

    // YouTube player state change handler
    const handleYouTubeStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
        } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false)
        }

        // For YouTube videos, we'll use a different approach for progress tracking
        // since we can't easily get current time from YouTube API without additional setup
        if (event.data === window.YT.PlayerState.ENDED && currentLesson) {
            // Mark lesson as completed when YouTube video ends
            onLessonComplete(currentLesson.id)
        }
    }

    return (
        <Card className="bg-black/20 backdrop-blur-xl border-white/20 overflow-hidden">
            {/* Video Player */}
            <div className="relative aspect-video bg-black">
                {currentVideoUrl && (isYouTubeVideo || isValidVideoUrl(currentVideoUrl)) ? (
                    isYouTubeVideo ? (
                        <YouTubePlayer
                            videoId={youtubeVideoId}
                            onStateChange={handleYouTubeStateChange}
                            className="w-full h-full"
                        />
                    ) : (
                        <iframe
                            src={currentVideoUrl}
                            title={currentLesson?.title || "Course Video"}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )
                ) : (
                    <div className="flex items-center justify-center h-full p-4">
                        <div className="text-center text-white">
                            <Eye className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                            <p className="text-base sm:text-lg font-medium">
                                {currentVideoUrl ? 'Invalid video URL' : 'No video available'}
                            </p>
                            <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
                                {currentVideoUrl ? 'Please check the video URL format' : 'Select a lesson to start learning'}
                            </p>
                            {currentVideoUrl && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">
                                    URL: {currentVideoUrl}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Video Controls Overlay - Only for regular videos, not YouTube */}
                {currentVideoUrl && !isYouTubeVideo && isValidVideoUrl(currentVideoUrl) && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                            onClick={(e) => {
                                e.preventDefault()
                                const iframe = e.target.closest('.relative').querySelector('iframe')
                                if (iframe) {
                                    // For iframe videos, we can't directly control play/pause
                                    // This overlay will be hidden when iframe loads
                                    setIsPlaying(true)
                                }
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full"
                        >
                            <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="p-3 sm:p-4 flex justify-between gap-2 sm:gap-4">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="border-white/30 text-white hover:bg-white/20 disabled:opacity-50 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="border-white/30 text-white hover:bg-white/20 disabled:opacity-50 text-xs sm:text-sm px-2 sm:px-4 py-2"
                >
                    Next
                </Button>
            </div>
        </Card>
    )
}
