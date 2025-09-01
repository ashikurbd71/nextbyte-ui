"use client"

import { motion } from "framer-motion"
import { Award, Facebook, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"

export function CEOSection() {
    return (
        <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover-lift transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* CEO Image Section */}
                    <div className="relative h-full overflow-hidden">
                        <Image
                            src="/ceo.png"
                            alt="Hafiz - CEO & Founder"
                            height={480}
                            width={500}
                            className="object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                        {/* Experience badge */}
                        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                            <span className="text-xs sm:text-sm font-bold text-gray-800">3+ Years Experience</span>
                        </div>
                    </div>

                    {/* CEO Content Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-6">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Hafiz</h3>
                            <p className="text-lg sm:text-xl lg:text-2xl text-[#3f03ed] font-semibold">CEO & Founder</p>
                        </div>

                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                            Passionate tech educator with 3+ years of experience in digital education. Leading NextByte's mission to democratize tech education and empower students worldwide.
                        </p>

                        {/* Achievements */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {["5K+ Students", "7+ Courses", "Industry Expert"].map((achievement, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200"
                                >
                                    <Award className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs sm:text-sm font-semibold text-blue-700">{achievement}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social Media Links */}
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/sm.hafiz10" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-300 group">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://linkedin.com/company/nextbyte" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full transition-colors duration-300 group">
                                <Linkedin className="w-5 h-5 text-white" />
                            </a>
                            <a href="https://www.instagram.com/sm.hafiz10?igsh=MWM2cWh1anZ6Z2Rjbw%3D%3D&utm_source=qr " target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors duration-300 group">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
