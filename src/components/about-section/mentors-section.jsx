"use client"

import { motion } from "framer-motion"
import { MentorCard } from "./mentor-card"
import { useState, useEffect } from "react"
import { getAllAdmins } from "@/app/apis/admin-apis/adminApis"

export function MentorsSection() {
    const [mentorsData, setMentorsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                setLoading(true)
                const result = await getAllAdmins()

                if (result.statusCode === 200 && result.data) {
                    // Transform API data to match our component structure
                    const transformedData = Array.isArray(result.data)
                        ? result.data.map(admin => ({
                            name: admin.name,
                            role: admin.designation || "Mentor",
                            image: admin.photoUrl,
                            experience: `${admin.experience || 0}+ Years`,
                            description: admin.bio || "Experienced professional with expertise in various technologies.",
                            achievements: [
                                `${admin.experience || 0}+ Years Experience`,
                                ...(admin.expertise || []).slice(0, 2)
                            ],
                            achievementColors: "from-blue-50 to-purple-50",
                            socialLinks: [
                                ...(admin.fbLink ? [{
                                    url: admin.fbLink,
                                    icon: "facebook",
                                    bgColor: "bg-blue-600",
                                    hoverColor: "bg-blue-700"
                                }] : []),
                                ...(admin.linkedinLink ? [{
                                    url: admin.linkedinLink,
                                    icon: "linkedin",
                                    bgColor: "bg-blue-700",
                                    hoverColor: "bg-blue-800"
                                }] : []),
                                ...(admin.instaLink ? [{
                                    url: admin.instaLink,
                                    icon: "instagram",
                                    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
                                    hoverColor: "from-purple-600 to-pink-600"
                                }] : [])
                            ]
                        }))
                        : [result.data].map(admin => ({
                            name: admin.name,
                            role: admin.designation || "Mentor",
                            image: admin.photoUrl,
                            experience: `${admin.experience || 0}+ Years`,
                            description: admin.bio || "Experienced professional with expertise in various technologies.",
                            achievements: [
                                `${admin.experience || 0}+ Years Experience`,
                                ...(admin.expertise || []).slice(0, 2)
                            ],
                            achievementColors: "from-blue-50 to-purple-50",
                            socialLinks: [
                                ...(admin.fbLink ? [{
                                    url: admin.fbLink,
                                    icon: "facebook",
                                    bgColor: "bg-blue-600",
                                    hoverColor: "bg-blue-700"
                                }] : []),
                                ...(admin.linkedinLink ? [{
                                    url: admin.linkedinLink,
                                    icon: "linkedin",
                                    bgColor: "bg-blue-700",
                                    hoverColor: "bg-blue-800"
                                }] : []),
                                ...(admin.instaLink ? [{
                                    url: admin.instaLink,
                                    icon: "instagram",
                                    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
                                    hoverColor: "from-purple-600 to-pink-600"
                                }] : [])
                            ]
                        }))

                    setMentorsData(transformedData)
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (err) {
                console.error('Error fetching mentors:', err)
                setError(err.message)

            } finally {
                setLoading(false)
            }
        }

        fetchMentors()
    }, [])

    if (loading) {
        return (
            <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
            >
                <div className="text-center mb-12">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
                        Our <span className="gradient-text">Expert Mentors</span>
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
                        Learn from industry experts with years of experience in tech education and development.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-80"></div>
                        </div>
                    ))}
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
        >
            <div className="text-center mb-12">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-4">
                    Our <span className="gradient-text">Expert Mentors</span>
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
                    Learn from industry experts with years of experience in tech education and development.
                </p>
                {error && (
                    <p className="text-sm text-red-500 mt-2">
                        Note: Using fallback data due to connection issues
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentorsData.map((mentor, index) => (
                    <MentorCard
                        key={mentor.name || index}
                        mentor={mentor}
                        delay={0.3 + (index * 0.1)}
                    />
                ))}
            </div>
        </motion.div>
    )
}
