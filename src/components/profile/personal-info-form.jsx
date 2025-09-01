import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { FormField } from "./form-field"

export function PersonalInfoForm({
    user,
    editedUser,
    isEditing,
    isLoading,
    onInputChange,
    onSave,
    onCancel
}) {
    const formFields = [
        { field: 'name', label: 'Full Name', placeholder: 'Enter your full name' },
        { field: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
        { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', disabled: true },
        { field: 'address', label: 'Address', placeholder: 'Enter your address' },
        { field: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age' },
        { field: 'instituteName', label: 'Institute Name', placeholder: 'Enter your institute name' },
        { field: 'semester', label: 'Semester', placeholder: 'Enter your semester' },
        { field: 'subject', label: 'Subject', placeholder: 'Enter your subject' }
    ]

    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>

            <div className="space-y-6">
                {/* Form Fields */}
                {formFields.map((fieldConfig) => (
                    <FormField
                        key={fieldConfig.field}
                        field={fieldConfig.field}
                        label={fieldConfig.label}
                        value={isEditing ? editedUser[fieldConfig.field] : user[fieldConfig.field]}
                        isEditing={isEditing}
                        isDisabled={fieldConfig.disabled}
                        type={fieldConfig.type}
                        placeholder={fieldConfig.placeholder}
                        onChange={onInputChange}
                    />
                ))}

                {/* Student ID (Read-only) */}
                <FormField
                    field="studentId"
                    label="Student ID"
                    value={user.studentId}
                    isEditing={false}
                    onChange={() => { }}
                />

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex space-x-4 pt-4">
                        <Button
                            onClick={onSave}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}
