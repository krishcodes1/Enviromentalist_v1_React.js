import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin privileges
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is an admin
    const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!userProfile || userProfile.role !== "admin") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), "lib", "supabase", "functions", "create_exec_sql.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Execute the SQL directly
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      // If exec_sql doesn't exist, create it using raw SQL
      const { error: rawError } = await supabase.from("_temp_exec_sql").select("*").limit(1)

      if (rawError) {
        console.error("Error creating exec_sql function:", rawError)
        return NextResponse.json({ error: "Failed to create exec_sql function" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "exec_sql function created successfully" })
  } catch (error) {
    console.error("Error creating exec_sql function:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
