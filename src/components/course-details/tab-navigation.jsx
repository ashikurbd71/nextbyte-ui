"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Users, Star } from "lucide-react"

export default function TabNavigation({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'curriculum', label: 'Curriculum', icon: FileText },
        { id: 'instructor', label: 'Instructor', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star }
    ]

    return (
        <div className="border-b border-white/20">
            <div className="flex flex-wrap gap-1 p-2 sm:p-3 lg:p-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? 'default' : 'ghost'}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-1 lg:space-x-2 text-xs sm:text-sm lg:text-sm px-2 sm:px-3 py-1 sm:py-2 ${activeTab === tab.id
                                ? 'bg-purple-500 text-white'
                                : 'text-white hover:bg-white/20'
                                }`}
                        >
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-4 lg:h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
