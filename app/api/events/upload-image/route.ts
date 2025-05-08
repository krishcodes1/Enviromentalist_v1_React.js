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

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase()
    // Validate file type
    if (!["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt || "")) {
      return NextResponse.json({ error: "Please upload an image file (jpg, jpeg, png, gif, or webp)" }, { status: 400 })
    }

    const fileName = `event-${Date.now()}.${fileExt}`

    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Upload file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from("public")
      .upload(`event-images/${fileName}`, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("public").getPublicUrl(`event-images/${fileName}`)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
