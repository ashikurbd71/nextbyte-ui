"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowRight, Sparkles, Zap, Target } from "lucide-react"
import { Button } from "./ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "../contexts/auth-context"
import { useRedirect } from "../hooks/use-redirect"
import { FileSpreadsheet } from "lucide-react"
import { Mail } from "lucide-react"
import { CircleStar } from "lucide-react"
import { Home } from "lucide-react"

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated } = useAuth()
    const { saveRedirectUrl } = useRedirect()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Enhanced navigation function that handles both same-page and cross-page navigation
    const handleNavigation = (e, href) => {
        e.preventDefault()

        const targetId = href.replace('#', '')

        // If we're not on the home page, navigate to home page with anchor
        if (pathname !== '/') {
            router.push(`/${href}`)
            return
        }

        // If we're on the home page, use smooth scroll
        try {
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                // Close mobile menu first
                setIsMenuOpen(false)

                // Get the actual navigation height dynamically
                const navElement = document.querySelector('nav')
                const navHeight = navElement ? navElement.offsetHeight : 80

                // Calculate target position
                const targetPosition = targetElement.offsetTop - navHeight - 20 // Add extra padding

                // Use a more reliable scrolling method
                if ('scrollBehavior' in document.documentElement.style) {
                    // Modern browsers with smooth scroll support
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    })
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition)
                }

                // Additional mobile-specific handling
                setTimeout(() => {
                    // Double-check scroll position and adjust if needed
                    const currentScroll = window.pageYOffset
                    const expectedScroll = targetPosition

                    if (Math.abs(currentScroll - expectedScroll) > 50) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        })
                    }
                }, 100)

            } else {
                console.warn(`Target element with id "${targetId}" not found`)
                // Fallback: scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        } catch (error) {
            console.error('Error during smooth scroll:', error)
            // Fallback: scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    const navItems = [
        { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        { href: "#courses", label: "Courses", icon: <Sparkles className="w-4 h-4" /> },
        { href: "#features", label: "Features", icon: <Zap className="w-4 h-4" /> },
        { href: "/about", label: "About", icon: <FileSpreadsheet className="w-4 h-4" />, isExternal: true },
        { href: "#testimonials", label: "Testimonials", icon: <CircleStar className="w-4 h-4" /> },
        { href: "/contact", label: "Contact", icon: <Mail className="w-4 h-4" />, isExternal: true },
    ]

    return (
        <motion.nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-2xl border-b border-white/20'
                : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Floating background elements - only show when scrolled */}
            {scrolled && (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-2 left-1/4 w-2 h-2 bg-gradient-to-r from-[#3f03ed] to-[#4e0bee] rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute top-4 right-1/3 w-1 h-1 bg-gradient-to-r from-[#4e0bee] to-[#5a1bef] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-[#5a1bef] to-[#3f03ed] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
            )}

            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center group"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className="flex-shrink-0 relative">
                            <motion.div
                                className="absolute -inset-1 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-300"
                                style={{
                                    background: scrolled
                                        ? ''
                                        : ''
                                }}
                            ></motion.div>
                            <Link href="/">
                                <div className="relative">
                                    {/* Color logo for scrolled state */}
                                    <Image
                                        src="/colorlogo.png"
                                        alt="NextByte"
                                        width={100}
                                        height={32}
                                        className={`transition-opacity duration-300 h-6 sm:h-8 w-auto ${scrolled ? 'opacity-100' : 'opacity-0 absolute'}`}
                                    />
                                    {/* White logo for transparent state */}
                                    <Image
                                        src="/whitelogo.png"
                                        alt="NextByte"
                                        width={100}
                                        height={32}
                                        className={`transition-opacity duration-300 h-6 sm:h-8 w-auto ${!scrolled ? 'opacity-100' : 'opacity-0 absolute'}`}
                                    />
                                </div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6 lg:space-x-8">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={(e) => item.isExternal ? null : handleNavigation(e, item.href)}
                                        className={`relative px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium transition-all duration-300 group cursor-pointer rounded-lg overflow-hidden ${scrolled
                                            ? 'text-gray-700 hover:text-[#3f03ed] hover:bg-gradient-to-r hover:from-[#3f03ed]/10 hover:to-[#4e0bee]/10'
                                            : 'text-white hover:text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-300/10 hover:to-yellow-200/10'
                                            }`}
                                    >
                                        {/* Background hover effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ${scrolled ? 'opacity-30' : 'opacity-20'}`}></div>

                                        <div className="flex items-center gap-2 relative z-10">
                                            <motion.div
                                                className={`transition-all duration-300 ${scrolled ? 'text-[#3f03ed]' : 'text-yellow-300'}`}
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                            >
                                                {item.icon}
                                            </motion.div>
                                            {item.label}
                                        </div>

                                        {/* Enhanced underline effect */}
                                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full ${scrolled
                                            ? 'bg-gradient-to-r from-[#3f03ed] via-[#4e0bee] to-[#5a1bef]'
                                            : 'bg-gradient-to-r from-yellow-300 to-yellow-200'
                                            }`}></span>

                                        {/* Glow effect */}
                                        <span className={`absolute bottom-0 left-0 w-0 h-1 opacity-40 blur-sm transition-all duration-300 group-hover:w-full rounded-full ${scrolled
                                            ? 'bg-gradient-to-r from-[#3f03ed] to-[#4e0bee]'
                                            : 'bg-gradient-to-r from-yellow-300 to-yellow-200'
                                            }`}></span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isAuthenticated ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"
                                ></motion.div>
                                <Button
                                    onClick={() => {
                                        saveRedirectUrl(pathname)
                                        router.push('/login')
                                    }}
                                    className={`relative text-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-ring font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm group overflow-hidden ${scrolled
                                        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:from-[#4e0bee] hover:to-[#5a1bef]'
                                        : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white'
                                        }`}
                                >
                                    {/* Button hover background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                    <motion.span
                                        className="flex items-center gap-2 relative z-10"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span>Get Started</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.span>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-[#3f03ed] to-[#4e0bee] rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"
                                ></motion.div>
                                <Button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className={`relative text-white shadow-xl hover:shadow-2xl transition-all duration-300 focus-ring font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm group overflow-hidden ${scrolled
                                        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:from-[#4e0bee] hover:to-[#5a1bef]'
                                        : 'bg-gradient-to-r from-purple-500 to-blue-900 hover:from-[#4e0bee] hover:to-[#5a1bef]'
                                        }`}
                                >
                                    {/* Button hover background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                    <motion.span
                                        className="flex items-center gap-2 relative z-10"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span>Dashboard</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </motion.span>
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                        >
                            <motion.div
                                className={`absolute -inset-1 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300 ${scrolled
                                    ? ''
                                    : ''
                                    }`}
                            ></motion.div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3f03ed] focus:ring-opacity-50 w-10 h-10 sm:w-12 sm:h-12 overflow-hidden ${scrolled
                                    ? 'hover:bg-gradient-to-r hover:from-[#3f03ed]/10 hover:to-[#4e0bee]/10'
                                    : 'hover:bg-gradient-to-r hover:from-yellow-300/10 hover:to-yellow-200/10'
                                    }`}
                                aria-label="Toggle menu"
                            >
                                {/* Button hover background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                <AnimatePresence mode="wait">
                                    {isMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`relative z-10 ${scrolled ? "text-[#3f03ed]" : "text-white"}`}
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`relative z-10 ${scrolled ? "text-[#3f03ed]" : "text-white"}`}
                                        >
                                            <Menu className="h-10 w-10 " />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t backdrop-blur-md shadow-2xl rounded-b-lg ${scrolled ? 'border-white/20 bg-white/95' : 'border-white/10 bg-white/10'}`}>
                                {/* Mobile menu header */}
                                <motion.div
                                    className="px-3 sm:px-4 py-3 mb-2"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                        <span className={`text-sm font-medium ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
                                            Navigation Menu
                                        </span>
                                    </div>
                                </motion.div>

                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={(e) => item.isExternal ? null : handleNavigation(e, item.href)}
                                            className={`block px-3 sm:px-4 py-3 text-sm sm:text-base font-medium transition-all duration-300 rounded-lg cursor-pointer group overflow-hidden relative ${scrolled
                                                ? 'text-gray-700 hover:text-[#3f03ed] hover:bg-gradient-to-r hover:from-[#3f03ed]/10 hover:to-[#4e0bee]/10'
                                                : 'text-white hover:text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-300/10 hover:to-yellow-200/10'
                                                }`}
                                        >
                                            {/* Mobile item hover background effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                            <div className="flex items-center gap-3 relative z-10">
                                                <motion.div
                                                    className={`transition-all duration-300 ${scrolled ? 'text-[#3f03ed]' : 'text-yellow-300'}`}
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                                >
                                                    {item.icon}
                                                </motion.div>
                                                <span>{item.label}</span>
                                                <motion.div
                                                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    whileHover={{ x: 2 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile CTA Section */}
                                <motion.div
                                    className="pt-4 border-t border-white/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <div className="px-3 sm:px-4 py-3 mb-3">
                                        {!isAuthenticated ? (
                                            <>
                                                <p className={`text-sm ${scrolled ? 'text-gray-600' : 'text-white/80'} mb-3`}>
                                                    Ready to start your tech journey?
                                                </p>
                                                <Button
                                                    onClick={() => {
                                                        saveRedirectUrl(pathname)
                                                        router.push('/login')
                                                    }}
                                                    className={`w-full font-semibold py-3 text-sm transition-all duration-300 group overflow-hidden relative ${scrolled
                                                        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:from-[#4e0bee] hover:to-[#5a1bef] text-white shadow-xl hover:shadow-2xl'
                                                        : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white'
                                                        }`}
                                                >
                                                    {/* Mobile button hover background effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                                    <motion.span
                                                        className="flex items-center justify-center gap-2 relative z-10"
                                                        whileHover={{ x: 2 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <span>Get Started Today</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </motion.span>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <p className={`text-sm ${scrolled ? 'text-gray-600' : 'text-white/80'} mb-3`}>
                                                    Access your learning dashboard
                                                </p>
                                                <Button
                                                    onClick={() => window.location.href = '/dashboard'}
                                                    className={`w-full font-semibold py-3 text-sm transition-all duration-300 bg-gradient-to-br from-[#3f03ed] to-[#4e0bee] hover:from-[#4e0bee] hover:to-[#5a1bef] text-white shadow-xl hover:shadow-2xl group overflow-hidden relative`}
                                                >
                                                    {/* Mobile button hover background effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

                                                    <motion.span
                                                        className="flex items-center justify-center gap-2 relative z-10"
                                                        whileHover={{ x: 2 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <span>Go to Dashboard</span>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </motion.span>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Mobile menu footer */}
                                <motion.div
                                    className="px-3 sm:px-4 py-2 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.5 }}
                                >
                                    <span className={`text-xs ${scrolled ? 'text-gray-500' : 'text-white/60'}`}>
                                        NextByte © 2024
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}
