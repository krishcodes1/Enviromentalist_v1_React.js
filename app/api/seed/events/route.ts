import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "lib", "supabase", "seed-events.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error seeding events:", error)
      return NextResponse.json({ error: "Failed to seed events" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Events seeded successfully" })
  } catch (error) {
    console.error("Error in seed events route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
