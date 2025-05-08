import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const fullName = formData.get("fullName") as string
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string
    const avatarUrl = formData.get("avatarUrl") as string

    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Only include avatar_url if it's provided
    const updates: any = {
      id: session.user.id,
      updated_at: new Date().toISOString(),
    }

    if (fullName) updates.full_name = fullName
    if (username) updates.username = username
    if (bio) updates.bio = bio
    if (location) updates.location = location
    if (avatarUrl) updates.avatar_url = avatarUrl

    const { error } = await supabase.from("profiles").update(updates).eq("id", session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
