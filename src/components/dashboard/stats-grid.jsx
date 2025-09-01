"use client"

import { motion } from "framer-motion"
import { BookOpen, Trophy, Calendar, ChartColumnIncreasing, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function StatsGrid({ stats }) {
    console.log(stats)
    const statItems = [

        {
            icon: Trophy,
            label: "Total Enrollments",
            value: stats?.totalEnrollments,
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: BookOpen,
            label: "Courses Completed",
            value: stats?.completedCourses,
            gradient: "from-blue-500 to-purple-500"
        },
        {
            icon: ChartColumnIncreasing,
            label: "Average Progress",
            value: `${stats?.averageProgress}%`,
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: DollarSign,
            label: "Total Spent",
            value: `${stats?.totalSpent}`,
            gradient: "from-pink-500 to-rose-500"
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8"
        >
            {statItems.map((item, index) => (
                <Card key={item.label} className="bg-white/10 backdrop-blur-xl border-white/20 p-3 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mx-auto sm:mx-0`}>
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-white/70 text-xs lg:text-sm">{item.label}</p>
                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{item.value}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </motion.div>
    )
}
