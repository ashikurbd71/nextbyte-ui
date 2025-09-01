"use client"

import { AboutHeader } from "./about-section/about-header"
import { CEOSection } from "./about-section/ceo-section"
import { MentorsSection } from "./about-section/mentors-section"
import { CompanyStats } from "./about-section/company-stats"
import { BackgroundDecorations } from "./about-section/background-decorations"

export function AboutSection() {
    return (
        <section id="about" className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Background decorative elements */}
            <BackgroundDecorations />

            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <AboutHeader />

                {/* CEO Section - Prominent Display */}
                <CEOSection />

                {/* Mentors Section - Below CEO */}
                <MentorsSection />

                {/* Company Stats */}
                { }
            </div>
        </section>
    )
}
