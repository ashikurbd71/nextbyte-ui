"use client"

import { motion } from "framer-motion"
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react"

export function ContactHeader() {
    return (
        <section className="relative py-24 lg:py-44 min-h-screen  px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

            {/* Dotted background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            {/* Floating background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 border border-blue-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-700">
                            Get In Touch
                        </span>
                    </motion.div>

                    <h1 className="text-3xl  md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-4">
                        Let's <span className="text-yellow-400">Connect</span>
                    </h1>
                    <p className="text-md  text-white/80  mx-auto px-2 sm:px-4 leading-relaxed">
                        Have questions about our courses? Want to discuss your learning journey?
                        We're here to help you succeed in your tech career.
                    </p>
                </motion.div>

                {/* Quick contact cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {[
                        {
                            icon: <Mail className="w-6 h-6" />,
                            title: "Email Us",
                            description: "Send us a message anytime",
                            contact: "career.nextbyteitinstitute@gmail.com",
                            href: "mailto:career.nextbyteitinstitute@gmail.com"
                        },
                        {
                            icon: <Phone className="w-6 h-6" />,
                            title: "Call Us",
                            description: "Speak with our team",
                            contact: "01718180373",
                            href: "tel:01718180373"
                        },
                        {
                            icon: <MapPin className="w-6 h-6" />,
                            title: "Visit Us",
                            description: "Our office location",
                            contact: "Rangpur , Payra Chattar",
                            href: "#"
                        }
                    ].map((item, index) => (
                        <motion.a
                            key={item.title}
                            href={item.href}
                            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 lg:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-white/70 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3">{item.description}</p>
                            <p className="text-white font-medium text-sm sm:text-base">{item.contact}</p>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
