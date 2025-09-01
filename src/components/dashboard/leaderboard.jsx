"use client"

import { motion } from "framer-motion"
import { Trophy, Users, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export default function Leaderboard({ leaderboardData, userRank, averageScore, totalStudents }) {
    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-500"
        if (score >= 80) return "text-blue-500"
        if (score >= 70) return "text-yellow-500"
        return "text-red-500"
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <Card className="p-3 sm:p-4 lg:p-6 bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-white/70">Your Rank</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">#{userRank}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4 lg:p-6 bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-white/70">Average Score</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{averageScore}%</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4 lg:p-6 bg-white/10 backdrop-blur-xl border-white/20 shadow-xl sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-white/70">Total Students</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{totalStudents}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Leaderboard List */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Leaderboard</h3>
                <div className="space-y-3 sm:space-y-4">
                    {leaderboardData?.map((student, index) => (
                        <motion.div
                            key={student.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 lg:p-6 rounded-xl border border-white/20 shadow-lg ${student.rank <= 3
                                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm"
                                : "bg-white/5 backdrop-blur-sm"
                                }`}
                        >
                            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-0">
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg text-sm sm:text-base">
                                    {student.rank}
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center backdrop-blur-sm border border-white/20 overflow-hidden flex-shrink-0">
                                        {student?.student?.photoUrl ? (
                                            <Image
                                                src={student.student.photoUrl}
                                                alt={student.studentName}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs sm:text-sm font-semibold text-white">
                                                {student?.studentName?.split(" ").map(n => n[0]).join("")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm sm:text-base lg:text-lg text-white truncate">{student?.studentName}</p>
                                        <p className="text-xs sm:text-sm text-white/70 hidden sm:block">{student?.assignmentCount} assignments completed • {student?.progress}% progress</p>
                                        <p className="text-xs text-white/70 sm:hidden">{student?.assignmentCount} assignments • {student?.progress}%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left sm:text-right flex sm:flex-col items-start sm:items-end space-x-4 sm:space-x-0 sm:space-y-1">
                                <div>
                                    <p className="text-lg sm:text-xl font-bold text-white">
                                        {student?.averageMarks}%
                                    </p>
                                    <p className="text-xs sm:text-sm text-white/70">
                                        Total: {student?.totalMarks} pts
                                    </p>
                                </div>
                                {student?.rank <= 3 && (
                                    <div className="flex items-center space-x-1 sm:space-x-2 sm:mt-2">
                                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                                        <span className="text-xs sm:text-sm text-yellow-400 font-medium">
                                            {student.rank === 1 ? "Gold" : student.rank === 2 ? "Silver" : "Bronze"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

