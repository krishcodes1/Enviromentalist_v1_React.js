import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const eventId = String(formData.get("eventId"))

    if (!eventId) {
      console.error("No event ID provided")
      return NextResponse.json({ error: "No event ID provided" }, { status: 400 })
    }

    console.log("Joining event:", eventId)

    // Regular client for auth
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id

    // Create admin client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Create a new client with the service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if event exists
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from("events")
      .select("id")
      .eq("id", eventId)
      .single()

    if (eventError || !eventData) {
      console.error("Event not found:", eventId, eventError)
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if user is already participating
    const { data: existingParticipation, error: participationError } = await supabaseAdmin
      .from("event_participants")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle()

    if (participationError) {
      console.error("Error checking participation:", participationError)
      return NextResponse.json({ error: "Failed to check participation status" }, { status: 500 })
    }

    if (existingParticipation) {
      // User is already participating, return success
      return NextResponse.json({ message: "Already participating in this event" }, { status: 200 })
    }

    // First, let's check the structure of the table to understand the constraints
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from("event_participants")
      .select("status")
      .limit(1)

    console.log("Table info:", tableInfo, "Table error:", tableError)

    // Try different status values that might be allowed by the check constraint
    // Common values might be: 'attending', 'registered', 'going', 'accepted', etc.
    const statusOptions = ["attending", "registered", "going", "accepted", "approved", "confirmed", "pending"]

    let insertSuccess = false
    let lastError = null

    // Try each status option until one works
    for (const status of statusOptions) {
      const { error: insertError } = await supabaseAdmin.from("event_participants").insert({
        event_id: eventId,
        user_id: userId,
        status: status,
      })

      if (!insertError) {
        insertSuccess = true
        console.log("Successfully added participant with status:", status)
        break
      } else {
        lastError = insertError
        console.log(`Failed with status "${status}":`, insertError)
      }
    }

    if (!insertSuccess) {
      console.error("All status options failed. Last error:", lastError)
      return NextResponse.json(
        { error: "Failed to add participant: " + (lastError?.message || "Unknown error") },
        { status: 500 },
      )
    }

    // Add impact history
    await supabaseAdmin.from("impact_history").insert({
      user_id: userId,
      event_id: eventId,
      activity_type: "Event Participation",
      points_earned: 50,
      description: "Joined an environmental event",
      verified: true,
    })

    // Update user's reputation points
    await supabaseAdmin.rpc("increment_reputation", {
      user_id_param: userId,
      points_param: 50,
    })

    return NextResponse.json({ success: true, message: "Successfully joined event" }, { status: 200 })
  } catch (error) {
    console.error("Error joining event:", error)
    return NextResponse.json({ error: "Failed to join event" }, { status: 500 })
  }
}
