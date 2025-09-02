"use client"

import { motion } from "framer-motion"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllCourses } from "@/app/apis/course-apis/courseApis"
import { useRouter } from "next/navigation"

export function Footer() {
    const router = useRouter()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCourses()
                // Take first 4 courses for footer display
                const footerCourses = response?.data?.slice(0, 4) || []
                setCourses(footerCourses)
            } catch (error) {
                console.error('Error fetching courses for footer:', error)
                // Fallback to default courses if API fails
                setCourses([
                    { id: 1, name: "Frontend Engineering", slugName: "frontend-engineering" },
                    { id: 2, name: "Graphic Design", slugName: "graphic-design" },
                    { id: 3, name: "Logo Design", slugName: "logo-design" },
                    { id: 4, name: "Video Editing", slugName: "video-editing" },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const handleCourseClick = (course) => {
        const params = new URLSearchParams({
            id: course.id,
            title: course.name,
            slug: course.slugName,
        })
        router.push(`/course-details?${params.toString()}`)
    }

    const footerLinks = {
        company: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
        support: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms & Conditions", href: "/terms-conditions" },
        ],
    }

    const socialLinks = [
        { icon: <Facebook className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />, href: "https://www.facebook.com/nextbyteitinstitute", label: "Facebook", color: "hover:bg-blue-600" },
        // { icon: <Twitter className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
        // { icon: <Instagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
        // { icon: <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
        // { icon: <Github className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />, href: "#", label: "GitHub", color: "hover:bg-gray-800" },
    ]

    const contactInfo = [
        { icon: <Mail className="w-3 h-3 sm:w-4 sm:h-4" />, text: "career.nextbyteitinstitute@gmail.com", href: "mailto:career.nextbyteitinstitute@gmail.com" },
        { icon: <Phone className="w-3 h-3 sm:w-4 sm:h-4" />, text: "01718180373", href: "tel:01718180373" },
        { icon: <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />, text: "Rangpur , Pyra Chattar", href: "#" },
    ]

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
            {/* Dotted background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
                    {/* Brand section */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="mb-3 sm:mb-4">
                            <Image
                                src="/whitelogo.png"
                                alt="NextByte"
                                width={80}
                                height={32}
                                className="h-8 sm:h-10 w-auto"
                            />
                        </div>
                        <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base">
                            Empowering the next generation of tech professionals through quality education.
                            Join thousands of students building their tech careers with our expert-led courses.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-2 sm:space-y-3">
                            {contactInfo.map((contact, index) => (
                                <motion.a
                                    key={contact.text}
                                    href={contact.href}
                                    className="flex items-center gap-2 sm:gap-3 text-white/80 hover:text-white transition-all duration-300 text-xs sm:text-sm md:text-base"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white">
                                        {contact.icon}
                                    </div>
                                    <span>{contact.text}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Courses section - Dynamic from API */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Popular Courses</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 4 }).map((_, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                                    </motion.li>
                                ))
                            ) : (
                                courses.map((course, index) => (
                                    <motion.li
                                        key={course.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <button
                                            onClick={() => handleCourseClick(course)}
                                            className="text-white/80 hover:text-yellow-300 transition-all duration-300 hover-lift cursor-pointer text-xs sm:text-sm md:text-base text-left w-full"
                                        >
                                            {course.name}
                                        </button>
                                    </motion.li>
                                ))
                            )}
                        </ul>
                    </motion.div>

                    {/* Company section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Company</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-yellow-300 transition-all duration-300 hover-lift cursor-pointer text-xs sm:text-sm md:text-base"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Support</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {footerLinks.support.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-yellow-300 transition-all duration-300 hover-lift cursor-pointer text-xs sm:text-sm md:text-base"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Social links */}
                <motion.div
                    className="flex justify-center mb-4 sm:mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover-lift ${social.color}`}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom section */}
                <motion.div
                    className="border-t border-white/20 pt-4 sm:pt-6 md:pt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <p className="text-white/80 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm md:text-base">
                        <span>&copy; 2024 NextByte. All rights reserved.</span>
                        <span className="flex items-center gap-1">
                            Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" /> for the tech community
                        </span>
                    </p>
                    <p className="text-white/60 text-xs sm:text-sm mt-2">
                        <a
                            href="https://innowavesolution.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-yellow-300 transition-colors duration-300"
                        >
                            Developed by InnoWave Solution
                        </a>
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}
