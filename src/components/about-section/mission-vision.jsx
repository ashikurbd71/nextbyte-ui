"use client"

import { Target, Globe } from "lucide-react"

export function MissionVision() {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                    {/* Mission */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                            <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h3>
                        <p className="text-md text-gray-700 leading-relaxed">
                            To democratize tech education by providing accessible, high-quality courses that empower individuals
                            to build successful careers in technology. We're committed to bridging the gap between traditional
                            education and industry demands.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                            <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Vision</h3>
                        <p className="text-md text-gray-700 leading-relaxed">
                            To become the world's most trusted platform for tech education, where millions of learners
                            can acquire the skills they need to thrive in the digital economy and contribute to global innovation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
