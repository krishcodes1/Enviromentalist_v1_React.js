"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyJoinedEvents() {
  const [joinedEvents, setJoinedEvents] = useState<string[]>([])

  useEffect(() => {
    // Get joined events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
    setJoinedEvents(storedEvents)
  }, [])

  if (joinedEvents.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">My Joined Events</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          You've joined {joinedEvents.length} event{joinedEvents.length !== 1 ? "s" : ""}.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Your participation is tracked in this browser. View your profile to see all your events.
        </p>
      </CardContent>
    </Card>
  )
}
