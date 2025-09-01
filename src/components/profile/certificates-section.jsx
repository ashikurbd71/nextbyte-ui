"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Award, Calendar, Eye } from "lucide-react"
import CertificateGenerator from "./certificate-generator"

export default function CertificatesSection({ certificates = [] }) {
    const [selectedCertificate, setSelectedCertificate] = useState(null)
    const [showCertificate, setShowCertificate] = useState(false)

    const handleViewCertificate = (certificate) => {
        setSelectedCertificate(certificate)
        setShowCertificate(true)
    }

    const handleCloseCertificate = () => {
        setShowCertificate(false)
        setSelectedCertificate(null)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (showCertificate && selectedCertificate) {
        return (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Certificate Preview</h3>
                    <Button
                        onClick={handleCloseCertificate}
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                    >
                        Back to Certificates
                    </Button>
                </div>
                <CertificateGenerator certificate={selectedCertificate} />
            </Card>
        )
    }

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-bold text-white">My Certificates</h3>
                <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-white/70 text-xs sm:text-sm">{certificates.length} Certificates Earned</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Certificate ID
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Course Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Issue Date
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-white text-sm">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((certificate) => (
                            <tr
                                key={certificate.id}
                                className="border-b border-white/10 hover:bg-white/5"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <Award className="w-4 h-4 text-yellow-400 mr-2" />
                                        <span className="text-white font-mono text-sm italic">
                                            {certificate.certificateNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium text-white text-sm italic">
                                            {certificate.courseName}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            {certificate.completionPercentage}% Complete
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-white/60 mr-1" />
                                        <span className="text-xs text-white/80 italic">
                                            {formatDate(certificate.issuedDate)}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => handleViewCertificate(certificate)}
                                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {certificates.map((certificate) => (
                    <motion.div
                        key={certificate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    <Award className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                                    <h3 className="font-medium text-white text-sm sm:text-base truncate italic">
                                        {certificate.courseName}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-center">
                                <span className="text-xs text-white/60">Certificate ID:</span>
                                <span className="text-white text-sm font-mono ml-2 italic">
                                    {certificate.certificateNumber}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-white/60 mr-2" />
                                <div>
                                    <p className="text-xs text-white/60">Issue Date</p>
                                    <p className="text-white text-sm italic">
                                        {formatDate(certificate.issuedDate)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleViewCertificate(certificate)}
                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {certificates.length === 0 && (
                <div className="text-center py-8">
                    <Award className="w-12 h-12 sm:w-16 sm:h-16 text-white/30 mx-auto mb-3 sm:mb-4" />
                    <p className="text-white/60 text-sm sm:text-base">No certificates earned yet. Complete courses to earn certificates!</p>
                </div>
            )}
        </Card>
    )
}
