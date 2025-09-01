"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, Users, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Information We Collect",
            content: [
                "Personal information (name, email, phone number)",
                "Account credentials and profile information",
                "Course progress and learning analytics",
                "Payment and billing information",
                "Communication preferences and settings"
            ]
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "How We Use Your Information",
            content: [
                "Provide and maintain our educational services",
                "Process payments and manage subscriptions",
                "Send important updates and notifications",
                "Improve our platform and user experience",
                "Comply with legal obligations"
            ]
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Data Protection",
            content: [
                "Industry-standard encryption protocols",
                "Secure data storage and transmission",
                "Regular security audits and updates",
                "Limited access to personal information",
                "Data retention policies"
            ]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Information Sharing",
            content: [
                "We do not sell your personal information",
                "Limited sharing with trusted service providers",
                "Compliance with legal requirements",
                "Protection of rights and safety",
                "With your explicit consent"
            ]
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Your Rights",
            content: [
                "Access and review your personal data",
                "Request corrections or updates",
                "Delete your account and data",
                "Opt-out of marketing communications",
                "Data portability rights"
            ]
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Contact Us",
            content: [
                "Email: career.nextbyteitinstitute@gmail.com",
                "Phone: 01718180373",
                "Address: Rangpur , Payra Chattar",
                "Response time: Within 48 hours",
                "Data Protection Officer available"
            ]
        }
    ]

    return (
        <div className="min-h-screen py-24 bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                Privacy Policy
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8"
                >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                        Your Privacy Matters
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        At NextByte, we are committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                        educational platform and services.
                    </p>
                </motion.div>

                {/* Policy Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    {section.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {section.title}
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {section.content.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 mt-8"
                >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                        Additional Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Cookies Policy</h4>
                            <p className="text-gray-700">
                                We use cookies to enhance your browsing experience and analyze site traffic.
                                You can control cookie settings through your browser preferences.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Third-Party Services</h4>
                            <p className="text-gray-700">
                                Our platform may integrate with third-party services for payment processing,
                                analytics, and communication. These services have their own privacy policies.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="text-center mt-8 pt-8 border-t border-gray-200"
                >
                    <p className="text-gray-600 text-sm sm:text-base">
                        If you have any questions about this Privacy Policy, please contact us at{" "}
                        <a href="mailto:career.nextbyteitinstitute@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                            career.nextbyteitinstitute@gmail.com
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
