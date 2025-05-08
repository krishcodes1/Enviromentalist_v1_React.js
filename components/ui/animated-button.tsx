"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Button variant={variant} size={size} className={cn(className)} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
