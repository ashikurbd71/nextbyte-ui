"use client"

import { Diamond, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import NotificationDropdown from "@/components/notification-dropdown"
import SupportTicketModal from "@/components/support-ticket/support-ticket-modal"

export default function Navbar({ onLogout }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
    const { user } = useAuth()

    console.log(user?.photoUrl)

    return (
        <header className="bg-white/10 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/dashboard">
                            <Image
                                src="/whitelogo.png"
                                alt="NextByte"
                                width={120}
                                height={32}
                                className="h-6 sm:h-8 w-auto"
                            />
                        </Link>
                    </div>



                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                        {/* Notifications */}
                        <NotificationDropdown studentId={user?.id || 2} />

                        {/* Points/Currency */}
                        <div className="flex items-center space-x-1 lg:space-x-2 bg-green-500/20 px-2 lg:px-3 py-1 rounded-lg">
                            <Diamond className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                            <span className="text-green-400 font-semibold text-xs lg:text-sm">153</span>
                        </div>

                        {/* Support Ticket Button */}
                        <Button
                            onClick={() => setIsSupportModalOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm"
                        >
                            Support Ticket
                        </Button>

                        { }
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm">
                            Enroll Now
                        </Button>

                        {/* User Profile */}
                        <Link href="/profile" className="flex items-center space-x-2 lg:space-x-3 hover:bg-white/10 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                <Image
                                    src={user?.photoURL || user?.photoUrl || "/ceo.png"}
                                    alt={user?.name || "User"}
                                    width={32}
                                    height={32}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </Link>

                        {/* Logout Button */}
                        {onLogout && (
                            <Button
                                onClick={onLogout}
                                variant="ghost"
                                className="text-white hover:bg-white/10 text-xs lg:text-sm"
                            >
                                <LogOut className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                                Logout
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button and Profile */}
                    <div className="md:hidden flex items-center space-x-3">
                        {/* Mobile Profile Image */}
                        <Link href="/profile" className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                <Image
                                    src={user?.photoURL || user?.photoUrl || "/ceo.png"}
                                    alt={user?.name || "User"}
                                    width={32}
                                    height={32}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </Link>

                        {/* Mobile Notification Icon */}
                        <NotificationDropdown studentId={user?.id || 2} isMobile={true} />

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/20 py-4">
                        <nav className="flex flex-col space-y-4">

                            {/* Mobile User Actions */}
                            <div className="border-t border-white/20 pt-4 px-4">





                                <Button
                                    onClick={() => setIsSupportModalOpen(true)}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white mb-2"
                                >
                                    Support Ticket
                                </Button>

                                {onLogout && (
                                    <Button
                                        onClick={onLogout}
                                        variant="ghost"
                                        className="w-full text-white hover:bg-white/10"
                                    >
                                        Logout
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>

            {/* Support Ticket Modal */}
            <SupportTicketModal
                isOpen={isSupportModalOpen}
                onClose={() => setIsSupportModalOpen(false)}
            />
        </header>
    )
}
