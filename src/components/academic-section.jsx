"use client"

import { FileText, Calculator, Award, Clock, BookOpen, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function AcademicSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const academicFeatures = [
        {
            icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
            title: "Final Exam Routine Download",
            description: "Download your final exam routine from our website per department and semester",
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50",
            status: "active"
        },
        {
            icon: <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
            title: "Final Exam Results",
            description: "View and track your final exam results with detailed analytics and performance insights",
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            status: "active"
        },

        {
            icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />,
            title: "Study Planner",
            description: "Personalized study plans and schedules to optimize your learning journey",
            color: "from-orange-500 to-red-500",
            bgColor: "from-orange-50 to-red-50",

        },

    ]

    return (
        <section id="academic" className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
                <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
                        Our <span className="gradient-text">Academic</span> Tools
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
                        Comprehensive academic tools to enhance your learning experience and track your progress
                    </p>
                </motion.div>

                <motion.div
                    ref={ref}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                >
                    {academicFeatures.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Glass morphism card */}
                            <div className={`relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.bgColor} border border-gray-200/50 backdrop-blur-sm hover-lift group-hover:shadow-2xl transition-all duration-300 h-full ${feature.status === 'coming-soon' ? 'opacity-75' : ''}`}>
                                {/* Icon with enhanced styling */}
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md`}></div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                                            {feature.title}
                                        </h3>
                                        {feature.status === 'coming-soon' && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Animated border */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>

                                {/* Coming soon overlay */}
                                {feature.status === 'coming-soon' && (
                                    <div className="absolute inset-0 bg-gray-900/20 rounded-xl sm:rounded-2xl backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Coming Soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Floating particles */}
                            <motion.div
                                className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-8 sm:mt-12 md:mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        <span className="text-xs sm:text-sm font-medium text-indigo-700">
                            Coming Soon three more tools to enhance your learning experience
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
