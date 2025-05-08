import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { communityId } = await request.json()

    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is already a member
    const { data: existingMembership } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", communityId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (existingMembership) {
      return NextResponse.json({ error: "You are already a member of this community" }, { status: 400 })
    }

    // Add the user as a member
    const { error } = await supabase.from("community_members").insert({
      community_id: communityId,
      user_id: session.user.id,
      role: "member",
    })

    if (error) {
      console.error("Error joining community:", error)
      return NextResponse.json({ error: "Failed to join community" }, { status: 500 })
    }

    // Increment the member count
    await supabase.rpc("increment_member_count", { community_id: communityId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error joining community:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
