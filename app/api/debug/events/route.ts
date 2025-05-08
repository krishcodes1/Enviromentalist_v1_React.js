import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch events
    const { data: events, error } = await supabase.from("events").select("*").order("start_time", { ascending: true })

    if (error) {
      console.error("Error fetching events:", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    // Check if events table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tablesError) {
      console.error("Error fetching tables:", tablesError)
    }

    // Check if events table has the expected columns
    const { data: columns, error: columnsError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_schema", "public")
      .eq("table_name", "events")

    if (columnsError) {
      console.error("Error fetching columns:", columnsError)
    }

    return NextResponse.json({
      events: events || [],
      eventCount: events?.length || 0,
      tables: tables || [],
      columns: columns || [],
    })
  } catch (error) {
    console.error("Error in debug events route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
