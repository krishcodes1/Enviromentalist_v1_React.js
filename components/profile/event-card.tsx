"use client"

import Link from "next/link"
import { CalendarDays, MapPin, Clock, ArrowRight, Users } from "lucide-react"
import { formatDistanceToNow, format, isPast } from "date-fns"
import { motion } from "framer-motion"

interface EventCardProps {
  event: any
  isPast?: boolean
}

export function EventCard({ event, isPast: forcePast = false }: EventCardProps) {
  const startDate = new Date(event.start_time)
  const isEventPast = forcePast || isPast(startDate)

  // Format the date
  const formattedDate = format(startDate, "EEEE, MMMM d, yyyy")
  const formattedTime = format(startDate, "h:mm a")

  // Calculate time until event
  const timeUntil = isEventPast
    ? `Ended ${formatDistanceToNow(startDate, { addSuffix: true })}`
    : `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`

  return (
    <motion.div
      className={`relative ${isEventPast ? "opacity-75" : ""}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {isEventPast && (
        <div className="absolute top-0 right-0 bg-gray-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">
          Past
        </div>
      )}
      <Link href={`/events/${event.id}`} className="block hover:bg-gray-50 rounded-lg transition-colors">
        <div className="card-glass p-4">
          <div className="flex items-start">
            <div className="w-16 h-16 flex-shrink-0 mr-4 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
              {event.image_url ? (
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{event.title}</h3>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span>{timeUntil}</span>
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <CalendarDays className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span>
                  {formattedDate} at {formattedTime}
                </span>
              </div>

              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span>{event.location || "Virtual Event"}</span>
              </div>

              {event.attendee_count && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Users className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span>
                    {event.attendee_count} {event.attendee_count === 1 ? "person" : "people"} attending
                  </span>
                </div>
              )}
            </div>

            <div className="ml-4 mt-1">
              <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
