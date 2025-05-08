import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Simple input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
  return usernameRegex.test(username)
}

function validatePassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

// Simple sanitization
function sanitizeInput(input: string): string {
  return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Simple rate limiting with in-memory storage
const ipRequests: Record<string, { count: number; resetTime: number }> = {}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const resetInterval = 60 * 1000 // 1 minute

  // Clean up expired entries
  if (ipRequests[ip] && ipRequests[ip].resetTime < now) {
    delete ipRequests[ip]
  }

  // Initialize if not exists
  if (!ipRequests[ip]) {
    ipRequests[ip] = { count: 0, resetTime: now + resetInterval }
  }

  // Check limit
  if (ipRequests[ip].count >= 10) {
    return false
  }

  // Increment counter
  ipRequests[ip].count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Get form data
    const formData = await request.formData()
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username || "")
    const sanitizedEmail = sanitizeInput(email || "")

    // Validate inputs
    if (!validateUsername(sanitizedUsername)) {
      return NextResponse.json(
        {
          error: "Username must be 3-30 characters and can only contain letters, numbers, underscores, and hyphens",
        },
        { status: 400 },
      )
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      )
    }

    // Create Supabase client with auth context
    const supabase = createRouteHandlerClient({ cookies })

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", sanitizedUsername)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Create user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
        data: {
          username: sanitizedUsername,
        },
      },
    })

    if (signUpError) {
      console.error("Signup error:", signUpError)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create a server-side admin client to bypass RLS
    // This is secure because it only runs on the server
    const adminClient = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Create profile using admin client to bypass RLS
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: authData.user.id,
      username: sanitizedUsername,
      full_name: "",
      avatar_url: "",
      onboarding_completed: false,
      interests: [],
      joined_at: new Date().toISOString(),
      reputation_points: 0,
      role: "user",
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)

      // Clean up the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
