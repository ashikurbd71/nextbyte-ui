"use client"

import Navbar from "./navbar"
import Footer from "./footer"

export default function AppLayout({ children, onLogout, user, showNavbar = true, showFooter = true }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            {/* Navbar */}
            {showNavbar && <Navbar onLogout={onLogout} user={user} />}

            {/* Main Content */}
            <main className="flex-1 pt-16">
                {children}
            </main>


        </div>
    )
}
