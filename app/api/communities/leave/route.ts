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

    // Check if the user is a member
    const { data: membership } = await supabase
      .from("community_members")
      .select("id, role")
      .eq("community_id", communityId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (!membership) {
      return NextResponse.json({ error: "You are not a member of this community" }, { status: 400 })
    }

    // Check if the user is the last admin
    if (membership.role === "admin") {
      const { data: adminCount } = await supabase
        .from("community_members")
        .select("id", { count: "exact" })
        .eq("community_id", communityId)
        .eq("role", "admin")

      if (adminCount && adminCount.length <= 1) {
        return NextResponse.json({ error: "You cannot leave the community as you are the last admin" }, { status: 400 })
      }
    }

    // Remove the user from the community
    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error leaving community:", error)
      return NextResponse.json({ error: "Failed to leave community" }, { status: 500 })
    }

    // Decrement the member count
    await supabase.rpc("decrement_member_count", { community_id: communityId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error leaving community:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
