import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Award, Clock, ChevronRight, User, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { EventCard } from "@/components/profile/event-card"
import { EmptyEvents } from "@/components/profile/empty-events"

export default async function ProfilePage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
  }

  // Fetch user's joined events with more details
  const { data: joinedEvents, error: eventsError } = await supabase
    .from("event_participants")
    .select(`
      *,
      events:event_id(
        id,
        title,
        description,
        location,
        is_virtual,
        start_time,
        end_time,
        image_url,
        category,
        creator_id,
        profiles:creator_id(username, avatar_url)
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (eventsError) {
    console.error("Error fetching joined events:", eventsError)
  }

  // Process events to separate upcoming and past events
  const now = new Date()
  const upcomingEvents = []
  const pastEvents = []

  joinedEvents?.forEach((participation) => {
    if (!participation.events) return

    const event = participation.events
    const startTime = new Date(event.start_time)

    if (startTime > now) {
      upcomingEvents.push(event)
    } else {
      pastEvents.push(event)
    }
  })

  // Sort upcoming events by start time (nearest first)
  upcomingEvents.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  // Sort past events by start time (most recent first)
  pastEvents.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

  // Format join date
  const joinDate = profile?.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "May 2023" // Fallback

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <Header title="Profile" />
      </div>

      {/* User Profile Card */}
      <Card className="mb-6 rounded-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary-900 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
              <p className="text-gray-500">@{profile?.username || "username"}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">
              {profile?.bio || "Environmental enthusiast passionate about making our planet greener."}
            </p>
            {profile?.location && <p className="text-gray-500 text-sm mt-2">📍 {profile.location}</p>}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-900">{profile?.reputation_points || 0}</span>
              <span className="text-gray-500 ml-2">Impact Points</span>
            </div>
            <Button variant="outline" asChild>
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
          <h2 className="text-lg font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Your Upcoming Events
          </h2>
          <div className="flex space-x-2">
            <Link href="/events/my-events" className="text-sm text-primary-900">
              My Events
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/events" className="text-sm text-primary-900">
              Find events
            </Link>
          </div>
        </div>
        <Card className="rounded-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {upcomingEvents.length > 0 ? (
              <ul className="divide-y">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="p-4">
                    <EventCard event={event} />
                  </li>
                ))}
                {upcomingEvents.length > 3 && (
                  <li className="p-4 text-center">
                    <Link href="/profile/events" className="text-primary-900 text-sm font-medium hover:underline">
                      View all {upcomingEvents.length} upcoming events
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <EmptyEvents />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Past Events (only show if there are any) */}
      {pastEvents.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
            <h2 className="text-lg font-bold flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Past Events
            </h2>
            {pastEvents.length > 3 && (
              <Link href="/profile/events?tab=past" className="text-sm text-primary-900">
                View all
              </Link>
            )}
          </div>
          <Card className="rounded-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <ul className="divide-y">
                {pastEvents.slice(0, 3).map((event) => (
                  <li key={event.id} className="p-4">
                    <EventCard event={event} isPast={true} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Impact History */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
          <h2 className="text-lg font-bold flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Impact History
          </h2>
          <Link href="/profile/impact" className="text-sm text-primary-900">
            View all
          </Link>
        </div>
        <Card className="rounded-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {joinedEvents && joinedEvents.length > 0 ? (
              <ul className="divide-y">
                {[
                  { activity: "Beach Cleanup", date: "May 15, 2023", points: 30 },
                  { activity: "Tree Planting", date: "May 10, 2023", points: 50 },
                  { activity: "Recycling Drive", date: "May 5, 2023", points: 25 },
                ].map((impact, index) => (
                  <li key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{impact.activity}</h3>
                        <p className="text-sm text-gray-500">{impact.date}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-primary-900 mr-2">+{impact.points}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="mb-3 inline-flex rounded-full bg-gray-100 p-3">
                  <Award className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No impact history yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Join events to start building your environmental impact history.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
          <h2 className="text-lg font-bold flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Badges
          </h2>
          <Link href="/profile/badges" className="text-sm text-primary-900">
            View all
          </Link>
        </div>
        <Card className="rounded-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {["Protector", "Planter", "Recycler"].map((badge, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-primary-900/10 flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-primary-900" />
                  </div>
                  <span className="text-xs font-medium text-center">{badge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
