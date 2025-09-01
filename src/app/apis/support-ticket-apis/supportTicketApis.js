// Support Ticket API functions for NextByte

import { useAuth } from "@/contexts/auth-context";

// Base URL for support ticket endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/tickets`;

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

// 1. Create a new support ticket
export const createSupportTicket = async (ticketData) => {
    try {
        const response = await makeAuthenticatedRequest('/', {
            method: 'POST',
            body: JSON.stringify(ticketData),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 2. Get all tickets for the authenticated user
export const getUserTickets = async (userId) => {

    try {
        const response = await makeAuthenticatedRequest(`/user/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// 3. Get ticket by ID
export const getTicketById = async (ticketId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${ticketId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

// 4. Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
    try {
        const response = await makeAuthenticatedRequest(`/${ticketId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 5. Add comment to ticket
export const addTicketComment = async (ticketId, comment) => {
    try {
        const response = await makeAuthenticatedRequest(`/${ticketId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// 6. Get ticket comments
export const getTicketComments = async (ticketId) => {
    try {
        const response = await makeAuthenticatedRequest(`/${ticketId}/comments`);
        return response;
    } catch (error) {
        throw error;
    }
};

// All functions are already exported individually above
