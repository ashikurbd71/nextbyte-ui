export function ProfileStats({ totalCourses, completedCourses }) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalCourses}</p>
                <p className="text-white/60 text-sm">Total Courses</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-white">{completedCourses}</p>
                <p className="text-white/60 text-sm">Completed</p>
            </div>
        </div>
    )
}
