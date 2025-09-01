const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const notificationApis = {
    // Get notifications for a student
    getStudentNotifications: async (studentId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/student/${studentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // Mark notification as read
    markNotificationAsRead: async (studentId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/student/${studentId}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    // Get unread notification count
    getUnreadNotificationCount: async (studentId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/student/${studentId}/unread-count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.count;
        } catch (error) {
            console.error('Error fetching unread notification count:', error);
            return 0;
        }
    }
};
