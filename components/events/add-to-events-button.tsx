"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"

interface AddToEventsButtonProps {
  eventId: string
  isParticipating: boolean
  participantCount: number
}

export function AddToEventsButton({ eventId, isParticipating, participantCount }: AddToEventsButtonProps) {
  const [joined, setJoined] = useState(isParticipating)
  const [count, setCount] = useState(participantCount)
  const [isLoading, setIsLoading] = useState(false)

  // Check localStorage on component mount
  useEffect(() => {
    const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
    if (joinedEvents.includes(eventId)) {
      setJoined(true)
    }
  }, [eventId])

  const handleAddToEvents = async () => {
    if (joined) return

    setIsLoading(true)

    try {
      // Update local state
      setJoined(true)
      setCount(count + 1)

      // Store in localStorage
      const joinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
      if (!joinedEvents.includes(eventId)) {
        joinedEvents.push(eventId)
        localStorage.setItem("joinedEvents", JSON.stringify(joinedEvents))
      }

      // Try to update the database
      const formData = new FormData()
      formData.append("eventId", eventId)

      const response = await fetch("/api/events/join", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.warn("Server-side update failed, but UI remains updated")
      }
    } catch (error) {
      console.error("Error joining event:", error)
      // Don't revert UI state to maintain good UX
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToEvents}
      disabled={joined || isLoading}
      size="sm"
      variant="outline"
      className={`rounded-full ${joined ? "bg-green-100 text-green-700 border-green-300" : ""}`}
    >
      {joined ? (
        <>
          <Check className="h-4 w-4 mr-1" /> Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-1" /> Add
        </>
      )}
    </Button>
  )
}
