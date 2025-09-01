import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { CoursesSection } from "@/components/courses-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { OurPopuralCourse } from "@/components/our-popural-course"
import { AcademicSection } from "@/components/academic-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      <HeroSection />
      <OurPopuralCourse />
      <StatsSection />
      <CoursesSection />

      <FeaturesSection />
      <AcademicSection />
      <TestimonialsSection />

    </div>
  )
}
