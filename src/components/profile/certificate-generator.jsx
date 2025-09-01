"use client"

import { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download, Award, Calendar, Clock } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function CertificateGenerator({ certificate }) {
    const certificateRef = useRef(null)
    const [downloadingCertificate, setDownloadingCertificate] = useState(false)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const generatePDF = async () => {
        setDownloadingCertificate(true)

        try {
            // Create a temporary div for the certificate content
            const certificateDiv = document.createElement('div')
            certificateDiv.style.position = 'absolute'
            certificateDiv.style.left = '-9999px'
            certificateDiv.style.top = '0'
            certificateDiv.style.width = '1200px'
            certificateDiv.style.height = '848px'
            certificateDiv.style.padding = '60px'
            certificateDiv.style.backgroundColor = 'white'
            certificateDiv.style.fontFamily = 'Georgia, serif'
            certificateDiv.style.fontSize = '16px'
            certificateDiv.style.lineHeight = '1.6'
            certificateDiv.style.color = '#333'
            certificateDiv.style.border = '8px double #3b82f6'
            certificateDiv.style.borderRadius = '12px'
            certificateDiv.style.background = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f3e8ff 100%)'
            certificateDiv.style.position = 'relative'
            certificateDiv.style.overflow = 'hidden'

            // Create the certificate HTML content
            certificateDiv.innerHTML = `
                <div style="position: absolute; inset: 0; opacity: 0.05; background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                
                <div style="position: relative; z-index: 10; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <!-- Logo -->
                    <div style="margin-bottom: 40px;">
                        <img src="/colorlogo.png" alt="NextByte Logo" style="height: 80px; width: auto; margin: 0 auto;" />
                    </div>

                    <!-- Certificate Title -->
                    <div style="margin-bottom: 50px;">
                        <h1 style="font-family: 'Times New Roman', serif; font-size: 48px; font-weight: bold; color: #1f2937; margin: 0 0 20px 0; letter-spacing: 0.1em; font-style: italic;">
                            Certificate of Completion
                        </h1>
                        <p style="font-family: 'Georgia', serif; font-size: 20px; color: #6b7280; font-style: italic; margin: 0;">
                            This is to certify that
                        </p>
                    </div>

                    <!-- Student Name -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-family: 'Times New Roman', serif; font-size: 36px; font-weight: bold; color: #2563eb; margin: 0 0 20px 0; letter-spacing: 0.05em; font-style: italic;">
                            ${certificate.studentName}
                        </h2>
                        <p style="font-family: 'Georgia', serif; font-size: 20px; color: #6b7280; font-style: italic; margin: 0;">
                            has successfully completed the course
                        </p>
                    </div>

                    <!-- Course Name -->
                    <div style="margin-bottom: 50px;">
                        <h3 style="font-family: 'Times New Roman', serif; font-size: 28px; font-weight: bold; color: #1f2937; margin: 0; font-style: italic;">
                            ${certificate.courseName}
                        </h3>
                    </div>

                    <!-- Certificate ID -->
               

                    <!-- Course Details -->
                    <div style="display: flex; justify-content: space-around; margin-bottom: 50px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        <div style="text-align: center;">
                            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                                <span style="font-family: 'Georgia', serif; font-weight: 600; color: #374151; font-style: italic;">
                                    Duration
                                </span>
                            </div>
                            <p style="font-family: 'Georgia', serif; color: #6b7280; margin: 0; font-style: italic;">
                                ${certificate.course.duration}
                            </p>
                        </div>
                        <div style="text-align: center;">
                            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                                <span style="font-family: 'Georgia', serif; font-weight: 600; color: #374151; font-style: italic;">
                                    Issued Date
                                </span>
                            </div>
                            <p style="font-family: 'Georgia', serif; color: #6b7280; margin: 0; font-style: italic;">
                                ${formatDate(certificate.issuedDate)}
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px;">
                        <div style="text-align: center; flex: 1;">
                            <div style="border-top: 2px solid #d1d5db; padding-top: 10px; width: 150px; margin: 0 auto 10px auto;"></div>
                            <p style="font-family: 'Georgia', serif; font-size: 14px; color: #6b7280; margin: 0; font-style: italic;">
                                Course Instructor
                            </p>
                        </div>
                        <div style="text-align: center; flex: 1;">
                            <div style="border-top: 2px solid #d1d5db; padding-top: 10px; width: 150px; margin: 0 auto 10px auto;"></div>
                            <p style="font-family: 'Georgia', serif; font-size: 14px; color: #6b7280; margin: 0; font-style: italic;">
                                NextByte Director
                            </p>
                        </div>
                    </div>

                    <!-- Decorative Elements -->
                    <div style="position: absolute; top: 20px; left: 20px; color: #f59e0b; font-size: 32px;">🏆</div>
                    <div style="position: absolute; top: 20px; right: 20px; color: #f59e0b; font-size: 32px;">🏆</div>
                    <div style="position: absolute; bottom: 20px; left: 20px; color: #f59e0b; font-size: 32px;">🏆</div>
                    <div style="position: absolute; bottom: 20px; right: 20px; color: #f59e0b; font-size: 32px;">🏆</div>
                </div>
            `

            // Add the div to the document
            document.body.appendChild(certificateDiv)

            // Convert to canvas
            const canvas = await html2canvas(certificateDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1200,
                height: 848
            })

            // Remove the temporary div
            document.body.removeChild(certificateDiv)

            // Create PDF
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('landscape', 'mm', 'a4')

            const imgWidth = 297 // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

            // Add certificate number as watermark
            pdf.setFontSize(8)
            pdf.setTextColor(200, 200, 200)
            pdf.text(`Certificate ID: ${certificate.certificateNumber}`, 10, 10)

            // Download the PDF
            const fileName = `${certificate.studentName}-${certificate.courseName}-Certificate.pdf`
            pdf.save(fileName)

        } catch (error) {
            console.error("Error generating PDF certificate:", error)
            alert('Unable to generate certificate PDF. Please try again.')
        } finally {
            setDownloadingCertificate(false)
        }
    }

    const downloadAsImage = async () => {
        try {
            const element = certificateRef.current
            if (!element) {
                throw new Error('Certificate element not found')
            }

            // Use html2canvas to capture the certificate
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            })

            // Create download link
            const link = document.createElement('a')
            link.download = `${certificate.studentName}-${certificate.courseName}-Certificate.png`
            link.href = canvas.toDataURL('image/png', 1.0)
            link.click()

        } catch (error) {
            console.error('Error downloading image:', error)
            alert('Unable to download certificate image. Please try again.')
        }
    }

    return (
        <div className="space-y-4">
            {/* Certificate Preview */}
            <div
                ref={certificateRef}
                className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 border-8 border-double border-blue-200 rounded-lg overflow-hidden shadow-2xl"
                style={{ aspectRatio: '1.414' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Header */}
                <div className="relative z-10 p-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/colorlogo.png"
                            alt="NextByte Logo"
                            className="h-16 w-auto"
                        />
                    </div>

                    {/* Certificate Title */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 italic" style={{ fontFamily: 'Times New Roman, serif', letterSpacing: '0.1em' }}>
                            Certificate of Completion
                        </h1>
                        <p className="text-lg text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                            This is to certify that
                        </p>
                    </div>

                    {/* Student Name */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-blue-600 mb-2 italic" style={{ fontFamily: 'Times New Roman, serif', letterSpacing: '0.05em' }}>
                            {certificate.studentName}
                        </h2>
                        <p className="text-lg text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                            has successfully completed the course
                        </p>
                    </div>

                    {/* Course Name */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 italic" style={{ fontFamily: 'Times New Roman, serif' }}>
                            {certificate.courseName}
                        </h3>
                    </div>

                    {/* Certificate ID - Prominently Displayed */}
                    <div className="mb-8">
                        <div className="bg-gray-100 rounded-lg p-4 inline-block">
                            <p className="text-sm text-gray-600 mb-1 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                Certificate ID
                            </p>
                            <p className="text-lg font-mono font-bold text-gray-800 italic" style={{ fontFamily: 'Courier New, monospace' }}>
                                {certificate.certificateNumber}
                            </p>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="grid grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-semibold text-gray-700 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                    Duration
                                </span>
                            </div>
                            <p className="text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                {certificate.course.duration}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-semibold text-gray-700 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                    Issued Date
                                </span>
                            </div>
                            <p className="text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                {formatDate(certificate.issuedDate)}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end mt-12">
                        <div className="text-center flex-1">
                            <div className="border-t-2 border-gray-300 pt-2 w-32 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                Course Instructor
                            </p>
                        </div>
                        <div className="text-center flex-1">
                            <div className="border-t-2 border-gray-300 pt-2 w-32 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                NextByte Director
                            </p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4">
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="absolute top-4 right-4">
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="absolute bottom-4 right-4">
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Download Buttons */}
            <div className="text-center space-y-3">
                <Button
                    onClick={generatePDF}
                    disabled={downloadingCertificate}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {downloadingCertificate ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Certificate PDF
                        </>
                    )}
                </Button>

                <div className="text-sm text-gray-500">
                    Having trouble with PDF? Try the image version:
                </div>

                <Button
                    onClick={downloadAsImage}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                    Download as Image
                </Button>
            </div>
        </div>
    )
}
