"use client"

import { useEffect, useRef, useState } from "react"

// Global flag to prevent multiple API loads
let isYouTubeAPILoading = false
let isYouTubeAPIReady = false

// YouTube Player Component
export function
    YouTubePlayer({ videoId, onStateChange, className = "w-full h-full" }) {
    const playerRef = useRef(null)
    const iframeRef = useRef(null)
    const [isPlayerReady, setIsPlayerReady] = useState(false)

    useEffect(() => {
        let isMounted = true

        // Load YouTube API only once
        const loadYouTubeAPI = () => {
            return new Promise((resolve) => {
                if (isYouTubeAPIReady) {
                    resolve()
                    return
                }

                if (isYouTubeAPILoading) {
                    // Wait for existing load to complete
                    const checkReady = () => {
                        if (isYouTubeAPIReady) {
                            resolve()
                        } else {
                            setTimeout(checkReady, 100)
                        }
                    }
                    checkReady()
                    return
                }

                isYouTubeAPILoading = true

                if (!window.YT) {
                    const tag = document.createElement('script')
                    tag.src = "https://www.youtube.com/iframe_api"
                    const firstScriptTag = document.getElementsByTagName('script')[0]
                    if (firstScriptTag && firstScriptTag.parentNode) {
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
                    }
                }

                window.onYouTubeIframeAPIReady = () => {
                    isYouTubeAPIReady = true
                    isYouTubeAPILoading = false
                    resolve()
                }
            })
        }

        // Initialize player
        const initializePlayer = async () => {
            try {
                await loadYouTubeAPI()

                if (!isMounted || !videoId || !iframeRef.current) return

                if (window.YT && window.YT.Player) {
                    playerRef.current = new window.YT.Player(iframeRef.current, {
                        videoId: videoId,
                        playerVars: {
                            autoplay: 0, // Changed from 1 to 0 to disable auto-play
                            mute: 0,
                            controls: 1,
                            rel: 0,
                            loop: 1,
                            playlist: videoId,
                            enablejsapi: 1,
                            origin: window.location.origin
                        },
                        events: {
                            onReady: () => {
                                if (isMounted) setIsPlayerReady(true)
                            },
                            onStateChange: (event) => {
                                if (!isMounted) return

                                if (event.data === window.YT.PlayerState.ENDED) {
                                    event.target.playVideo()
                                }
                                if (onStateChange) {
                                    onStateChange(event)
                                }
                            }
                        }
                    })
                }
            } catch (error) {
                console.error('Error initializing YouTube player:', error)
            }
        }

        initializePlayer()

        // Cleanup
        return () => {
            isMounted = false
            if (playerRef.current && playerRef.current.destroy) {
                try {
                    playerRef.current.destroy()
                } catch (error) {
                    console.error('Error destroying YouTube player:', error)
                }
            }
        }
    }, [videoId, onStateChange])

    return (
        <div
            ref={iframeRef}
            className={className}
        />
    )
}

// YouTube Thumbnail Player Component with Play Button Overlay
export function YouTubeThumbnailPlayer({ videoId, onStateChange, className = "w-full h-full", thumbnailQuality = "maxresdefault" }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const playerRef = useRef(null)
    const iframeRef = useRef(null)

    // Generate thumbnail URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`

    useEffect(() => {
        // Load YouTube API
        if (!window.YT) {
            const tag = document.createElement('script')
            tag.src = "https://www.youtube.com/iframe_api"
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        }

        // Initialize player when API is ready
        const onYouTubeIframeAPIReady = () => {
            if (window.YT && window.YT.Player && videoId && isPlaying) {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        mute: 0,
                        controls: 1,
                        rel: 0,
                        loop: 1,
                        playlist: videoId,
                        enablejsapi: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                // Restart video when it ends
                                event.target.playVideo()
                            }
                            if (onStateChange) {
                                onStateChange(event)
                            }
                        }
                    }
                })
            }
        }

        // Check if API is already loaded
        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady()
        } else {
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
        }

        // Cleanup
        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy()
            }
        }
    }, [videoId, onStateChange, isPlaying])

    const handlePlayClick = () => {
        setIsPlaying(true)
    }

    if (!isPlaying) {
        return (
            <div className={`relative ${className} cursor-pointer group`} onClick={handlePlayClick}>
                {/* Thumbnail Image */}
                <img
                    src={thumbnailUrl}
                    alt={`YouTube video thumbnail for ${videoId}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                        // Fallback to medium quality if maxresdefault fails
                        if (thumbnailQuality === "maxresdefault") {
                            e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                        }
                    }}
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
            </div>
        )
    }

    // Return the actual video player when playing
    return (
        <div
            ref={iframeRef}
            className={className}
        />
    )
}

// Helper function to extract YouTube video ID from URL
export function extractYouTubeVideoId(url) {
    if (!url) return null

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        /youtu\.be\/([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
            return match[1]
        }
    }

    return null
}
