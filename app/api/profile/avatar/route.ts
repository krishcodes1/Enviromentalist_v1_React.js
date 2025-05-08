import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase()
    // Validate file type
    if (!["jpg", "jpeg", "png", "gif"].includes(fileExt || "")) {
      return NextResponse.json({ error: "Please upload an image file (jpg, jpeg, png, or gif)" }, { status: 400 })
    }

    const fileName = `${Date.now()}.${fileExt}`

    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Upload file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from("avatars")
      .upload(`${session.user.id}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(`${session.user.id}/${fileName}`)

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: urlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
