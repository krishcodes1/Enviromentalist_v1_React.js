"use client"

import { motion, type MotionProps } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedContainerProps extends MotionProps {
  children: ReactNode
  className?: string
  delay?: number
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideInLeft" | "slideInRight" | "scale" | "none"
}

export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  animation = "fadeIn",
  ...motionProps
}: AnimatedContainerProps) {
  // Define animation variants
  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.4,
          delay,
        },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          delay,
        },
      },
    },
    slideDown: {
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          delay,
        },
      },
    },
    slideInLeft: {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.4,
          delay,
        },
      },
    },
    slideInRight: {
      hidden: { opacity: 0, x: 20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.4,
          delay,
        },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.3,
          delay,
        },
      },
    },
    none: {
      hidden: {},
      visible: {},
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants[animation]}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}
