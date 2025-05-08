"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type EventData = {
  id: string
  title: string
  description: string
  location: string | null
  is_virtual: boolean
  start_time: string
  end_time: string
  max_attendees: number | null
  category: string
  tags: string[]
  image_url: string | null
}

export async function updateEvent(eventData: EventData) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    // Verify the user is the creator of the event
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("creator_id, title")
      .eq("id", eventData.id)
      .single()

    if (fetchError) {
      return { error: "Failed to fetch event" }
    }

    if (!event || event.creator_id !== session.user.id) {
      return { error: "Unauthorized: You can only edit your own events" }
    }

    // Validate required fields
    if (!eventData.title) return { error: "Event title is required" }
    if (!eventData.description) return { error: "Event description is required" }
    if (!eventData.is_virtual && !eventData.location) return { error: "Location is required for in-person events" }
    if (!eventData.start_time) return { error: "Start time is required" }
    if (!eventData.end_time) return { error: "End time is required" }
    if (!eventData.category) return { error: "Category is required" }

    // Validate start and end times
    const startTime = new Date(eventData.start_time)
    const endTime = new Date(eventData.end_time)

    if (endTime <= startTime) {
      return { error: "End time must be after start time" }
    }

    // Update the event
    const { error: updateError } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        is_virtual: eventData.is_virtual,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        max_attendees: eventData.max_attendees,
        category: eventData.category,
        tags: eventData.tags,
        image_url: eventData.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventData.id)

    if (updateError) {
      console.error("Error updating event:", updateError)
      return { error: `Error updating event: ${updateError.message}` }
    }

    // Revalidate the events pages
    revalidatePath("/events")
    revalidatePath("/events/my-events")
    revalidatePath(`/events/${eventData.id}`)

    return {
      success: true,
      message: `Event "${eventData.title}" has been updated successfully`,
    }
  } catch (error: any) {
    console.error("Error in updateEvent:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const supabase = createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { error: "Not authenticated" }
    }

    // Verify the user is the creator of the event
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("creator_id, title")
      .eq("id", eventId)
      .single()

    if (fetchError) {
      return { error: "Failed to fetch event" }
    }

    if (!event || event.creator_id !== session.user.id) {
      return { error: "Unauthorized: You can only delete your own events" }
    }

    // First delete all event participants
    const { error: participantsError } = await supabase.from("event_participants").delete().eq("event_id", eventId)

    if (participantsError) {
      console.error("Error deleting event participants:", participantsError)
      return { error: `Error deleting event participants: ${participantsError.message}` }
    }

    // Then delete the event
    const { error: deleteError } = await supabase.from("events").delete().eq("id", eventId)

    if (deleteError) {
      console.error("Error deleting event:", deleteError)
      return { error: `Error deleting event: ${deleteError.message}` }
    }

    // Revalidate the events pages
    revalidatePath("/events")
    revalidatePath("/events/my-events")

    return {
      success: true,
      message: `Event "${event.title}" has been deleted successfully`,
    }
  } catch (error: any) {
    console.error("Error in deleteEvent:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
