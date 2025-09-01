// Reviews API functions for NextByte
// Base URL for reviews endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return data;
};

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
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

// 1. Get all reviews
export const getAllReviews = async () => {
    try {
        const response = await makeRequest('/');
        return response;
    } catch (error) {
        throw error;
    }
};

// 2. Create a new review
export const createReview = async (reviewData) => {
    try {
        const response = await makeAuthenticatedRequest('/', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 3. Get reviews by course ID
export const getReviewsByCourseId = async (courseId) => {
    try {
        const studentId = user?.id
        const response = await makeRequest(`/student/${studentId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// 4. Get reviews by user ID
export const getReviewsByUserId = async (userId) => {
    try {
        const response = await makeAuthenticatedRequest(`/user/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
};





