"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles, Zap, Target, Star, Heart, BookOpen, Code, Rocket, Globe, Lightbulb, CheckCircle } from "lucide-react"
import { YouTubePlayer, YouTubeThumbnailPlayer, extractYouTubeVideoId } from "./ui/youtube-player"
import Link from "next/link"

export function HeroSection() {
    // Extract video ID from the YouTube URL
    const videoUrl = "https://youtu.be/eHGVk9UpX1Q"
    const videoId = extractYouTubeVideoId(videoUrl)

    console.log("Hero Video ID:", videoId)

    const handleYoutubeLink = () => {
        window.open('/public/videoimage.jpg', '_blank')
    }

    return (
        <section className="relative min-h-screen 2xl:py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Dotted background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            {/* Floating background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Enhanced Floating Icons */}
            <motion.div
                className="absolute top-6 sm:top-10 right-6 sm:right-10 text-white opacity-30"
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>

            <motion.div
                className="absolute top-1/3 left-6 sm:left-10 text-white opacity-30"
                animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </motion.div>

            <motion.div
                className="absolute bottom-16 sm:bottom-20 right-6 sm:right-10 md:right-32 text-white opacity-30"
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Target className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </motion.div>

            {/* Additional Animated Icons */}
            <motion.div
                className="absolute top-1/4 right-1/4 text-white opacity-20"
                animate={{
                    y: [0, -8, 0],
                    rotate: [0, 360, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute bottom-1/3 left-1/4 text-white opacity-25"
                animate={{
                    y: [0, 12, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute top-1/2 right-1/3 text-white opacity-20"
                animate={{
                    y: [0, -6, 0],
                    rotate: [0, -180, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute bottom-1/4 left-1/3 text-white opacity-25"
                animate={{
                    y: [0, 8, 0],
                    scale: [1, 0.8, 1]
                }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
                <Code className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute top-2/3 right-1/5 text-white opacity-20"
                animate={{
                    y: [0, -12, 0],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute bottom-1/2 left-1/5 text-white opacity-25"
                animate={{
                    y: [0, 10, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, -90, 0]
                }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <motion.div
                className="absolute top-3/4 right-1/6 text-white opacity-20"
                animate={{
                    y: [0, -8, 0],
                    scale: [1, 0.9, 1],
                    rotate: [0, 180, 0]
                }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            >
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </motion.div>

            <div className=" max-w-[95%] mx-auto py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    {/* Left Column - Text Content */}
                    <motion.div
                        className="text-center lg:text-left order-2 pt-10 lg:pt-0 lg:order-1"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-white/30"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            <span className="text-xs sm:text-sm font-medium text-white">
                                Beyond Skills, Into the Future
                            </span>
                        </motion.div>

                        <motion.h1
                            className="lg:text-4xl 2xl:text-5xl text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Learn Digital Skills With <br />

                            <span className="text-yellow-400">  NextByte IT</span>
                        </motion.h1>

                        <motion.p
                            className="text-base md:text-md lg:text-md xl:text-md 2xl:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            NextByte is working to firmly
                            establish the core concepts of technology. <span className="text-yellow-400">NextByte IT</span> Where Skill Meet The Future 🚀.
                        </motion.p>



                        <motion.div
                            className="py-10 lg:hidden block lg:pt-0"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Glowing Border Frame with Floating Animation */}
                            <motion.div
                                className="relative p-1 bg-gradient-to-r from-white/20 via-purple-500/30 to-pink-500/30 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg mx-auto lg:max-w-none"
                                animate={{
                                    y: [0, -10, 0],
                                    scale: [1, 1.02, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="relative bg-gradient-to-br from-purple-900/80 to-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 border border-white/10">
                                    {/* Video Container Only */}
                                    <div className="relative">
                                        <div className="aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/20">
                                            <YouTubePlayer
                                                videoId={videoId}
                                                onStateChange={(event) => {
                                                    console.log('Hero player state changed:', event.data)
                                                }}
                                            />
                                        </div>

                                        {/* Dynamic Light Effects */}
                                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                                        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Course List */}
                        <motion.div
                            className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">Web Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">Graphics Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">Video Editing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">IoT Development</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">Programing</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base">Digital Marketing</span>
                            </div>
                            {/* <div className="flex items-center gap-3 sm:col-span-2">
                                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                <span className="text-white text-sm sm:text-base"> Department Courses</span>
                            </div> */}
                        </motion.div>


                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring w-full sm:w-auto"
                                onClick={() => {
                                    const coursesSection = document.getElementById('courses');
                                    if (coursesSection) {
                                        coursesSection.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }
                                }}
                            >
                                View Course
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>


                            <Button
                                size="lg"
                                onClick={() => {
                                    window.open('https://www.youtube.com/@NextByteItInstitute', '_blank')
                                }}
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-slate-900 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-ring w-full sm:w-auto"
                            >
                                <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                                View Free Course
                            </Button>


                        </motion.div>

                        {/* Trust indicators */}

                    </motion.div>

                    {/* Right Column - Video Only */}
                    <motion.div
                        className="order-1 pt-12 lg:block hidden lg:pt-0 lg:order-2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Glowing Border Frame with Floating Animation */}
                        <motion.div
                            className="relative p-1 bg-gradient-to-r from-white/20 via-purple-500/30 to-pink-500/30 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg mx-auto lg:max-w-none"
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="relative bg-gradient-to-br from-purple-900/80 to-slate-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-2 border border-white/10">
                                {/* Video Container Only */}
                                <div className="relative">
                                    <div className="aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/20">
                                        <YouTubePlayer
                                            videoId={videoId}
                                            onStateChange={(event) => {
                                                console.log('Hero player state changed:', event.data)
                                            }}
                                        />
                                    </div>

                                    {/* Dynamic Light Effects */}
                                    <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section >
    )
}
