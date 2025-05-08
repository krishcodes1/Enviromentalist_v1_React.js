"use client"

import { AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
