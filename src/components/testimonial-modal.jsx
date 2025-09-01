"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Quote, Calendar, User, BookOpen } from "lucide-react"

export function TestimonialModal({ testimonial, isOpen, onClose, cardRef }) {
    if (!isOpen || !testimonial) return null;

    const getModalPosition = () => {
        if (cardRef?.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Calculate modal position to center on card
            const modalWidth = 448; // max-w-md = 28rem = 448px
            const modalHeight = 600; // approximate height
            const modalLeft = cardCenterX - modalWidth / 2;
            const modalTop = cardCenterY - modalHeight / 2;

            // Ensure modal stays within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let finalLeft = Math.max(16, Math.min(modalLeft, viewportWidth - modalWidth - 16));
            let finalTop = Math.max(16, Math.min(modalTop, viewportHeight - modalHeight - 16));

            return { left: finalLeft, top: finalTop };
        }
        return null;
    };

    const position = getModalPosition();

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto absolute"
                    style={position ? { left: position.left, top: position.top } : {}}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative p-6 border-b border-gray-200">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                                {testimonial.userPhoto ? (
                                    <img
                                        src={testimonial.userPhoto}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`w-full h-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white text-lg ${testimonial.userPhoto ? 'hidden' : 'flex'}`}>
                                    {testimonial.avatar}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {testimonial.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Student
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Quote and Rating */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                                <Quote className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-1 mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    {testimonial.content}
                                </p>
                            </div>
                        </div>

                        {/* Course Information */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <h4 className="font-semibold text-gray-900">Course</h4>
                            </div>
                            <p className="text-gray-700 font-medium">
                                {testimonial.courseName || testimonial.title}
                            </p>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Student at NextByte</span>
                            </div>

                            {testimonial.createdAt && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Reviewed on {new Date(testimonial.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                Thank you for your feedback!
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
