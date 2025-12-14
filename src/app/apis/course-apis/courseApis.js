// Course API functions for NextByte
// Base URL for course endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/course`;

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

// 1. Get all courses
export const getAllCourses = async () => {
    try {
        const response = await makeRequest('/');
        return response;
    } catch (error) {
        throw error;
    }
};

// 2. Get course by ID
export const getCourseById = async (courseId) => {
    try {
        const response = await makeRequest(`/${courseId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// 3. Get authenticated user's courses (if needed)
export const getUserCourses = async () => {
    try {
        const response = await makeAuthenticatedRequest('/user-courses');
        return response;
    } catch (error) {
        throw error;
    }
};

// 4. Enroll in a course (if needed)
export const enrollInCourse = async (courseId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${courseId}/enroll`, {
            method: 'POST',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// All functions are already exported individually above
