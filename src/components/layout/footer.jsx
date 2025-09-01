"use client"

import FooterCompanyInfo from "./footer-company-info"
import FooterLinks from "./footer-links"
import FooterBottom from "./footer-bottom"

export default function Footer() {
    const quickLinks = [
        { href: "/courses", label: "Browse Courses" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/blog", label: "Blog" }
    ]

    const supportLinks = [
        { href: "/help", label: "Help Center" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/faq", label: "FAQ" }
    ]

    return (
        <footer className="bg-white/5 backdrop-blur-xl border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <FooterCompanyInfo />
                    <FooterLinks title="Quick Links" links={quickLinks} />
                    <FooterLinks title="Support" links={supportLinks} />
                </div>
                <FooterBottom />
            </div>
        </footer>
    )
}
