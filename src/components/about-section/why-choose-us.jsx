"use client"

import { CheckCircle, Star } from "lucide-react"

export function WhyChooseUs() {
    const features = [
        "Industry-aligned curriculum designed by experts",
        "Flexible learning schedule that fits your lifestyle",
        "Hands-on projects with real-world applications",
        "Lifetime access to course materials and updates",
        "Active community support and networking opportunities",
        "Career guidance and job placement assistance"
    ]

    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Why Choose <span className="gradient-text">NextByte</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto">
                        Discover what makes us the preferred choice for tech education
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    <div className="space-y-4 sm:space-y-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 sm:gap-4"
                            >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <p className="text-sm sm:text-base md:text-lg text-gray-700">{feature}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Success Rate</h3>
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">95%</div>
                            <p className="text-sm sm:text-base text-gray-600">of our students report career advancement within 6 months of completing our courses</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
