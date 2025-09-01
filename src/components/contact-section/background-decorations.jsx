"use client"

import { motion } from "framer-motion"

export function BackgroundDecorations() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Floating orbs */}
            <motion.div
                className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -25, 0],
                    y: [0, 15, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            <motion.div
                className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl"
                animate={{
                    x: [0, 20, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                }}
            />

            <motion.div
                className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-3xl"
                animate={{
                    x: [0, -15, 0],
                    y: [0, 25, 0],
                    scale: [1, 0.8, 1],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Subtle dots */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>
        </div>
    )
}
