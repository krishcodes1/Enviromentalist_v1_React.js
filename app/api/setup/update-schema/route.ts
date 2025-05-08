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

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), "lib", "supabase", "migrations", "add_attendee_count_column.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: "Failed to update schema" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Schema updated successfully" })
  } catch (error) {
    console.error("Error updating schema:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
