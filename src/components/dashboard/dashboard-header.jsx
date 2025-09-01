"use client"

import { LogOut, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function DashboardHeader({ onLogout }) {
    return (
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src="/colorlogo.png"
                            alt="NextByte"
                            width={120}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/dashboard" className="text-white hover:text-purple-300 transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/courses" className="text-white/70 hover:text-white transition-colors">
                            Courses
                        </Link>
                        <Link href="/certificates" className="text-white/70 hover:text-white transition-colors">
                            Certificates
                        </Link>
                        <Link href="/profile" className="text-white/70 hover:text-white transition-colors">
                            Profile
                        </Link>
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Settings className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={onLogout}
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
