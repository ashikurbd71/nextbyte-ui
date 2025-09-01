"use client"

import { BookOpen, Users, Award } from "lucide-react"

export function AboutHero() {
    return (
        <section className="relative py-24 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-6 h-6 sm:w-8 sm:h-8 md:w-16 md:h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 sm:mb-6 border border-blue-200">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-700">
                            About NextByte
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4 leading-tight">
                        Empowering <span className="gradient-text">Tech Careers</span>
                    </h1>
                    <p className="text-md  text-white/80  mx-auto px-2 sm:px-4 leading-relaxed">
                        NextByte is a leading online learning platform dedicated to transforming tech education.
                        We believe everyone deserves access to world-class tech skills that drive innovation and career growth.
                    </p>
                </div>

                {/* Quick info cards */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {[
                        {
                            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
                            title: "Active Students",
                            description: "Join our growing community",
                            stat: "1,000+",
                            color: "from-blue-500 to-blue-600"
                        },
                        {
                            icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
                            title: "Expert Courses",
                            description: "Learn from industry professionals",
                            stat: "50+",
                            color: "from-green-500 to-green-600"
                        },
                        {
                            icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
                            title: "Certificates Issued",
                            description: "Boost your career credentials",
                            stat: "500+",
                            color: "from-purple-500 to-purple-600"
                        }
                    ].map((item, index) => (
                        <div
                            key={item.title}
                            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
                        >
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-1 sm:mb-2">{item.title}</h3>
                            <p className="text-white/70 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 md:mb-3">{item.description}</p>
                            <p className="text-white font-bold text-base sm:text-lg md:text-xl">{item.stat}</p>
                        </div>
                    ))}
                </div> */}
            </div>
        </section>
    )
}
