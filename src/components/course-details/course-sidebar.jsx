"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Clock,
    Download,
    Award,
    Globe,
    Target,
    Heart,
    Share2,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Loader2,
    Copy,
    Check,
    X
} from "lucide-react"
import { toast } from 'sonner'
import Link from "next/link"

export default function CourseSidebar({
    courseData,
    paymentLoading,
    handlePayment,
    isLiked,
    handleLike,
    showShareMenu,
    handleShare
}) {
    const [copied, setCopied] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Generate share URL
    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/course-details/${courseData.id}`
        }
        return ''
    }

    // Copy link to clipboard
    const copyToClipboard = async () => {
        try {
            const shareUrl = getShareUrl()

            // Try using the modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl)
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea')
                textArea.value = shareUrl
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }

            setCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Copy failed:', error)
            toast.error("Failed to copy link. Please try again.")
        }
    }

    // Track share analytics
    const trackShare = (platform) => {
        try {
            // You can integrate with your analytics service here
            // For example: Google Analytics, Mixpanel, etc.
            console.log(`Course shared on ${platform}:`, {
                courseId: courseData.id,
                courseTitle: courseData.name,
                platform: platform,
                timestamp: new Date().toISOString()
            })

            // Example: Send to your analytics endpoint
            // fetch('/api/analytics/share', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         courseId: courseData.id,
            //         platform: platform,
            //         userId: user?.id // if available
            //     })
            // })
        } catch (error) {
            console.error('Failed to track share:', error)
        }
    }

    // Share on Facebook
    const shareOnFacebook = () => {
        const shareUrl = getShareUrl()
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
        trackShare('facebook')
    }

    // Share on Twitter/X
    const shareOnTwitter = () => {
        const shareUrl = getShareUrl()
        const text = `Check out this amazing course: ${courseData.name}`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
        trackShare('twitter')
    }

    // Share on LinkedIn
    const shareOnLinkedIn = () => {
        const shareUrl = getShareUrl()
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        window.open(linkedinUrl, '_blank', 'width=600,height=400')
        trackShare('linkedin')
    }

    // Share on WhatsApp
    const shareOnWhatsApp = () => {
        const shareUrl = getShareUrl()
        const text = `Check out this amazing course: ${courseData.name}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        window.open(whatsappUrl, '_blank')
        trackShare('whatsapp')
    }

    // Share via Email
    const shareViaEmail = () => {
        const shareUrl = getShareUrl()
        const subject = `Check out this course: ${courseData.title}`
        const body = `I found this amazing course that you might be interested in:\n\n${courseData.name}\n\n${shareUrl}`
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.location.href = emailUrl
        trackShare('email')
    }

    // Handle payment with terms validation
    const handlePaymentWithValidation = () => {
        if (!agreedToTerms) {
            toast.error("Please accept the Privacy Policy and Terms & Conditions to continue")
            return
        }
        handlePayment()
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-3 sm:space-y-4 lg:space-y-6"
            >
                {/* Course Card */}
                <Card className="bg-white/10 md:mb-24 mb-44 backdrop-blur-xl border-white/20 p-3 sm:p-4 lg:p-6 sticky top-20 sm:top-24">
                    <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                            ৳{parseFloat(courseData.discountPrice || courseData.price).toLocaleString()}
                        </div>
                        {courseData.discountPrice && courseData.price && (
                            <div className="flex items-center justify-center space-x-2 mb-1 sm:mb-2">
                                <span className="text-gray-400 line-through text-xs sm:text-sm lg:text-base">
                                    ৳{parseFloat(courseData.price).toLocaleString()}
                                </span>
                                <span className="bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-xs lg:text-sm font-semibold">
                                    {Math.round(((parseFloat(courseData.price) - parseFloat(courseData.discountPrice)) / parseFloat(courseData.price)) * 100)}% OFF
                                </span>
                            </div>
                        )}
                        <p className="text-gray-300 text-xs sm:text-xs lg:text-sm">Limited time offer</p>
                    </div>

                    {/* Privacy Policy and Terms & Conditions Checkbox */}
                    <div className="mb-3 sm:mb-4">
                        <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                I agree to the{" "}
                                <Link
                                    href="/privacy-policy"
                                    target="_blank"
                                    className="text-purple-400 hover:text-purple-300 underline"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/terms-conditions"
                                    target="_blank"
                                    className="text-purple-400 hover:text-purple-300 underline"
                                >
                                    Terms & Conditions
                                </Link>
                            </span>
                        </label>
                    </div>

                    <Button
                        onClick={handlePaymentWithValidation}
                        disabled={paymentLoading}
                        className={`w-full py-2 sm:py-2 lg:py-3 text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 transition-all duration-300 ${paymentLoading
                            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            }`}
                    >
                        {paymentLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Enroll Now'
                        )}
                    </Button>




                    <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                        <p className="text-gray-300 text-xs sm:text-xs lg:text-sm">30-Day Money-Back Guarantee</p>
                    </div>

                    {/* Course Features */}
                    <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mb-3 sm:mb-4 lg:mb-6">
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">{courseData.duration} of content</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">Downloadable resources</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">Certificate of completion</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">Full lifetime access</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">All levels</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={handleLike}
                            className={`flex-1 border-white/30 text-white hover:bg-white/20 text-xs sm:text-sm lg:text-base py-2 ${isLiked ? 'bg-red-500/20 border-red-500/50' : ''}`}
                        >
                            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 mr-1 lg:mr-2 ${isLiked ? 'fill-current text-red-400' : ''}`} />
                            {isLiked ? 'Liked' : 'Like'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleShare}
                            className="flex-1 border-white/30 text-white hover:bg-white/20 text-xs sm:text-sm lg:text-base py-2"
                        >
                            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                            Share
                        </Button>
                    </div>
                </Card>

                {/* Contact Info */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
                        Need Help?
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">01718180373</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">career.nextbyteitinstitute@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-gray-300">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-base">Rangpur, Bangladesh</span>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleShare}
                            className="fixed inset-0  bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <Card className="bg-white/95 backdrop-blur-xl border-white/30 p-6 max-w-md w-full mx-4">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Share this course
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleShare}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Course Info */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        {courseData.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Help others discover this amazing course!
                                    </p>
                                </div>

                                {/* Copy Link Section */}
                                <div className="mb-6">
                                    <Button
                                        onClick={copyToClipboard}
                                        variant="outline"
                                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                                Link Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy Link
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Social Media Buttons */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <Button
                                        onClick={shareOnFacebook}
                                        variant="outline"
                                        className="border-blue-500 text-blue-600 hover:bg-blue-50 py-3"
                                    >
                                        <Facebook className="w-4 h-4 mr-2" />
                                        Facebook
                                    </Button>
                                    <Button
                                        onClick={shareOnTwitter}
                                        variant="outline"
                                        className="border-blue-400 text-blue-500 hover:bg-blue-50 py-3"
                                    >
                                        <Twitter className="w-4 h-4 mr-2" />
                                        Twitter/X
                                    </Button>
                                    <Button
                                        onClick={shareOnLinkedIn}
                                        variant="outline"
                                        className="border-blue-600 text-blue-700 hover:bg-blue-50 py-3"
                                    >
                                        <Linkedin className="w-4 h-4 mr-2" />
                                        LinkedIn
                                    </Button>
                                    <Button
                                        onClick={shareOnWhatsApp}
                                        variant="outline"
                                        className="border-green-500 text-green-600 hover:bg-green-50 py-3"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                        </svg>
                                        WhatsApp
                                    </Button>
                                </div>

                                {/* Email Share Button */}
                                {/* <Button
                                    onClick={shareViaEmail}
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Share via Email
                                </Button> */}
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
