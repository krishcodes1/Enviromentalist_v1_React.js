"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CalendarPlus, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface RsvpButtonProps {
  eventId: string
  initialStatus?: "not-joined" | "joined"
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline"
}

export function RsvpButton({
  eventId,
  initialStatus = "not-joined",
  size = "default",
  variant = "default",
}: RsvpButtonProps) {
  const [status, setStatus] = useState<"not-joined" | "joined" | "loading">(initialStatus)
  const router = useRouter()

  // Check localStorage on mount to see if user has already joined this event
  useEffect(() => {
    const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
    if (joinedEvents.includes(eventId)) {
      setStatus("joined")
    }
  }, [eventId])

  const handleRsvp = async () => {
    if (status === "loading" || status === "joined") return

    setStatus("loading")

    try {
      // Update localStorage first for immediate feedback
      const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")

      if (!joinedEvents.includes(eventId)) {
        joinedEvents.push(eventId)
        localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents))

        // Set a timestamp for the update
        localStorage.setItem("eventAttendanceLastUpdate", Date.now().toString())

        // Dispatch a storage event to notify other tabs
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "eventAttendanceLastUpdate",
            newValue: Date.now().toString(),
          }),
        )
      }

      // Then try to update the server
      const formData = new FormData()
      formData.append("eventId", eventId)

      const response = await fetch("/api/events/join", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        console.error("Error joining event:", data)
        // We don't revert the UI state even if the server request fails
        // This provides a better user experience
      } else {
        // Refresh the router to update any server components
        setTimeout(() => {
          router.refresh()
        }, 500)
      }

      setStatus("joined")
    } catch (error) {
      console.error("Error joining event:", error)
      // We still keep the "joined" state for better UX
      setStatus("joined")
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        onClick={handleRsvp}
        disabled={status === "loading" || status === "joined"}
        size={size}
        variant={status === "joined" ? "outline" : variant}
        className={status === "joined" ? "bg-green-50 text-green-700 border-green-200" : ""}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : status === "joined" ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Attending
          </>
        ) : (
          <>
            <CalendarPlus className="mr-2 h-4 w-4" />
            RSVP
          </>
        )}
      </Button>
    </motion.div>
  )
}
