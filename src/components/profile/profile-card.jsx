import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { AvatarUpload } from "./avatar-upload"
import { ProfileStats } from "./profile-stats"

export function ProfileCard({
    user,
    isEditing,
    isUploading,
    fileInputRef,
    onCameraClick,
    onFileUpload,
    onEdit,
    onCancel,
    studentPerformance
}) {
    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <div className="text-center">
                {/* Avatar Section */}
                <AvatarUpload
                    photoUrl={user.photoUrl}
                    userName={user.name}
                    isUploading={isUploading}
                    onCameraClick={onCameraClick}
                    fileInputRef={fileInputRef}
                    onFileUpload={onFileUpload}
                />

                {/* User Info */}
                <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-white/60 text-sm mb-4">Student ID: {user.studentId}</p>
                <p className="text-white/60 text-sm mb-6">Member since {user.joinDate}</p>

                {/* Stats */}
                <ProfileStats
                    totalCourses={studentPerformance.totalEnrollments}
                    completedCourses={studentPerformance.completedCourses}
                />

                {/* Edit Button */}
                <Button
                    onClick={isEditing ? onCancel : onEdit}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
            </div>
        </Card>
    )
}
