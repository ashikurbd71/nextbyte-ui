"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    CheckCircle,
    XCircle,
    Clock,
    Star,
    MessageSquare,
    RefreshCw,
    ExternalLink,
    FileText,
    Github,
    Globe
} from "lucide-react"

export function AssignmentSubmissionReview({
    submission,
    assignment,
    onResubmit,
    isResubmitting = false
}) {
    const [showResubmitForm, setShowResubmitForm] = useState(false)
    const [resubmissionData, setResubmissionData] = useState({
        description: submission?.description || '',
        githubLink: submission?.githubLink || '',
        liveLink: submission?.liveLink || '',
        fileUrl: submission?.fileUrl || ''
    })

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-400" />
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-400" />
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-400" />
            default:
                return <Clock className="w-5 h-5 text-gray-400" />
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'text-green-400 bg-green-400/10'
            case 'rejected':
                return 'text-red-400 bg-red-400/10'
            case 'pending':
                return 'text-yellow-400 bg-yellow-400/10'
            default:
                return 'text-gray-400 bg-gray-400/10'
        }
    }

    const handleResubmit = () => {
        onResubmit(submission.id, resubmissionData)
        setShowResubmitForm(false)
    }

    const updateResubmissionField = (field, value) => {
        setResubmissionData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Assignment Review</h3>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(submission?.status)}
                        <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(submission?.status)}`}>
                            {submission?.status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Assignment Details */}
                <div className="mb-6">
                    <h4 className="text-base font-medium text-white mb-2">{assignment?.title}</h4>
                    <p className="text-sm text-gray-300 mb-3">{assignment?.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div>Total Marks: {assignment?.totalMarks}</div>
                        <div>Due Date: {new Date(assignment?.dueDate).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Submission Details */}
                <div className="mb-6">
                    <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Your Submission
                    </h5>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Description</label>
                            <p className="text-sm text-white bg-white/5 p-3 rounded">
                                {submission?.description || 'No description provided'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
                                    <Github className="w-3 h-3" />
                                    GitHub Link
                                </label>
                                {submission?.githubLink ? (
                                    <a
                                        href={submission.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        View Repository
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-500">No GitHub link provided</span>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    Live Link
                                </label>
                                {submission?.liveLink ? (
                                    <a
                                        href={submission.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        View Live Demo
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-500">No live link provided</span>
                                )}
                            </div>
                        </div>

                        {submission?.fileUrl && (
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">File Attachment</label>
                                <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    Download File
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Results */}
                {submission?.status === 'approved' || submission?.status === 'rejected' ? (
                    <div className="mb-6">
                        <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Review Results
                        </h5>

                        <div className="space-y-4">
                            {/* Marks */}
                            {submission?.marks !== undefined && (
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-white">Marks</span>
                                        <span className="text-lg font-semibold text-white">
                                            {submission.marks}/{assignment?.totalMarks}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(submission.marks / assignment?.totalMarks) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            {submission?.feedback && (
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm font-medium text-white">Feedback</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {submission.feedback}
                                    </p>
                                </div>
                            )}

                            {/* Review Date */}
                            {submission?.reviewedAt && (
                                <div className="text-xs text-gray-400">
                                    Reviewed on: {new Date(submission.reviewedAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mb-6">
                        <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium text-yellow-400">Under Review</span>
                            </div>
                            <p className="text-sm text-yellow-300">
                                Your assignment is currently being reviewed by our instructors.
                                You will receive feedback and marks once the review is complete.
                            </p>
                        </div>
                    </div>
                )}

                {/* Resubmission Section */}
                {(submission?.status === 'rejected' || submission?.status === 'pending') && (
                    <div className="border-t border-white/20 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-medium text-white flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                {submission?.status === 'rejected' ? 'Resubmit Assignment' : 'Update Submission'}
                            </h5>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResubmitForm(!showResubmitForm)}
                                className="text-white border-white/20 hover:bg-white/10"
                            >
                                {showResubmitForm ? 'Cancel' : (submission?.status === 'rejected' ? 'Resubmit' : 'Update')}
                            </Button>
                        </div>

                        <AnimatePresence>
                            {showResubmitForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-3"
                                >
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Description</label>
                                        <textarea
                                            value={resubmissionData.description}
                                            onChange={(e) => updateResubmissionField('description', e.target.value)}
                                            placeholder="Describe your updated submission..."
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm h-24 resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">GitHub Link</label>
                                        <input
                                            type="url"
                                            value={resubmissionData.githubLink}
                                            onChange={(e) => updateResubmissionField('githubLink', e.target.value)}
                                            placeholder="https://github.com/username/repository"
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Live Link</label>
                                        <input
                                            type="url"
                                            value={resubmissionData.liveLink}
                                            onChange={(e) => updateResubmissionField('liveLink', e.target.value)}
                                            placeholder="https://your-app.netlify.app"
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">File URL (Optional)</label>
                                        <input
                                            type="url"
                                            value={resubmissionData.fileUrl}
                                            onChange={(e) => updateResubmissionField('fileUrl', e.target.value)}
                                            placeholder="https://example.com/file.zip"
                                            className="w-full p-3 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleResubmit}
                                        disabled={isResubmitting}
                                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white"
                                    >
                                        {isResubmitting
                                            ? (submission?.status === 'rejected' ? 'Resubmitting...' : 'Updating...')
                                            : (submission?.status === 'rejected' ? 'Submit Resubmission' : 'Update Submission')
                                        }
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Submission Info */}
                <div className="border-t border-white/20 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div>Submitted: {new Date(submission?.createdAt).toLocaleDateString()}</div>
                        {submission?.updatedAt && submission.updatedAt !== submission.createdAt && (
                            <div>Updated: {new Date(submission.updatedAt).toLocaleDateString()}</div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
