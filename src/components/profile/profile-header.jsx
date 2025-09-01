import { motion } from "framer-motion"

export function ProfileHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-white/70">Manage your account settings and preferences</p>
        </motion.div>
    )
}
