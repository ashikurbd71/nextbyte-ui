"use client"

import Link from "next/link"

export default function FooterLinks({ title, links }) {
    return (
        <div>
            <h3 className="text-white font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            href={link.href}
                            className="text-white/70 hover:text-white transition-colors text-sm"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
