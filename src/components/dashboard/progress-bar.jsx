"use client"

export function ProgressBar({
    progress,
    size = "md",
    showPercentage = true,
    className = "",
    animated = true
}) {
    const sizeClasses = {
        sm: "h-1",
        md: "h-2",
        lg: "h-3"
    }

    const progressClass = sizeClasses[size] || sizeClasses.md

    return (
        <div className={`w-full ${className}`}>
            {showPercentage && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Progress</span>
                    <span className="text-white font-semibold text-sm">{progress}%</span>
                </div>
            )}
            <div className={`w-full bg-white/20 rounded-full ${progressClass}`}>
                <div
                    className={`bg-gradient-to-r from-purple-500 to-blue-500 ${progressClass} rounded-full transition-all duration-500 ease-out`}
                    style={{
                        width: `${progress}%`,
                        transition: animated ? 'width 500ms ease-out' : 'none'
                    }}
                />
            </div>
        </div>
    )
}
