import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get("email"))
    const password = String(formData.get("password"))
    const username = String(formData.get("username"))

    // Forward to our new secure registration endpoint
    const response = await fetch(`${requestUrl.origin}/api/auth/register`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Registration failed" }, { status: response.status })
    }

    return NextResponse.redirect(new URL("/onboarding", request.url), {
      status: 301,
    })
  } catch (error) {
    console.error("Auth trigger error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
