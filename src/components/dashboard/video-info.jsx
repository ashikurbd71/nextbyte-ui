"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bookmark, ThumbsUp, ThumbsDown } from "lucide-react"

export function VideoInfo({ currentLesson, currentModule, formatDuration }) {
    return (
        <Card className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-xl border-white/20">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                            {currentLesson?.title || "Select a lesson"}
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base">
                            {currentModule?.title} • {formatDuration(currentLesson?.duration)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                            <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                            <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                            <ThumbsDown className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                    {currentLesson?.description || "No description available"}
                </p>
            </div>
        </Card>
    )
}
