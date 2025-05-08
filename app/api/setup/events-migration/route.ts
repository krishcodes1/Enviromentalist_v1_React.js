import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication and admin status
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify admin role
    const { data: userProfile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!userProfile || userProfile.role !== "admin") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    // Read the migration SQL file
    const migrationSql = fs.readFileSync(
      path.join(process.cwd(), "lib/supabase/migrations/add_attendee_count.sql"),
      "utf8",
    )

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql: migrationSql })

    if (error) {
      console.error("Migration failed:", error)
      return NextResponse.json({ error: "Migration failed", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Migration completed successfully" })
  } catch (error) {
    console.error("Error running migration:", error)
    return NextResponse.json(
      { error: "Failed to run migration", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
