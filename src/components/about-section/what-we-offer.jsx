"use client"

import { BookOpen, Users, Award, Zap, Target, Globe } from "lucide-react"

export function WhatWeOffer() {
    const offerings = [
        {
            icon: <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Expert-Led Courses",
            description: "Learn from industry professionals with years of experience in their respective fields.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Community Learning",
            description: "Join a community of learners, share experiences, and grow together.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Certification",
            description: "Earn recognized certificates upon course completion to boost your career.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Hands-on Projects",
            description: "Apply your learning through real-world projects and build a strong portfolio.",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Career Support",
            description: "Get guidance on career paths, job preparation, and industry insights.",
            color: "from-red-500 to-red-600"
        },
        {
            icon: <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
            title: "Global Access",
            description: "Learn from anywhere in the world with our flexible online platform.",
            color: "from-indigo-500 to-indigo-600"
        }
    ]

    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        What We <span className="gradient-text">Offer</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto">
                        Comprehensive tech education designed for real-world success
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {offerings.map((item, index) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 hover-lift transition-all duration-300"
                        >
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{item.title}</h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
