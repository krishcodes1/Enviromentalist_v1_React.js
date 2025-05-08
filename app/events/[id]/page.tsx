import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { RsvpButton } from "@/components/events/rsvp-button"
import { Logo } from "@/components/ui/logo"
import { AddToEventsButton } from "@/components/events/add-to-events-button"

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch event details
  const { data: event, error } = await supabase
    .from("events")
    .select("*, profiles(username, avatar_url)")
    .eq("id", params.id)
    .single()

  if (error || !event) {
    console.error("Error fetching event:", error)
    redirect("/events")
  }

  // Fetch event participants
  const { data: participants, error: participantsError } = await supabase
    .from("event_participants")
    .select("count")
    .eq("event_id", params.id)
    .single()

  const participantCount = participants?.count || 0

  // Check if user is already participating
  const { data: userParticipation } = await supabase
    .from("event_participants")
    .select("*")
    .eq("event_id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle()

  // Format date
  const eventDate = new Date(event.start_time)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  console.log("Event data:", event)
  console.log("Participant count:", participantCount)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Image */}
      <div className="relative h-80 bg-primary leaf-pattern-bg">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/events">
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Logo size="sm" color="white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {event.image_url ? (
            <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-64 h-64 object-contain" />
          ) : (
            <img src="/placeholder.svg?key=tonn0" alt={event.title} className="w-64 h-64 object-contain" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-2xl -mt-6 relative z-10 p-4">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-xl font-bold text-primary">
            {event.title}{" "}
            <span className="text-black text-lg">| {event.location?.split(",")[1]?.trim() || "Virtual"}</span>
          </h1>
          <AddToEventsButton
            eventId={event.id}
            isParticipating={!!userParticipation}
            participantCount={participantCount}
          />
        </div>

        <div className="flex gap-2 mb-3">
          <span className="px-3 py-0.5 bg-primary text-white rounded-full text-xs">{event.category.toLowerCase()}</span>
          <span className="px-3 py-0.5 bg-primary text-white rounded-full text-xs">Community</span>
        </div>

        <div className="flex items-center mb-4">
          <div className="text-amber-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-base font-bold ml-1">4.5</span>
          <span className="text-gray-500 text-sm ml-2">BY- {event.profiles?.username || "Anonymous"}</span>
        </div>

        <p className="text-primary text-sm mb-4">{event.description}</p>

        <p className="text-primary text-sm mb-4">
          <strong>Address -</strong> {event.location || "Virtual Event"}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Signed up</p>
              <p className="text-base">{participantCount} People</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Date</p>
              <p className="text-base">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Duration</p>
              <p className="text-base">
                {new Date(event.end_time).getHours() - new Date(event.start_time).getHours()} hours
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h0M12 15h0M17 15h0" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Impact Points</p>
              <p className="text-base">50 points</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
            <Trash2 className="h-5 w-5 text-primary" />
          </Button>

          <div className="flex-1 mx-3">
            <RsvpButton eventId={event.id} isParticipating={!!userParticipation} size="default" />
          </div>

          <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
            <Heart className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  )
}
