import { useState, useEffect, useCallback } from 'react';
import { notificationApis } from '@/app/apis/notification-apis/notificationApis';

export const useNotifications = (studentId) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!studentId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await notificationApis.getStudentNotifications(studentId);
            // Sort by createdAt (newest first) and take only the latest 5
            const sortedNotifications = data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setNotifications(sortedNotifications);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    // Format time ago
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'assignment_feedback':
            case 'assignment_submitted':
                return '📝';
            case 'course_enrollment':
                return '🎓';
            case 'general':
                return '📢';
            default:
                return '🔔';
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [studentId, fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
        formatTimeAgo,
        getNotificationIcon
    };
};
