"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export function OtpInput({ value, onChange, length = 4, disabled = false }) {
    const [otp, setOtp] = useState(new Array(length).fill(""))
    const inputRefs = useRef([])

    useEffect(() => {
        // Update internal state when external value changes
        if (value) {
            const otpArray = value.split("").slice(0, length)
            const newOtp = [...otpArray, ...new Array(length).fill("")].slice(0, length)
            setOtp(newOtp)
        } else {
            setOtp(new Array(length).fill(""))
        }
    }, [value, length])

    const handleChange = (index, inputValue) => {
        if (disabled) return

        // Only allow numeric input
        const numericValue = inputValue.replace(/\D/g, "")

        if (numericValue.length > 1) return // Prevent multiple characters

        const newOtp = [...otp]
        newOtp[index] = numericValue
        setOtp(newOtp)

        // Call parent onChange
        const otpString = newOtp.join("")
        console.log(`OTP Input ${index}: "${numericValue}" -> OTP: "${otpString}"`)
        onChange(otpString)

        // Move to next input if value is entered
        if (numericValue && index < length - 1) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus()
            }, 10)
        }
    }

    const handleKeyDown = (index, e) => {
        if (disabled) return

        // Handle backspace
        if (e.key === "Backspace") {
            e.preventDefault()
            if (otp[index]) {
                // Clear current input
                const newOtp = [...otp]
                newOtp[index] = ""
                setOtp(newOtp)
                onChange(newOtp.join(""))
            } else if (index > 0) {
                // Move to previous input and clear it
                const newOtp = [...otp]
                newOtp[index - 1] = ""
                setOtp(newOtp)
                onChange(newOtp.join(""))
                inputRefs.current[index - 1]?.focus()
            }
        }

        // Handle arrow keys
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Handle delete key
        if (e.key === "Delete") {
            e.preventDefault()
            const newOtp = [...otp]
            newOtp[index] = ""
            setOtp(newOtp)
            onChange(newOtp.join(""))
        }

        // Handle number keys (0-9)
        if (/^[0-9]$/.test(e.key)) {
            // This will be handled by onChange
        }
    }

    const handlePaste = (e) => {
        if (disabled) return

        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length)

        if (pastedData.length > 0) {
            const newOtp = [...otp]
            for (let i = 0; i < length; i++) {
                newOtp[i] = pastedData[i] || ""
            }
            setOtp(newOtp)
            onChange(newOtp.join(""))

            // Focus the next empty input or the last input
            const nextIndex = Math.min(pastedData.length, length - 1)
            setTimeout(() => {
                inputRefs.current[nextIndex]?.focus()
            }, 10)
        }
    }

    const handleFocus = (index) => {
        // Select all text when focusing
        inputRefs.current[index]?.select()
    }

    const handleClick = (index) => {
        // Focus and select text when clicking
        inputRefs.current[index]?.focus()
        inputRefs.current[index]?.select()
    }

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    onClick={() => handleClick(index)}
                    disabled={disabled}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileFocus={{ scale: 1.05 }}
                    autoComplete="one-time-code"
                    data-testid={`otp-input-${index}`}
                />
            ))}
        </div>
    )
}
