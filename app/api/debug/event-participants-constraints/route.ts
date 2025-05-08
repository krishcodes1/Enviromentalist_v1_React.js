import { NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient()

    // First try to create the function if it doesn't exist
    await supabase.rpc("check_event_participants_constraints")

    // Now call the function to get the constraints
    const { data, error } = await supabase.rpc("check_event_participants_constraints")

    if (error) {
      console.error("Error checking constraints:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to check constraints" }, { status: 500 })
  }
}
