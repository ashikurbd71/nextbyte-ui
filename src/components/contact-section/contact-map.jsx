"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation, Clock, Phone } from "lucide-react"

export function ContactMap() {
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
                        Visit Our <span className="gradient-text">Office</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Come visit us at our headquarters in Rangpur. We'd love to meet you in person and discuss your learning goals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Map */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 lg:p-12 h-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Interactive Map</h3>
                                <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                                    Our office is located in the heart of Rangpur's tech district,
                                    easily accessible by public transportation.
                                </p>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                                    <h4 className="font-semibold mb-2 text-sm sm:text-base">NextByte Headquarters</h4>
                                    <p className="text-xs sm:text-sm text-white/80">Rangpur , Payra Chattar</p>
                                    <p className="text-xs sm:text-sm text-white/80">Rangpur, Bangladesh</p>
                                </div>
                            </div>
                        </div>

                        {/* Map overlay elements */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>You are here</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Details */}
                    <motion.div
                        className="space-y-6 sm:space-y-8"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Office Information</h3>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Address</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Rangpur , Payra Chattar</p>
                                        <p className="text-gray-600 text-sm sm:text-base">Rangpur, Bangladesh</p>
                                        <p className="text-gray-600 text-sm sm:text-base">Bangladesh</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Business Hours</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Monday - Friday: 9:00 AM - 6:00 PM BDT</p>
                                        <p className="text-gray-600 text-sm sm:text-base">Saturday: 10:00 AM - 4:00 PM BDT</p>
                                        <p className="text-gray-600 text-sm sm:text-base">Sunday: Closed</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Contact</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">Phone: 01718180373</p>
                                        <p className="text-gray-600 text-sm sm:text-base">Email: career.nextbyteitinstitute@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Getting Here</h3>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">PC</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Payra Chattar Bata Shopping Mall</p>
                                        <p className="text-xs sm:text-sm text-gray-600">5-minute walk from Payra Chattar Bata Shopping Mall</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-semibold text-xs sm:text-sm">RB</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Rangpur Bata Shopping Mall</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Multiple lines serve our area in Rangpur</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-yellow-600 font-semibold text-xs sm:text-sm">🚗</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Parking</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Street parking and nearby garages available in Rangpur</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                                    <Navigation className="w-5 h-5" />
                                    <span>Get Directions</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
