import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Read SQL file
    const sqlPath = path.join(process.cwd(), "lib", "supabase", "setup_event_participants_rls.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Execute SQL commands
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error setting up RLS:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also ensure the join_event_simple function exists
    const joinEventPath = path.join(process.cwd(), "lib", "supabase", "functions", "join_event_simple.sql")
    const joinEventSql = fs.readFileSync(joinEventPath, "utf8")

    const { error: joinError } = await supabase.rpc("exec_sql", { sql: joinEventSql })

    if (joinError) {
      console.error("Error creating join_event_simple function:", joinError)
      return NextResponse.json({ error: joinError.message }, { status: 500 })
    }

    // Also ensure the exec_sql function exists first
    const execSqlPath = path.join(process.cwd(), "lib", "supabase", "functions", "exec_sql.sql")
    const execSqlSql = fs.readFileSync(execSqlPath, "utf8")

    // This needs to be run directly as we can't use the function to create itself
    const { error: execError } = await supabase.rpc("exec_sql", { sql: execSqlSql })

    if (execError) {
      console.error("Error creating exec_sql function:", execError)
      // Continue anyway as it might already exist
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in setup:", error)
    return NextResponse.json({ error: "Failed to set up RLS" }, { status: 500 })
  }
}
