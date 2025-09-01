import { useState } from "react"
import {
    FileText,
    Calendar,
    DollarSign,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const PaymentHistory = ({ paymentHistory }) => {
    const [downloadingInvoice, setDownloadingInvoice] = useState(null)

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatAmount = (amount) => {
        const numericAmount = parseFloat(amount)
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericAmount) + " ৳"
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-400" />
            case "failed":
                return <XCircle className="w-4 h-4 text-red-400" />
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-400" />
            default:
                return <Clock className="w-4 h-4 text-white/60" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "text-green-400 bg-green-500/20 border-green-500/30"
            case "failed":
                return "text-red-400 bg-red-500/20 border-red-500/30"
            case "pending":
                return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
            default:
                return "text-white/60 bg-white/10 border-white/20"
        }
    }

    const generatePDFInvoice = async (payment) => {
        setDownloadingInvoice(payment.id)

        try {
            // Create a temporary div for the invoice content
            const invoiceDiv = document.createElement('div')
            invoiceDiv.style.position = 'absolute'
            invoiceDiv.style.left = '-9999px'
            invoiceDiv.style.top = '0'
            invoiceDiv.style.width = '800px'
            invoiceDiv.style.padding = '40px'
            invoiceDiv.style.backgroundColor = 'white'
            invoiceDiv.style.fontFamily = 'Arial, sans-serif'
            invoiceDiv.style.fontSize = '14px'
            invoiceDiv.style.lineHeight = '1.6'
            invoiceDiv.style.color = '#333'

            // Create the invoice HTML content
            invoiceDiv.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                    <h1 style="margin: 0; color: #333; font-size: 28px;">NEXTBYTE</h1>
                    <h2 style="margin: 10px 0 0 0; color: #666; font-size: 20px;">INVOICE</h2>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Invoice Details</h3>
                    <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(payment.paidAt)}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> 
                        <span style="padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; 
                        ${payment.paymentStatus === 'success' ? 'background-color: #d4edda; color: #155724;' :
                    payment.paymentStatus === 'failed' ? 'background-color: #f8d7da; color: #721c24;' :
                        'background-color: #fff3cd; color: #856404;'}">
                            ${payment.paymentStatus.toUpperCase()}
                        </span>
                    </p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Course Details</h3>
                    <p style="margin: 5px 0;"><strong>Course Name:</strong> ${payment.course.name}</p>
                    <p style="margin: 5px 0;"><strong>Duration:</strong> ${payment.course.duration}</p>
                    <p style="margin: 5px 0;"><strong>Original Price:</strong> ${formatAmount(payment.course.price)}</p>
                    <p style="margin: 5px 0;"><strong>Discounted Price:</strong> ${formatAmount(payment.course.discountPrice)}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Payment Details</h3>
                    <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment.paymentMethod.toUpperCase()}</p>
                    <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ${formatAmount(payment.amountPaid)}</p>
                </div>
                
                <div style="border-top: 2px solid #333; padding-top: 15px; margin-bottom: 40px;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold;"><strong>Total Amount:</strong> ${formatAmount(payment.amountPaid)}</p>
                </div>
                
                <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #ddd; color: #666;">
                    <p style="margin: 5px 0; font-size: 16px;"><strong>Thank you for choosing Nextbyte!</strong></p>
                    <p style="margin: 5px 0;">For any queries, please contact our support team.</p>
                    <p style="margin: 5px 0; font-size: 12px;">© 2025 Nextbyte. All rights reserved.</p>
                </div>
            `

            // Add the div to the document
            document.body.appendChild(invoiceDiv)

            // Convert to canvas
            const canvas = await html2canvas(invoiceDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            })

            // Remove the temporary div
            document.body.removeChild(invoiceDiv)

            // Create PDF
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')

            const imgWidth = 210 // A4 width in mm
            const pageHeight = 295 // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight

            let position = 0

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            // Download the PDF
            pdf.save(`invoice-${payment.transactionId}.pdf`)

        } catch (error) {
            console.error("Error generating PDF invoice:", error)
        } finally {
            setDownloadingInvoice(null)
        }
    }

    if (!paymentHistory || paymentHistory.length === 0) {
        return (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 sm:p-6">
                <div className="text-center text-white/60">
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-white/30" />
                    <p className="text-sm sm:text-base">No payment history found</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Payment History</h2>
                <div className="flex items-center text-white/70">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">{paymentHistory.length} transactions</span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Course
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Amount
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-white text-sm">
                                Method
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-white text-sm">
                                Invoice
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-white/10 hover:bg-white/5"
                            >
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium text-white text-sm">
                                            {payment.course.name}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            ID: {payment.transactionId}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                                        <span className="font-medium text-white text-sm">
                                            {formatAmount(payment.amountPaid)}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-white/60 mr-1" />
                                        <span className="text-xs text-white/80">
                                            {formatDate(payment.paidAt)}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        {getStatusIcon(payment.paymentStatus)}
                                        <span
                                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                payment.paymentStatus
                                            )}`}
                                        >
                                            {payment.paymentStatus}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 text-white/60 mr-1" />
                                        <span className="text-xs capitalize text-white/80">
                                            {payment.paymentMethod}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <button
                                        onClick={() => generatePDFInvoice(payment)}
                                        disabled={downloadingInvoice === payment.id}
                                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {downloadingInvoice === payment.id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-3 h-3 mr-1" />
                                                Download
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {paymentHistory.map((payment) => (
                    <div
                        key={payment.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white text-sm sm:text-base truncate">
                                    {payment.course.name}
                                </h3>
                                <p className="text-xs text-white/60 mt-1">
                                    ID: {payment.transactionId}
                                </p>
                            </div>
                            <div className="flex items-center ml-3">
                                {getStatusIcon(payment.paymentStatus)}
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                        payment.paymentStatus
                                    )}`}
                                >
                                    {payment.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-white/60">Amount</p>
                                    <p className="font-medium text-white text-sm">
                                        {formatAmount(payment.amountPaid)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 text-white/60 mr-2 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-white/60">Date</p>
                                    <p className="text-white text-sm">
                                        {formatDate(payment.paidAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CreditCard className="w-4 h-4 text-white/60 mr-2" />
                                <span className="text-xs capitalize text-white/80">
                                    {payment.paymentMethod}
                                </span>
                            </div>
                            <button
                                onClick={() => generatePDFInvoice(payment)}
                                disabled={downloadingInvoice === payment.id}
                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {downloadingInvoice === payment.id ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-3 h-3 mr-1" />
                                        Download
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default PaymentHistory
