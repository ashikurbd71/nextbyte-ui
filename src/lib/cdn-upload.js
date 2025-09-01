/**
 * CDN Upload Utility Functions
 * Handles file uploads to the CDN server
 */

const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:8000'

/**
 * Upload a file to the CDN server
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name (default: 'documents')
 * @returns {Promise<string>} - The CDN URL of the uploaded file
 */
export const uploadToCDN = async (file, folder = 'documents') => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        // Add folder if specified
        // if (folder) {
        //     formData.append('folder', folder)
        // }

        const response = await fetch(`${CDN_BASE_URL}/api/cdn/upload`, {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed')
        }

        if (!data.success) {
            throw new Error(data.message || 'Upload failed')
        }

        return data.data.url // Return the CDN URL
    } catch (error) {
        console.error('CDN Upload Error:', error)
        throw new Error('Failed to upload file to CDN')
    }
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @param {number} options.maxSize - Maximum file size in bytes
 * @returns {boolean} - Whether the file is valid
 */
export const validateFile = (file, options = {}) => {
    const {
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        maxSize = 5 * 1024 * 1024 // 5MB default
    } = options

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        throw new Error(`File size must be less than ${maxSizeMB}MB`)
    }

    return true
}
