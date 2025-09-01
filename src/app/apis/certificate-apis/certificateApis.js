// Certificate API functions for NextByte
// Base URL for certificate endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/certificate`;

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

// Get certificate by student ID
export const getCertificateByStudentId = async (studentId) => {
    try {
        const response = await makeAuthenticatedRequest(`/student/${studentId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Generate certificate by enrollment ID
export const generateCertificateByEnrollmentId = async (enrollmentId, certificateData = {}) => {
    try {
        const response = await makeAuthenticatedRequest(`/generate/${enrollmentId}`, {
            method: 'POST',
            body: JSON.stringify(certificateData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Generate certificate - POST request to /certificate/generate with enrollmentid in body
export const generateCertificate = async (enrollmentId) => {
    try {
        const response = await makeAuthenticatedRequest('/generate', {
            method: 'POST',
            body: JSON.stringify({ enrollmentId: enrollmentId }),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get current user's certificates
export const getCurrentUserCertificates = async () => {
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

// Get certificate by certificate ID
export const getCertificateById = async (certificateId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${certificateId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Download certificate
export const downloadCertificate = async (certificateId) => {
    try {
        const response = await makeAuthenticatedRequest(`/download/${certificateId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Verify certificate
export const verifyCertificate = async (certificateId) => {
    try {
        const response = await makeAuthenticatedRequest(`/verify/${certificateId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Get all certificates (admin function)
export const getAllCertificates = async () => {
    try {
        const response = await makeAuthenticatedRequest('/all', {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Update certificate
export const updateCertificate = async (certificateId, updateData) => {
    try {
        const response = await makeAuthenticatedRequest(`/${certificateId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// Delete certificate
export const deleteCertificate = async (certificateId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${certificateId}`, {
            method: 'DELETE',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// All functions are already exported individually above
