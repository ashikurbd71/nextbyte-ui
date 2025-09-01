"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

export function TestimonialCard({ testimonial }) {
    return (
        <motion.div
            className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-2xl border border-gray-200/50 backdrop-blur-sm hover-lift relative"
            whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)"
            }}
            transition={{ duration: 0.3 }}
            style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
            }}
        >
            {/* Quote icon */}
            <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                    <Quote className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    ))}
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-700 mb-2 sm:mb-3 md:mb-4 leading-relaxed text-xs sm:text-sm">
                {testimonial.content}
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full overflow-hidden shadow-md">
                    {testimonial.userPhoto ? (
                        <img
                            src={testimonial.userPhoto}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-xs sm:text-sm md:text-lg ${testimonial.userPhoto ? 'hidden' : 'flex'}`}>
                        {testimonial.avatar}
                    </div>
                </div>
                <div>
                    <h4 className="text-gray-900 font-semibold text-xs sm:text-sm">
                        {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-xs">
                        {testimonial.title}
                    </p>
                </div>
            </div>

            {/* Read More link */}
            <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                <button className="text-[#3f03ed] hover:text-[#4e0bee] text-xs sm:text-sm font-medium transition-colors duration-300">
                    Read More
                </button>
            </div>

            {/* Shiny overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 rounded-lg sm:rounded-xl md:rounded-2xl pointer-events-none"></div>
        </motion.div>
    )
}
