"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function WelcomeSection({ user }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 lg:mb-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 mx-auto sm:mx-0">
                    <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-white/70 text-sm lg:text-base">
                        Continue your learning journey with NextByte
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
