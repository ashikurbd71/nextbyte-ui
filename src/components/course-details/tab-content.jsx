"use client"

import { AnimatePresence, motion } from "framer-motion"
import OverviewTab from "./overview-tab"
import CurriculumTab from "./curriculum-tab"
import InstructorTab from "./instructor-tab"
import ReviewsTab from "./reviews-tab"

export default function TabContent({ activeTab, courseData, averageRating, totalLessons }) {
    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6">
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                    >
                        <OverviewTab courseData={courseData} />
                    </motion.div>
                )}

                {activeTab === 'curriculum' && (
                    <motion.div
                        key="curriculum"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                    >
                        <CurriculumTab courseData={courseData} totalLessons={totalLessons} />
                    </motion.div>
                )}

                {activeTab === 'instructor' && (
                    <motion.div
                        key="instructor"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                    >
                        <InstructorTab courseData={courseData} />
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div
                        key="reviews"
                        variants={tabVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                    >
                        <ReviewsTab courseData={courseData} averageRating={averageRating} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
