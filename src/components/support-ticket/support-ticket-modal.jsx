"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Video } from "lucide-react"
import { createSupportTicket, getUserTickets } from "@/app/apis/support-ticket-apis/supportTicketApis"
import { useAuth } from "@/contexts/auth-context"
import { toast } from 'sonner'

export default function SupportTicketModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("create")
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: ""
    })
    const { user } = useAuth()

    // Fetch user tickets on component mount
    useEffect(() => {
        if (isOpen && activeTab === "tickets") {
            fetchUserTickets()
        }
    }, [isOpen, activeTab])

    const fetchUserTickets = async () => {
        try {
            setLoading(true)
            const response = await getUserTickets(user?.id)
            setTickets(response)
        } catch (error) {
            console.error("Error fetching tickets:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            setSubmitting(true)
            const ticketData = {
                title: formData.title,
                description: formData.description,
                userId: user?.id
            }

            const response = await createSupportTicket(ticketData)
            console.log("Ticket created:", response)

            // Reset form
            setFormData({ title: "", description: "" })

            // Switch to tickets tab and refresh
            setActiveTab("tickets")
            await fetchUserTickets()

            toast.success("Support ticket created successfully!")
        } catch (error) {
            console.error("Error creating ticket:", error)
            toast.error("Failed to create ticket. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <AlertCircle className="w-4 h-4 text-orange-500" />
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-500" />
            case "closed":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            default:
                return <MessageCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-orange-100 text-orange-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "closed":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out" style={{ margin: 'auto' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "create"
                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create New Ticket
                    </button>
                    <button
                        onClick={() => setActiveTab("tickets")}
                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "tickets"
                            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        My Tickets
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === "create" ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description of your issue"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Please provide detailed information about your issue..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                    {submitting ? "Creating..." : "Create Ticket"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading tickets...</p>
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No support tickets found</p>
                                    <Button
                                        onClick={() => setActiveTab("create")}
                                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        Create Your First Ticket
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tickets
                                        .filter(ticket => ticket.status !== "closed")
                                        .map((ticket) => (
                                            <Card key={ticket.id} className="p-4 border border-gray-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            {getStatusIcon(ticket.status)}
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                                                {ticket.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-medium text-gray-900">
                                                                {ticket.title}
                                                            </h3>
                                                            {ticket.serialNumber && (
                                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
                                                                    #{ticket.serialNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">
                                                            {ticket.description}
                                                        </p>

                                                        {ticket?.status === 'assigned' &&

                                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <Video className="w-4 h-4 text-blue-600" />
                                                                    <span className="text-sm font-medium text-blue-800">
                                                                        Meeting Link Available
                                                                    </span>
                                                                </div>
                                                                <a
                                                                    href={ticket.meetLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                                                                >
                                                                    {ticket.meetLink}
                                                                </a>
                                                            </div>
                                                        }



                                                        <div className="text-xs text-gray-500">
                                                            Created: {new Date(ticket.createdAt || ticket.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
