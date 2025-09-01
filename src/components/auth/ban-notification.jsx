"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"

export function BanNotification() {
    const searchParams = useSearchParams()
    const [showNotification, setShowNotification] = useState(false)
    const [banReason, setBanReason] = useState("")

    useEffect(() => {
        // Check if user was redirected due to ban
        const isBanned = searchParams.get("banned")
        const reason = searchParams.get("reason")

        if (isBanned === "true") {
            setShowNotification(true)
            setBanReason(reason || "Your account has been banned. Please contact support for assistance.")

            // Auto-hide after 10 seconds
            const timer = setTimeout(() => {
                setShowNotification(false)
            }, 10000)

            return () => clearTimeout(timer)
        }
    }, [searchParams])

    const handleClose = () => {
        setShowNotification(false)
    }

    if (!showNotification) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
            >
                <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 mx-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800">
                                Account Suspended
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{banReason}</p>
                            </div>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={handleClose}
                                className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
