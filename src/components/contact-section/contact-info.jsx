"use client"

import { getDashboardStatistics } from "@/app/apis/statistics-apis/statisticsApis"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Award, Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function ContactInfo() {
    const contactDetails = [
        {
            icon: <Mail className="w-5 h-5" />,
            title: "Email Address",
            primary: "career.nextbyteitinstitute@gmail.com",
            secondary: "support@nextbyteitinstitute.com",
            description: "We typically respond within 24 hours"
        },
        {
            icon: <Phone className="w-5 h-5" />,
            title: "Phone Number",
            primary: "01718180373",
            secondary: "01581782193",
            description: "Available Monday-Friday, 9AM-6PM BDT"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            title: "Office Location",
            primary: "Rangpur , Pyra Chattar",
            secondary: "Rangpur, Bangladesh",
            description: "Visit us during business hours"
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Business Hours",
            primary: "Monday - Friday",
            secondary: "9:00 AM - 6:00 PM BDT",
            description: "Weekend support available online"
        }
    ]
    const [companyStats, setCompanyStats] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await getDashboardStatistics()
            setCompanyStats(response)
        }
        fetchData()
    }, [])


    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Contact <span className="gradient-text">Information</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Get in touch with our team through any of these channels. We're here to help you succeed in your tech journey.
                    </p>
                </motion.div>

                {/* Contact Details Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {contactDetails.map((detail, index) => (
                        <motion.div
                            key={detail.title}
                            className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4">
                                {detail.icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{detail.title}</h3>
                            <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base">{detail.primary}</p>
                            <p className="text-gray-600 text-xs sm:text-sm mb-2">{detail.secondary}</p>
                            <p className="text-gray-500 text-xs sm:text-sm">{detail.description}</p>
                        </motion.div>
                    ))}
                </motion.div>


            </div>
        </section >
    )
}
