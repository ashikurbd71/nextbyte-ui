// Enrollment API functions for NextByte
// Base URL for enrollment endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/enrollments`;


// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return data;
};

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            throw new Error('localStorage is not available in this environment');
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const url = `${BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Helper function to get current user ID
const getCurrentUserId = () => {
    try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            throw new Error('localStorage is not available in this environment');
        }

        const userData = localStorage.getItem('userData');
        if (!userData) {
            throw new Error('No user data found');
        }
        const user = JSON.parse(userData);
        return user?.id;
    } catch (error) {
        console.error('Error getting current user ID:', error);
        throw new Error('Unable to get current user ID');
    }
};

// Get student performance data for the logged-in user
export const getStudentPerformance = async () => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/performance/student/${userId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};


// Get all enrollments for the logged-in user
export const getUserEnrollments = async () => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/student/${userId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Enroll in a course
export const enrollInCourse = async (courseId) => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest('/enroll', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                courseId,
            }),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Update enrollment progress
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
    try {
        const response = await makeAuthenticatedRequest(`/${enrollmentId}`, {
            method: 'PATCH',
            body: JSON.stringify(progressData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get course analytics for the logged-in user
export const getCourseAnalytics = async (courseId) => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/analytics/course/${courseId}/student/${userId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Initiate payment for course enrollment
export const initiatePayment = async (paymentData) => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest('/payment/initiate', {
            method: 'POST',
            body: JSON.stringify({
                studentId: userId,
                ...paymentData,
            }),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get student enrollments by student ID
export const getStudentEnrollmentsById = async (studentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/student/${studentId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get payment history for a student
export const getStudentPaymentHistory = async (studentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/student/payment-history/${studentId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get course leaderboard
export const getCourseLeaderboard = async (courseId) => {
    try {
        const response = await makeAuthenticatedRequest(`/course/leaderboard/${courseId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get assignment marks data for a course
export const getCourseAssignmentMarks = async (courseId) => {
    try {
        const response = await makeAuthenticatedRequest(`/course/assignment-marks/${courseId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get student assignment marks for a specific course
export const getStudentAssignmentMarks = async (courseId, studentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/course/${courseId}/student/${studentId}/assignment-marks`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get motivational message for a student
export const getMotivationalMessage = async (studentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/motivational-message/student/${studentId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get enrollment by ID
export const getEnrollmentById = async (enrollmentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${enrollmentId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get current user's payment history
export const getCurrentUserPaymentHistory = async () => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/student/payment-history/${userId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get current user's assignment marks for a course
export const getCurrentUserAssignmentMarks = async (courseId) => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/course/${courseId}/student/${userId}/assignment-marks`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get current user's motivational message
export const getCurrentUserMotivationalMessage = async () => {
    try {
        const userId = getCurrentUserId();
        const response = await makeAuthenticatedRequest(`/motivational-message/student/${userId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// All functions are already exported individually above
