// Authentication API functions for NextByte
// Base URL for authentication endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

console.log()



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

// 1. User Registration
export const registerUser = async (userData) => {
    try {
        const response = await makeRequest('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });


        return response;
    } catch (error) {
        throw error;
    }
};

// 2. User Login (Send OTP)
export const loginUser = async (phone) => {
    try {
        const response = await makeRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });


        return response;
    } catch (error) {
        throw error;
    }
};

// 3. OTP Verification
export const verifyOTP = async (phone, otp) => {
    try {
        const response = await makeRequest('/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phone, otp }),
        });

        // Check if user is banned
        if (response.user && response.user.isBanned === true) {
            throw new Error("Your account has been banned. Please contact support for assistance.");
        }

        // Check if user is active
        if (response.user && response.user.isActive === false) {
            throw new Error("Your account has been deactivated. Please contact support for assistance.");
        }

        // Store JWT token in localStorage
        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
        }


        return response;
    } catch (error) {
        throw error;
    }
};

// 4. Resend OTP
export const resendOTP = async (phone) => {
    try {
        const response = await makeRequest('/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });


        return response;
    } catch (error) {
        throw error;
    }
};

// 5. Logout function
export const logoutUser = () => {
    try {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// 6. Get current user data
export const getCurrentUser = () => {
    try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return null;
        }

        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedUserData = JSON.parse(userData);

            // Check if user is banned
            if (parsedUserData && parsedUserData.isBanned === true) {
                // Clear auth data for banned users
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                return null;
            }

            // Check if user is active
            if (parsedUserData && parsedUserData.isActive === false) {
                // Clear auth data for inactive users
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                return null;
            }

            return parsedUserData;
        }
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// 7. Get auth token
export const getAuthToken = () => {
    try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return null;
        }

        return localStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

// 8. Check if user is authenticated
export const isAuthenticated = () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        // Basic JWT expiration check (you might want to use a JWT library for proper validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        return payload.exp > currentTime;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
};

// 9. Complete login flow function
export const completeLoginFlow = async (phone, otp) => {
    try {
        // First, try to login (send OTP)
        await loginUser(phone);

        // Then verify OTP
        const result = await verifyOTP(phone, otp);

        return result;
    } catch (error) {
        throw error;
    }
};

// 10. Registration with immediate OTP verification
export const registerAndVerify = async (userData, otp) => {
    try {
        // First register the user
        const registrationResult = await registerUser(userData);

        // Then verify OTP
        const verificationResult = await verifyOTP(userData.phone, otp);

        return verificationResult;
    } catch (error) {
        throw error;
    }
};



// 12. Validate phone number format
export const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{11}$/; // exactly 11 digits
    return phoneRegex.test(phone);
};

// 13. Validate OTP format
export const validateOTP = (otp) => {
    const otpRegex = /^\d{4}$/;
    return otpRegex.test(otp);
};

// 14. Auto-login function (if token exists and is valid)
export const autoLogin = () => {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        // showToast(`Welcome back, ${user?.name || 'User'}!`, 'success');
        return user;
    }
    return null;
};

// All functions are already exported individually above
