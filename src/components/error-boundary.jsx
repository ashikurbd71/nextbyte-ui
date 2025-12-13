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
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 text-center">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
                            <p className="text-gray-300 text-sm mb-6">
                                We encountered an unexpected error. Don't worry, your progress is saved. Please refresh the page to continue.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                            Refresh Page
                        </button>
                        {this.state.error && process.env.NODE_ENV === 'development' && (
                            <details className="mt-4 text-left">
                                <summary className="text-gray-400 text-sm cursor-pointer">Technical Details</summary>
                                <pre className="mt-2 text-xs text-gray-500 bg-black/20 p-2 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
