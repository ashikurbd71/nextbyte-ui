"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Save current page URL when user is not authenticated
    const saveRedirectUrl = (url) => {
        if (typeof window !== 'undefined') {
            // Don't save login page as redirect URL
            if (!url.includes('/login')) {
                try {
                    localStorage.setItem('redirectUrl', url)
                    console.log("Saved redirect URL:", url)
                } catch (error) {
                    console.error("Error saving redirect URL:", error)
                }
            }
        }
    }

    // Get saved redirect URL
    const getRedirectUrl = () => {
        if (typeof window !== 'undefined') {
            try {
                const url = localStorage.getItem('redirectUrl')
                console.log("Retrieved redirect URL:", url)
                return url
            } catch (error) {
                console.error("Error getting redirect URL:", error)
                return null
            }
        }
        return null
    }

    // Clear saved redirect URL
    const clearRedirectUrl = () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem('redirectUrl')
                console.log("Cleared redirect URL")
            } catch (error) {
                console.error("Error clearing redirect URL:", error)
            }
        }
    }

    // Redirect to saved URL or default
    const redirectToSavedUrl = (defaultUrl = '/dashboard') => {
        const savedUrl = getRedirectUrl()
        if (savedUrl) {
            clearRedirectUrl()
            console.log("Redirecting to saved URL:", savedUrl)
            router.push(savedUrl)
        } else {
            console.log("No saved URL, redirecting to default:", defaultUrl)
            router.push(defaultUrl)
        }
    }

    // Check if there's a redirect parameter in URL
    const getRedirectFromUrl = () => {
        return searchParams.get('redirect')
    }

    // Save redirect URL from URL parameter
    const saveRedirectFromUrl = () => {
        const redirectParam = getRedirectFromUrl()
        if (redirectParam) {
            try {
                const decodedUrl = decodeURIComponent(redirectParam)
                console.log("Saving redirect URL from parameter:", decodedUrl)
                saveRedirectUrl(decodedUrl)
            } catch (error) {
                console.error("Error decoding redirect URL:", error)
            }
        }
    }

    return {
        saveRedirectUrl,
        getRedirectUrl,
        clearRedirectUrl,
        redirectToSavedUrl,
        getRedirectFromUrl,
        saveRedirectFromUrl
    }
}
