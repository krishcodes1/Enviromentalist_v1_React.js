"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image_url?: string
}

export function JoinedEventsList({ events }: { events: Event[] }) {
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([])
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([])

  // Load joined events from localStorage
  useEffect(() => {
    const storedJoinedEvents = JSON.parse(localStorage.getItem("joinedEvents") || "[]")
    setJoinedEventIds(storedJoinedEvents)
  }, [])

  // Filter events based on joined IDs
  useEffect(() => {
    if (joinedEventIds.length > 0) {
      const filtered = events.filter((event) => joinedEventIds.includes(event.id))
      setJoinedEvents(filtered)
    }
  }, [joinedEventIds, events])

  if (joinedEvents.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Your Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {joinedEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={event.image_url || "/placeholder.svg?height=200&width=400&query=environmental event"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>You're attending</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Link href={`/events/${event.id}`} className="text-green-600 hover:text-green-800 font-medium">
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
