// User API functions for NextByte
// Base URL for user endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

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

// 3. Update user profile by ID (admin function)
export const updateUserById = async (userId, userData) => {
    try {
        const response = await makeAuthenticatedRequest(`/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(userData),
        });

        console.log('API Response:', response);

        // Update localStorage with the new user data for real-time updates
        if (response && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            // Get current user data from localStorage
            const currentUserData = localStorage.getItem('userData');
            let updatedUserData = response;

            if (currentUserData) {
                try {
                    const parsedCurrentData = JSON.parse(currentUserData);
                    // Merge the updated fields with existing data
                    updatedUserData = { ...parsedCurrentData, ...response };
                } catch (error) {
                    console.error('Error parsing current user data:', error);
                }
            }

            localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

        return response;
    } catch (error) {
        throw error;
    }
};

// 8. Change user password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await makeAuthenticatedRequest('/change-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// All functions are already exported individually above
