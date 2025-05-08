import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Edit, Plus, Trash2, Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MyEventsPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch events created by the user
  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      participants:event_participants(count)
    `)
    .eq("creator_id", session.user.id)
    .order("start_time", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
  }

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events?.filter((event) => new Date(event.start_time) > now) || []
  const pastEvents = events?.filter((event) => new Date(event.start_time) <= now) || []

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <Header title="My Events" />
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href="/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Link>
          </Button>
        </div>
      </div>

      {events && events.length > 0 ? (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                <p className="text-gray-500 mb-6">You don't have any upcoming events scheduled.</p>
                <Button asChild>
                  <Link href="/events/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No past events</h3>
                <p className="text-gray-500">You haven't organized any events in the past.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center">
          <h3 className="text-lg font-medium mb-2">You haven't created any events yet</h3>
          <p className="text-gray-500 mb-6">Create your first event and invite others to join!</p>
          <Button asChild>
            <Link href="/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  const startDate = new Date(event.start_time)
  const endDate = new Date(event.end_time)
  const participantCount = event.participants?.[0]?.count || 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="relative">
            <div className="h-32 w-full md:w-32 md:h-full bg-primary-100">
              {event.image_url ? (
                <img
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                  {event.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isPast && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Past Event</span>
              </div>
            )}
          </div>

          <div className="p-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-medium text-lg">{event.title}</h3>
                <div className="flex flex-col space-y-1 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {format(startDate, "EEEE, MMMM d, yyyy")}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {event.is_virtual ? "Virtual Event" : event.location || "No location specified"}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {participantCount} {participantCount === 1 ? "participant" : "participants"}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/events/${event.id}`}>View</Link>
                </Button>
                {!isPast && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events/edit/${event.id}`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Link>
                  </Button>
                )}
                <Button variant="destructive" size="sm" asChild>
                  <Link href={`/events/delete/${event.id}`}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
