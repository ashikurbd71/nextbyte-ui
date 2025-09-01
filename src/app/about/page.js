"use client"

import { AboutHero } from "@/components/about-section/about-hero"
import { MissionVision } from "@/components/about-section/mission-vision"
import { WhatWeOffer } from "@/components/about-section/what-we-offer"
import { WhyChooseUs } from "@/components/about-section/why-choose-us"
import { CompanyStats } from "@/components/about-section/company-stats"
import { AboutHeader } from "@/components/about-section/about-header"
import { CEOSection } from "@/components/about-section/ceo-section"
import { MentorsSection } from "@/components/about-section/mentors-section"
import { BackgroundDecorations } from "@/components/about-section/background-decorations"

export default function AboutPage() {
    return (
        <div className="min-h-screen  bg-white">
            {/* Hero Section */}
            <AboutHero />

            {/* Mission & Vision Section */}
            <MissionVision />

            {/* What We Offer Section */}
            <WhatWeOffer />

            {/* Why Choose Us Section */}
            <WhyChooseUs />

            {/* Company Stats */}
            {/* <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Our <span className="gradient-text">Impact</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto">
                            Numbers that tell our story of growth and success
                        </p>
                    </div>
                    <CompanyStats />
                </div>
            </section> */}

            {/* About Header */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <AboutHeader />
                </div>
            </section>

            {/* CEO Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <CEOSection />
                </div>
            </section>

            {/* Mentors Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <MentorsSection />
                </div>
            </section>

            {/* Background Decorations */}
            <BackgroundDecorations />
        </div>
    )
}
