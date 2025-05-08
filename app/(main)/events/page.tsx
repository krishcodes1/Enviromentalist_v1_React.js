import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EventsClientPage } from "./page-client"

export default async function EventsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch events without the non-existent attendee_count column
  const { data: events, error } = await supabase
    .from("events")
    .select(`
    id,
    title,
    description,
    location,
    is_virtual,
    start_time,
    end_time,
    max_attendees,
    category,
    tags,
    image_url,
    is_recurring,
    recurring_pattern,
    created_at,
    updated_at,
    creator_id,
    profiles(username, avatar_url),
    participants:event_participants(user_id)
  `)
    .order("start_time", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return <div>Error loading events. Please try again later.</div>
  }

  console.log("Fetched events:", events?.length || 0)

  // Extract unique categories for filters
  const categories = [...new Set(events?.map((event) => event.category) || [])]

  return <EventsClientPage events={events || []} userId={session.user.id} categories={categories} />
}
