"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from 'sonner'

export default function ReviewModal({ isOpen, onClose, course, onSubmit, hasReviewed = false }) {
    const { user } = useAuth()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hoveredRating, setHoveredRating] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }
        if (!comment.trim()) {
            toast.error("Please enter a comment")
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit({
                rating,
                comment: comment.trim(),
                courseId: 7,
                userId: user?.id  // Use actual user ID from auth context
            })
            handleClose()
        } catch (error) {
            console.error("Error submitting review:", error)

            // Handle specific error messages from the API
            if (error.message && error.message.includes("already reviewed")) {
                toast.error("You have already reviewed this course!")
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error("Failed to submit review. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setRating(0)
        setComment("")
        setHoveredRating(0)
        onClose()
    }

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1
            const isFilled = starValue <= (hoveredRating || rating)

            return (
                <button
                    key={`star-${starValue}`}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 transform hover:scale-110"
                >
                    <Star
                        className={`w-8 h-8 ${isFilled
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                            }`}
                    />
                </button>
            )
        })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md"
                    >
                        <Card className="bg-white/95 backdrop-blur-xl border-white/20 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {hasReviewed ? "Update Review" : "Write a Review"}
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {course && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        {course?.course?.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        by {course?.course?.instructor?.name}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Rating
                                    </label>
                                    <div className="flex justify-center space-x-2">
                                        {renderStars()}
                                    </div>
                                    {rating > 0 && (
                                        <p className="text-center text-sm text-gray-600 mt-2">
                                            You rated this course {rating} star{rating > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comment
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience with this course..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {comment.length}/500
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 text-white"
                                        disabled={isSubmitting || rating === 0 || !comment.trim()}
                                    >
                                        {isSubmitting ? "Submitting..." : hasReviewed ? "Update Review" : "Submit Review"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
