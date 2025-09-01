"use client"

import { motion } from "framer-motion"
import { Award, Facebook, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"

export function MentorCard({ mentor, delay = 0 }) {
    const { name, role, image, experience, description, achievements, socialLinks, achievementColors } = mentor

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover-lift transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            viewport={{ once: true }}
        >
            <div className="relative h-80 overflow-hidden">
                <Image
                    src={image}
                    alt={`${name} - ${role}`}
                    height={400}
                    width={300}
                    className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Experience badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">{experience}</span>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{name}</h3>
                    <p className="text-base sm:text-lg text-[#3f03ed] font-semibold">{role}</p>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">
                    {description}
                </p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {achievements.map((achievement, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${achievementColors} rounded-full border ${achievementColors.replace('50', '200')}`}
                        >
                            <Award className={`w-3 h-3 ${achievementColors.replace('50', '600')}`} />
                            <span className={`text-xs font-medium ${achievementColors.replace('50', '700')}`}>{achievement}</span>
                        </div>
                    ))}
                </div>

                {/* Social Media Links */}
                <div className="flex gap-3">
                    {socialLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center w-8 h-8 ${link.bgColor} hover:${link.hoverColor} rounded-full transition-colors duration-300`}
                        >
                            {link.icon === 'facebook' && <Facebook className="w-4 h-4 text-white" />}
                            {link.icon === 'linkedin' && <Linkedin className="w-4 h-4 text-white" />}
                            {link.icon === 'instagram' && <Instagram className="w-4 h-4 text-white" />}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
