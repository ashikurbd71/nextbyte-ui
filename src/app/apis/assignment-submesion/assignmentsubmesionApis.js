// Assignment Submission API functions for NextByte
// Base URL for assignment submission endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/assignment-submissions`;

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return data;
};

// Helper function to make API requests with authentication
const makeRequest = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
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

// 1. Submit Assignment
export const submitAssignment = async (submissionData) => {
    try {
        const response = await makeRequest('', {
            method: 'POST',
            body: JSON.stringify(submissionData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};




// 5. Update Submission
export const updateSubmission = async (submissionId, updateData) => {
    try {
        const response = await makeRequest(`/${submissionId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// 6. Resubmit Assignment
export const resubmitAssignment = async (submissionId, resubmissionData) => {
    try {
        const response = await makeRequest(`/${submissionId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                ...resubmissionData,
                status: 'pending',
                reviewedAt: null,
                marks: null,
                feedback: null
            }),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// 7. Get Submission by ID
export const getSubmissionById = async (submissionId) => {
    try {
        const response = await makeRequest(`/${submissionId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
















// All functions are already exported individually above
