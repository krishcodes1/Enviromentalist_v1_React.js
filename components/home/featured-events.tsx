"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { motion } from "framer-motion"

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
}

interface FeaturedEventsProps {
  events: Event[]
  compact?: boolean
}

export function FeaturedEvents({ events, compact = false }: FeaturedEventsProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with carousel
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Sort events by date (closest first) and take the first 5
  const featuredEvents = [...events]
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5)

  if (featuredEvents.length === 0) return null

  if (compact) {
    // Compact mobile view with horizontal scroll
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Upcoming Events</h2>
          <Link href="/events" className="text-white text-xs flex items-center font-bold">
            View all <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-3 scrollbar-hide">
          {featuredEvents.map((event) => (
            <motion.div
              key={event.id}
              className="flex-shrink-0 w-48"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-24 w-full overflow-hidden">
                    <img
                      src={event.image_url || "/placeholder.svg?height=96&width=192&query=environmental event"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(event.start_time).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <Link href={`/events/${event.id}`} className="mt-2 block">
                      <Button size="sm" className="w-full text-xs h-7">
                        Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Desktop view with carousel
  return (
    <div className="space-y-4">
      <Carousel className="w-full">
        <CarouselContent>
          {featuredEvents.map((event) => (
            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1">
              <Card className="h-full bg-white/30 backdrop-blur-lg border border-white/30 shadow-sm hover:bg-white/40 transition-all duration-300 rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={event.image_url || "/placeholder.svg?height=128&width=256&query=environmental event"}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-base line-clamp-1">{event.title}</h3>
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(event.start_time).toLocaleDateString()} •{" "}
                          {new Date(event.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      <div className="mt-3">
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}
