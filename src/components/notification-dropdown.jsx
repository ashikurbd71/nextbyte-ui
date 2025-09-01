"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { useState, useEffect, useRef } from "react"

export default function NotificationDropdown({ studentId, className = "", isMobile = false }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const {
        notifications,
        loading,
        formatTimeAgo,
        getNotificationIcon
    } = useNotifications(studentId)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className={isMobile ? "w-5 h-5" : "w-4 h-4 lg:w-5 lg:h-5"} />
            </Button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className={`absolute right-0 mt-2 ${isMobile ? 'w-80' : 'w-72 lg:w-80'} bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl z-50`}>
                    <div className="p-3 lg:p-4">
                        <h3 className="text-white font-semibold mb-3 text-sm lg:text-base">Notifications</h3>
                        <div className={`${isMobile ? 'space-y-3' : 'space-y-2 lg:space-y-3'} max-h-64 overflow-y-auto`}>
                            {loading ? (
                                <div className="text-gray-400 text-sm">Loading notifications...</div>
                            ) : notifications.length === 0 ? (
                                <div className="text-gray-400 text-sm">No notifications</div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start ${isMobile ? 'space-x-3' : 'space-x-2 lg:space-x-3'} p-2 rounded-lg hover:bg-gray-800/50 transition-colors`}
                                    >
                                        <div className="text-lg mt-1">{getNotificationIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-white ${isMobile ? 'text-sm' : 'text-xs lg:text-sm'} font-medium truncate`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {formatTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
