import { useRef } from "react"
import { Camera } from "lucide-react"
import Image from "next/image"

export function AvatarUpload({
    photoUrl,
    userName,
    isUploading,
    onCameraClick,
    fileInputRef,
    onFileUpload
}) {
    return (
        <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
                <Image
                    src={photoUrl}
                    alt={userName}
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            <button
                onClick={onCameraClick}
                disabled={isUploading}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <Camera className="w-4 h-4 text-white" />
                )}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileUpload}
                className="hidden"
                accept="image/*"
            />
        </div>
    )
}
