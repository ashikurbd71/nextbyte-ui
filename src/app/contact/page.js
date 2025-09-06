import { ContactHeader } from "@/components/contact-section"
import { ContactForm } from "@/components/contact-section"
import { ContactInfo } from "@/components/contact-section"
import { ContactMap } from "@/components/contact-section"
import { FAQSection } from "@/components/contact-section"
import { BackgroundDecorations } from "@/components/contact-section"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <ContactHeader />
            { }
            <ContactInfo />
            <ContactMap />

            <BackgroundDecorations />
        </div>
    )
}
