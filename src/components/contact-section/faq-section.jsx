"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, BookOpen, Users, CreditCard, Shield, Clock, Award } from "lucide-react"

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: "What courses do you offer?",
            answer: "We offer a comprehensive range of tech courses including Frontend Engineering, Graphic Design, Logo Design, Video Editing, and many more. Our curriculum is designed to help you build practical skills for today's job market.",
            icon: <BookOpen className="w-5 h-5" />
        },
        {
            question: "How long does it take to complete a course?",
            answer: "Course duration varies depending on the program. Most courses take 8-12 weeks to complete, with flexible learning schedules that allow you to study at your own pace. You can access course materials 24/7.",
            icon: <Clock className="w-5 h-5" />
        },
        {
            question: "Do you offer certificates upon completion?",
            answer: "Yes! All our courses come with a professional certificate upon successful completion. Our certificates are recognized by industry professionals and can be added to your LinkedIn profile and resume.",
            icon: <Award className="w-5 h-5" />
        },
        {
            question: "What kind of support do you provide?",
            answer: "We provide comprehensive support including 24/7 access to course materials, dedicated instructor support, peer community forums, and technical assistance. Our team is always here to help you succeed.",
            icon: <Users className="w-5 h-5" />
        },
        {
            question: "What payment options do you accept?",
            answer: "We accept all major credit cards, PayPal, and offer flexible payment plans. We also provide installment options to make our courses more accessible. All payments are secure and encrypted.",
            icon: <CreditCard className="w-5 h-5" />
        },
        {
            question: "Is my data secure with NextByte?",
            answer: "Absolutely! We take data security seriously. All your personal information and course progress are encrypted and stored securely. We never share your data with third parties without your explicit consent.",
            icon: <Shield className="w-5 h-5" />
        },
        {
            question: "Can I get a refund if I'm not satisfied?",
            answer: "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your course within the first 30 days, we'll provide a full refund, no questions asked.",
            icon: <HelpCircle className="w-5 h-5" />
        },
        {
            question: "Do you offer job placement assistance?",
            answer: "While we don't guarantee job placement, we provide extensive career support including resume building workshops, interview preparation, portfolio development, and networking opportunities with industry professionals.",
            icon: <Users className="w-5 h-5" />
        }
    ]

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Find answers to the most common questions about our courses, learning platform, and support services.
                    </p>
                </motion.div>

                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                            >
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        {faq.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                                            {faq.question}
                                        </h3>
                                    </div>
                                </div>
                                <div className="ml-2 sm:ml-4 flex-shrink-0">
                                    <ChevronDown
                                        className={`w-4 h-4 sm:w-6 sm:h-6 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                                            <div className="pl-11 sm:pl-14">
                                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    className="mt-8 sm:mt-12 lg:mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 sm:p-8 lg:p-12 border border-blue-100">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Still Have Questions?
                        </h3>
                        <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base px-4">
                            Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base">
                                Contact Support
                            </button>
                            <button 
                                onClick={() => {
                                    if (window.location.pathname === '/') {
                                        // If on home page, scroll to courses section
                                        const coursesSection = document.getElementById('courses')
                                        if (coursesSection) {
                                            coursesSection.scrollIntoView({ behavior: 'smooth' })
                                        }
                                    } else {
                                        // If on contact page, navigate to home page with courses anchor
                                        window.location.href = '/#courses'
                                    }
                                }}
                                className="border border-gray-300 hover:border-gray-400 text-gray-700 py-2 sm:py-3 px-6 sm:px-8 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
                            >
                                View All Courses
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
