"use client"

import { motion } from "framer-motion"

type LoadingSpinnerProps = {
  size?: number
  color?: string
  className?: string
}

export function LoadingSpinner({ size = 24, color = "currentColor", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.2" />
        <motion.path d="M12 2C6.47715 2 2 6.47715 2 12" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </motion.svg>
    </div>
  )
}
