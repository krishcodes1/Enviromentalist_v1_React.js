"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function CreatePostFAB() {
  return (
    <motion.div
      className="fixed right-4 bottom-20 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90" asChild>
        <Link href="/post/create">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Post</span>
        </Link>
      </Button>
    </motion.div>
  )
}
