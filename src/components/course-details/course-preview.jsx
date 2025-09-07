"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"
import { YouTubePlayer, extractYouTubeVideoId } from "@/components/ui/youtube-player"

export default function CoursePreview({ courseData }) {
    // Extract video ID from the promo video URL
    const videoId = courseData.promoVideoUrl ? extractYouTubeVideoId(courseData.promoVideoUrl) : null

    console.log("Video ID:", videoId)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 sm:mb-6 lg:mb-8"
        >
            <Card className="bg-black/20 backdrop-blur-xl p-5  border-white/20 overflow-hidden">
                <div className="relative aspect-video  bg-black">
                    {videoId ? (
                        <YouTubePlayer
                            videoId={videoId}
                            className="w-full  h-full"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="text-center">
                                <Play className="w-12 h-12 text-white/60 mx-auto mb-4" />
                                <p className="text-white/60">Preview video not available</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    )
}
