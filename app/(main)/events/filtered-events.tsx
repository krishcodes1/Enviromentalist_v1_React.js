"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { RsvpButton } from "@/components/events/rsvp-button"

interface Event {
  id: string
  title: string
  description: string
  location: string | null
  is_virtual: boolean
  start_time: string
  end_time: string
  category: string
  image_url: string | null
  tags: string[] | null
  participants?: { user_id: string }[]
  profiles?: { username: string; avatar_url: string | null }
  attendee_count?: number
}

interface FilteredEventsProps {
  initialEvents: Event[]
  userId: string
  categories: string[]
  filters?: {
    search: string
    category: string
    date: Date | undefined
    tags: string[]
  }
}

export function FilteredEvents({
  initialEvents,
  userId,
  categories,
  filters = {
    search: "",
    category: "",
    date: undefined,
    tags: [],
  },
}: FilteredEventsProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)

  console.log("Initial events:", initialEvents.length)
  console.log("Filters:", filters)

  // Apply filters whenever they change
  useEffect(() => {
    let filteredEvents = [...initialEvents]
    console.log("Filtering events, starting with:", filteredEvents.length)

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          (event.location && event.location.toLowerCase().includes(searchLower)),
      )
      console.log("After search filter:", filteredEvents.length)
    }

    // Apply category filter
    if (filters.category) {
      filteredEvents = filteredEvents.filter((event) => event.category === filters.category)
      console.log("After category filter:", filteredEvents.length)
    }

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date)
      filterDate.setHours(0, 0, 0, 0)

      filteredEvents = filteredEvents.filter((event) => {
        if (!event.start_time) return false
        const eventDate = new Date(event.start_time)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === filterDate.getTime()
      })
      console.log("After date filter:", filteredEvents.length)
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredEvents = filteredEvents.filter(
        (event) => event.tags && filters.tags.some((tag) => event.tags?.includes(tag)),
      )
      console.log("After tags filter:", filteredEvents.length)
    }

    setEvents(filteredEvents)
  }, [filters, initialEvents])

  // Group events by date
  const eventsByDate: Record<string, Event[]> = {}
  events.forEach((event) => {
    if (!event.start_time) return
    const date = new Date(event.start_time).toLocaleDateString()
    if (!eventsByDate[date]) {
      eventsByDate[date] = []
    }
    eventsByDate[date].push(event)
  })

  return (
    <div className="space-y-6">
      {Object.keys(eventsByDate).length > 0 ? (
        Object.entries(eventsByDate).map(([date, dateEvents]) => (
          <section key={date}>
            <h2 className="text-lg font-medium mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">{date}</h2>
            <div className="space-y-4">
              {dateEvents.map((event) => {
                const isParticipating =
                  event.participants?.some((participant) => participant.user_id === userId) || false

                return (
                  <Card key={event.id} className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-0">
                      {event.image_url && (
                        <div className="h-40 w-full overflow-hidden">
                          <img
                            src={event.image_url || "/placeholder.svg"}
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {event.start_time &&
                                  new Date(event.start_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                {" - "}
                                {event.end_time &&
                                  new Date(event.end_time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {event.category}
                            </span>
                            <div className="flex gap-2">
                              <RsvpButton eventId={event.id} isParticipating={isParticipating} size="sm" />
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mt-3 line-clamp-2">{event.description}</p>
                        {event.tags && event.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {event.tags.map((tag, index) => (
                              <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{event.attendee_count || event.participants?.length || 0} attending</span>
                          </div>
                          <Button asChild>
                            <Link href={`/events/${event.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl p-6">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No events found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or check back later</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
