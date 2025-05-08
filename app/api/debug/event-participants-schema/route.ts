import { NextResponse } from "next/server"
import { getAdminSupabaseClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient()

    // First try to create the function if it doesn't exist
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION get_event_participants_schema()
        RETURNS TABLE (
          column_name text,
          data_type text,
          is_nullable text,
          column_default text
        ) AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM 
            information_schema.columns
          WHERE 
            table_name = 'event_participants'
          ORDER BY 
            ordinal_position;
        END;
        $$ LANGUAGE plpgsql;
      `,
    })

    if (createError) {
      console.error("Error creating schema function:", createError)
    }

    // Now call the function to get the schema
    const { data, error } = await supabase.rpc("get_event_participants_schema")

    if (error) {
      console.error("Error checking schema:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also get a sample of existing records
    const { data: sampleData, error: sampleError } = await supabase.from("event_participants").select("*").limit(5)

    if (sampleError) {
      console.error("Error getting sample data:", sampleError)
    }

    return NextResponse.json({ schema: data, sampleData: sampleData || [] }, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to check schema" }, { status: 500 })
  }
}
