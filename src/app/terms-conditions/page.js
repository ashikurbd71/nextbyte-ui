"use client"

import { motion } from "framer-motion"
import { FileText, Scale, Shield, Users, CreditCard, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function TermsConditions() {
    const sections = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Acceptance of Terms",
            content: [
                "By accessing and using NextByte, you accept and agree to be bound by these terms",
                "These terms apply to all users, including students, instructors, and visitors",
                "We reserve the right to modify these terms at any time",
                "Continued use after changes constitutes acceptance of new terms",
                "You must be at least 13 years old to use our services"
            ]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "User Accounts",
            content: [
                "You are responsible for maintaining account security",
                "Provide accurate and complete registration information",
                "Notify us immediately of any unauthorized access",
                "One account per person - no sharing allowed",
                "We may terminate accounts for violations"
            ]
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Payment Terms",
            content: [
                "Course fees are charged in advance of access",
                "All payments are non-refundable unless stated otherwise",
                "We accept major credit cards and digital payments",
                "Prices may change with 30 days notice",
                "Subscription billing occurs on recurring basis"
            ]
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Intellectual Property",
            content: [
                "Course content is owned by NextByte and instructors",
                "Personal use only - no redistribution allowed",
                "No copying, sharing, or commercial use of content",
                "Respect copyright and trademark rights",
                "User-generated content remains your property"
            ]
        },
        {
            icon: <AlertTriangle className="w-6 h-6" />,
            title: "Prohibited Activities",
            content: [
                "No harassment, abuse, or discriminatory behavior",
                "No sharing of course materials with non-enrolled users",
                "No attempts to circumvent security measures",
                "No commercial use of platform without permission",
                "No violation of applicable laws or regulations"
            ]
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Limitation of Liability",
            content: [
                "NextByte is not liable for indirect or consequential damages",
                "Maximum liability limited to amount paid for services",
                "No warranty for uninterrupted or error-free service",
                "We are not responsible for third-party content",
                "Force majeure events may affect service availability"
            ]
        }
    ]

    const additionalTerms = [
        {
            title: "Privacy and Data",
            content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information."
        },
        {
            title: "Dispute Resolution",
            content: "Any disputes will be resolved through binding arbitration in accordance with the laws of California, United States."
        },
        {
            title: "Governing Law",
            content: "These terms are governed by the laws of California, United States, without regard to conflict of law principles."
        },
        {
            title: "Severability",
            content: "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
        }
    ]

    return (
        <div className="min-h-screen py-24 bg-gradient-to-br from-slate-50 to-green-50">
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
                                Terms & Conditions
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Scale className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            Legal Agreement
                        </h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        These Terms and Conditions govern your use of NextByte&apos;s educational platform and services.
                        By using our platform, you agree to these terms. Please read them carefully before proceeding.
                    </p>
                </motion.div>

                {/* Main Terms Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                    {section.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {section.title}
                                </h3>
                            </div>
                            <ul className="space-y-2">
                                {section.content.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Terms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 mb-8"
                >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                        Additional Terms
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {additionalTerms.map((term, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 sm:p-6">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                                    {term.title}
                                </h4>
                                <p className="text-gray-700 text-sm sm:text-base">
                                    {term.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Important Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 sm:p-8 mb-8"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                Important Notice
                            </h3>
                            <p className="text-yellow-700 text-sm sm:text-base">
                                These terms constitute a legally binding agreement. By using NextByte&apos;s services,
                                you acknowledge that you have read, understood, and agree to be bound by these terms.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
                >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                        Questions About These Terms?
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-4">
                        If you have any questions or concerns about these Terms and Conditions,
                        please don&apos;t hesitate to contact us.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm sm:text-base">
                        <a
                            href="mailto:career.nextbyteitinstitute@gmail.com"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            career.nextbyteitinstitute@gmail.com
                        </a>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">01718180373</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">Rangpur , Payra Chattar</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

