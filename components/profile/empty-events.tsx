"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function EmptyEvents() {
  const [hasJoinedEvents, setHasJoinedEvents] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has joined any events in localStorage
    const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
    setHasJoinedEvents(joinedEvents.length > 0)
    setIsLoading(false)

    // Listen for changes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "joinedEvents" || e.key === "eventAttendanceLastUpdate") {
        const updatedJoinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
        setHasJoinedEvents(updatedJoinedEvents.length > 0)

        // If events were joined, refresh the page after a short delay
        if (updatedJoinedEvents.length > 0) {
          setIsLoading(true)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    }

    // Listen for custom event
    const handleEventJoined = () => {
      setHasJoinedEvents(true)
      setIsLoading(true)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("eventJoined", handleEventJoined)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("eventJoined", handleEventJoined)
    }
  }, [])

  if (isLoading && hasJoinedEvents) {
    return (
      <motion.div
        className="p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-3 inline-flex rounded-full bg-primary/10 p-3">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
        <h3 className="text-lg font-medium mb-1">Loading your events...</h3>
        <p className="text-gray-500 text-sm mb-4">Just a moment while we update your events</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-3 inline-flex rounded-full bg-gray-100 p-3"
        whileHover={{ rotate: 15, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <CalendarDays className="h-6 w-6 text-gray-500" />
      </motion.div>
      <h3 className="text-lg font-medium mb-1">No events yet</h3>
      <p className="text-gray-500 text-sm mb-4">Join events to see them here</p>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button asChild>
          <Link href="/events">Browse Events</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}
