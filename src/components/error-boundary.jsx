"use client"

import { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console or error reporting service
        console.error('Error caught by boundary:', error, errorInfo)

        // Check if it's a removeChild error and handle gracefully
        if (error.message && error.message.includes('removeChild')) {
            console.warn('DOM manipulation error detected, attempting recovery...')
            // Force a re-render to recover
            setTimeout(() => {
                this.setState({ hasError: false, error: null })
            }, 100)
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-center">
                    <p>Something went wrong. Please refresh the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
