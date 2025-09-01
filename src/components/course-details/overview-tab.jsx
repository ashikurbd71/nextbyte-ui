"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function OverviewTab({ courseData }) {
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
            {/* What you'll learn */}
            {courseData.whatYouWillLearn && courseData.whatYouWillLearn.length > 0 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
                        What you&apos;ll learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-3">
                        {courseData.whatYouWillLearn.map((outcome, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start space-x-2 sm:space-x-3"
                            >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                                    {outcome}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Technology Stack */}
            {courseData.technologies && courseData.technologies.length > 0 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
                        Technologies You&apos;ll Master
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        {courseData.technologies.map((tech, index) => (
                            <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 lg:p-4 text-center hover:bg-white/20 transition-colors"
                            >
                                {tech.image && isValidImageUrl(tech.image) ? (
                                    <Image
                                        src={tech.image}
                                        alt={tech.name}
                                        width={40}
                                        height={40}
                                        className="mx-auto mb-2"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'block'
                                        }}
                                    />
                                ) : null}
                                <div className="text-lg sm:text-xl lg:text-2xl mb-1 lg:mb-2" style={{ display: tech.image && isValidImageUrl(tech.image) ? 'none' : 'block' }}>
                                    💻
                                </div>
                                <h4 className="text-white font-semibold text-xs sm:text-sm lg:text-base">
                                    {tech.name}
                                </h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Course Requirements */}
            {courseData.requirements && courseData.requirements.length > 0 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
                        Requirements
                    </h3>
                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 lg:p-4">
                        <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm lg:text-base">
                            {courseData.requirements.map((requirement, index) => (
                                <li key={index}>• {requirement}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
