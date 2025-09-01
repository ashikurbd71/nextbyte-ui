import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Hash } from "lucide-react"

const iconMap = {
    name: User,
    email: Mail,
    phone: Phone,
    address: MapPin,
    age: GraduationCap,
    instituteName: BookOpen,
    semester: Hash,
    subject: BookOpen,
    studentId: Hash
}

export function FormField({
    field,
    label,
    value,
    isEditing,
    isDisabled = false,
    type = "text",
    placeholder,
    onChange
}) {
    const IconComponent = iconMap[field]

    return (
        <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
                {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    disabled={isDisabled}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={placeholder}
                />
            ) : (
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg">
                    <IconComponent className="w-5 h-5 text-white/60" />
                    <span className="text-white">{value}</span>
                </div>
            )}
        </div>
    )
}
