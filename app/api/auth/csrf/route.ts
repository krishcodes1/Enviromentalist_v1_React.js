import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

// Generate a CSRF token
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function GET(request: NextRequest) {
  try {
    // Create a new CSRF token
    const csrfToken = generateCsrfToken()

    // Store the token in a secure, HTTP-only cookie
    cookies().set({
      name: "csrf_token",
      value: csrfToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    })

    // Return the token to the client
    return NextResponse.json({ csrfToken })
  } catch (error) {
    console.error("Error generating CSRF token:", error)
    return NextResponse.json({ error: "Failed to generate CSRF token" }, { status: 500 })
  }
}
