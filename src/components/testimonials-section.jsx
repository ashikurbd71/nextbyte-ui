"use client"

import { motion } from "framer-motion"
import { Star, Sparkles, Loader2 } from "lucide-react"
import { TestimonialCard } from "./testimonialcard "
import { useState, useEffect } from "react"
import { getAllReviews, getActiveReviews } from "../app/apis/reviews-apis/reviewsApis"

export function TestimonialsSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState({
        totalReviews: 0,
        averageRating: 0,
        totalStudents: 0
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAllReviews();

                // Transform the API data to match the testimonials format
                const transformedReviews = response.map(review => ({
                    id: review.id,
                    name: review.user?.name || 'Anonymous',
                    title: review.course?.name || 'Course Student',
                    content: review.comment,
                    rating: review.rating,
                    avatar: review.user?.photoUrl || '👤',
                    userPhoto: review.user?.photoUrl,
                    courseName: review.course?.name,
                    createdAt: review.createdAt,
                    isActive: review.isActive
                }));

                // Limit to 12 reviews for display
                const limitedReviews = transformedReviews.slice(0, 12);
                setReviews(limitedReviews);

                // Calculate statistics
                if (transformedReviews.length > 0) {
                    const totalRating = transformedReviews.reduce((sum, review) => sum + review.rating, 0);
                    const avgRating = totalRating / transformedReviews.length;
                    const uniqueUsers = new Set(transformedReviews.map(review => review.name)).size;

                    setStatistics({
                        totalReviews: transformedReviews.length,
                        averageRating: Math.round(avgRating * 10) / 10,
                        totalStudents: uniqueUsers
                    });
                }

            } catch (err) {
                setError(err.message);
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);


    // Use API data if available, otherwise show empty state
    const testimonials = reviews.length > 0 ? reviews : [];

    if (loading) {
        return (
            <section id="testimonials" className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-3 sm:mb-4 md:mb-6 border border-blue-200">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            <span className="text-xs sm:text-sm font-medium text-blue-700">
                                Student Success Stories
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight px-2 sm:px-4">
                            What Our <span className="gradient-text">Students Say</span>
                        </h2>
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading testimonials...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // If no testimonials available, don't render the section
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section id="testimonials" className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-float"></div>
                <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-3 sm:mb-4 md:mb-6 border border-blue-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-700">
                            Student Success Stories
                        </span>
                    </motion.div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight px-2 sm:px-4">
                        What Our <span className="gradient-text">Students Say</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
                        Join thousands of students who have transformed their careers with NextByte
                    </p>

                    {/* Statistics */}
                    {statistics.totalReviews > 0 && (
                        <motion.div
                            className="mt-4 flex justify-center items-center gap-4 text-sm text-gray-600"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <span>⭐ {statistics.averageRating} Average Rating</span>
                            <span>•</span>
                            <span>{statistics.totalReviews} Reviews</span>
                            <span>•</span>
                            <span>{statistics.totalStudents} Students</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* 4-Column Grid with Auto-Sliding */}
                <div className="relative overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-slide-container">
                        <motion.div
                            className="flex gap-6 animate-auto-slide"
                            style={{
                                animation: 'auto-slide 40s linear infinite'
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={`slide-${testimonial.id || index}`}
                                    testimonial={testimonial}
                                    index={index}
                                />
                            ))}
                            {/* Duplicate for seamless loop */}
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={`slide-duplicate-${testimonial.id || index}`}
                                    testimonial={testimonial}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-6 sm:mt-8 md:mt-12 lg:mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full border border-green-200">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
                        <span className="text-xs sm:text-sm md:text-base text-green-700 font-medium">
                            Join {statistics.totalStudents > 0 ? `${statistics.totalStudents}+` : '10,000+'} Successful Students
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

