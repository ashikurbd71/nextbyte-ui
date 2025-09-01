"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"

export default function ReviewsTab({ courseData, averageRating }) {
    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    // Helper function to validate image URL
    const isValidImageUrl = (url) => {
        if (!url) return false
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    return (
        <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="space-y-4 sm:space-y-6"
        >
            {/* Review Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Student Reviews</h3>
                <div className="text-center sm:text-right">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center sm:justify-end space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${star <= averageRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                        {courseData.reviews?.length || 0} reviews
                    </div>
                </div>
            </div>

            {/* Reviews */}
            {courseData.reviews && courseData.reviews.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                    {courseData.reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 mx-auto sm:mx-0">
                                    {review.user.photoUrl && isValidImageUrl(review.user.photoUrl) ? (
                                        <Image
                                            src={review.user.photoUrl}
                                            alt={review.user.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none'
                                                e.target.nextSibling.style.display = 'flex'
                                            }}
                                        />
                                    ) : null}
                                    <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ display: review.user.photoUrl && isValidImageUrl(review.user.photoUrl) ? 'none' : 'flex' }}>
                                        {review.user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1 sm:mb-2">
                                        <h4 className="text-white font-semibold text-xs sm:text-sm lg:text-base">
                                            {review.user.name}
                                        </h4>
                                        <span className="hidden sm:inline text-gray-400">•</span>
                                        <span className="text-purple-400 text-xs sm:text-sm lg:text-base">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start space-x-1 mb-2 sm:mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 ${star <= review.rating
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-300 py-8">
                    <Star className="w-12 h-12 mx-auto mb-4 text-white/30" />
                    <p>No reviews yet</p>
                </div>
            )}
        </motion.div>
    )
}
