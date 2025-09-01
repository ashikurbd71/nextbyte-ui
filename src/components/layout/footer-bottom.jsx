"use client"

import Link from "next/link"

export default function FooterBottom() {
    const legalLinks = [
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
        { href: "/cookies", label: "Cookies" }
    ]

    return (
        <div className="border-t border-white/20 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/50 text-sm">
                    © 2024 NextByte. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    {legalLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-white/50 hover:text-white transition-colors text-sm"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
