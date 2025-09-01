"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, User, Mail, MessageSquare, Phone, Building, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"

export function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                company: "",
                subject: "",
                message: ""
            })
        }, 3000)
    }

    const formFields = [
        { name: "firstName", label: "First Name", icon: <User className="w-4 h-4" />, required: true },
        { name: "lastName", label: "Last Name", icon: <User className="w-4 h-4" />, required: true },
        { name: "email", label: "Email Address", icon: <Mail className="w-4 h-4" />, type: "email", required: true },
        { name: "phone", label: "Phone Number", icon: <Phone className="w-4 h-4" />, type: "tel" },
        { name: "company", label: "Company", icon: <Building className="w-4 h-4" /> },
        { name: "subject", label: "Subject", icon: <MessageSquare className="w-4 h-4" />, required: true }
    ]

    if (isSubmitted) {
        return (
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        className="text-center bg-green-50 border border-green-200 rounded-3xl p-8 sm:p-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-900 mb-4">Message Sent Successfully!</h3>
                        <p className="text-green-700 text-lg">
                            Thank you for reaching out to us. We'll get back to you within 24 hours.
                        </p>
                    </motion.div>
                </div>
            </section>
        )
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
                        Send Us a <span className="gradient-text">Message</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Have a question or want to learn more about our courses? Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Form */}
                        <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {formFields.slice(0, 2).map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <div className="text-gray-400">
                                                        {field.icon}
                                                    </div>
                                                </div>
                                                <input
                                                    type={field.type || "text"}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    required={field.required}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {formFields.slice(2).map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <div className="text-gray-400">
                                                    {field.icon}
                                                </div>
                                            </div>
                                            <input
                                                type={field.type || "text"}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                required={field.required}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                                        placeholder="Tell us about your inquiry or what you'd like to learn..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Message...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Info Panel */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 sm:p-6 lg:p-8 xl:p-12 text-white">
                            <div className="h-full flex flex-col justify-center">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Get in Touch</h3>
                                <p className="text-white/80 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                                    Ready to start your tech journey? Our team is here to help you choose the right course and answer any questions you might have.
                                </p>

                                                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-sm sm:text-base">Email Support</h4>
                                            <p className="text-white/70 text-xs sm:text-sm">We respond within 24 hours</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-sm sm:text-base">Phone Support</h4>
                                            <p className="text-white/70 text-xs sm:text-sm">Available during business hours</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-sm sm:text-base">Live Chat</h4>
                                            <p className="text-white/70 text-xs sm:text-sm">Get instant help online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
