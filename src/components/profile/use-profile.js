import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { updateUserById } from "@/app/apis/users-apis/userApis"
import { uploadToCDN } from "@/lib/cdn-upload"
import { toast } from 'sonner'

export function useProfile() {
    const { user: authUser, updateUser } = useAuth()
    const fileInputRef = useRef(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Create user state that automatically syncs with authUser
    const [user, setUser] = useState(() => {
        if (!authUser) return {
            name: "",
            phone: "",
            email: "",
            address: "",
            age: "",
            instituteName: "",
            semester: "",
            subject: "",
            studentId: "",
            photoUrl: "/ceo.png",
            joinDate: "Unknown",
            totalCourses: 12,
            completedCourses: 8,
            totalHours: 156,
            currentStreak: 7
        }

        return {
            name: authUser.name || "",
            phone: authUser.phone || "",
            email: authUser.email || "",
            address: authUser.address || "",
            age: authUser.age || "",
            instituteName: authUser.instituteName || "",
            semester: authUser.semester || "",
            subject: authUser.subject || "",
            studentId: authUser.studentid || "",
            photoUrl: authUser.photoUrl || "/ceo.png",
            joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Unknown",
            totalCourses: 12,
            completedCourses: 8,
            totalHours: 156,
            currentStreak: 7
        }
    })

    const [editedUser, setEditedUser] = useState({ ...user })

    // Update user state when authUser changes - this ensures real-time updates
    useEffect(() => {
        if (authUser) {
            const updatedUser = {
                name: authUser.name || "",
                phone: authUser.phone || "",
                email: authUser.email || "",
                address: authUser.address || "",
                age: authUser.age || "",
                instituteName: authUser.instituteName || "",
                semester: authUser.semester || "",
                subject: authUser.subject || "",
                studentId: authUser.studentid || "",
                photoUrl: authUser.photoUrl || "/ceo.png",
                joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Unknown",
                totalCourses: 12,
                completedCourses: 8,
                totalHours: 156,
                currentStreak: 7
            }
            setUser(updatedUser)
            // Only update editedUser if not currently editing
            if (!isEditing) {
                setEditedUser(updatedUser)
            }
        }
    }, [authUser, isEditing])

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setIsUploading(true)
        try {
            const cdnUrl = await uploadToCDN(file, 'profile-photos')
            const updateData = { photoUrl: cdnUrl }
            const response = await updateUserById(authUser.id, updateData)

            // Update local state immediately for real-time feedback
            setUser(prev => ({ ...prev, photoUrl: cdnUrl }))
            setEditedUser(prev => ({ ...prev, photoUrl: cdnUrl }))

            // Update auth context with the new user data
            if (response.user) {
                updateUser(response.user)
            } else if (response) {
                // If response doesn't have user property, use the response directly
                updateUser(response)
            }

            toast.success('Profile photo updated successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to upload profile photo')
        } finally {
            setIsUploading(false)
        }
    }

    // Handle camera button click
    const handleCameraClick = () => {
        fileInputRef.current?.click()
    }

    // Handle save profile changes
    const handleSave = async () => {
        setIsLoading(true)
        try {
            const updateData = {
                name: editedUser.name,
                email: editedUser.email,
                address: editedUser.address,
                age: editedUser.age ? parseInt(editedUser.age) : null,
                instituteName: editedUser.instituteName,
                semester: editedUser.semester,
                subject: editedUser.subject,
                photoUrl: editedUser.photoUrl
            }

            const response = await updateUserById(authUser.id, updateData)

            // Update local state immediately for real-time feedback
            setUser(prev => ({ ...prev, ...editedUser }))

            // Update auth context with the new user data
            if (response.user) {
                updateUser(response.user)
            } else if (response) {
                // If response doesn't have user property, use the response directly
                updateUser(response)
            }

            setIsEditing(false)
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error(error.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle edit mode
    const handleEdit = () => {
        setEditedUser({
            ...user,
            photoUrl: user.photoUrl
        })
        setIsEditing(true)
    }

    // Handle cancel editing
    const handleCancel = () => {
        setEditedUser({ ...user })
        setIsEditing(false)
    }

    // Handle input changes
    const handleInputChange = (field, value) => {
        setEditedUser(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return {
        user,
        editedUser,
        isEditing,
        isUploading,
        isLoading,
        fileInputRef,
        handleFileUpload,
        handleCameraClick,
        handleSave,
        handleEdit,
        handleCancel,
        handleInputChange
    }
}
