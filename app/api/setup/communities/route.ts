import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Check if the user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Execute the SQL to create the communities table
    const sql = `
      -- Check if communities table exists, if not create it
      CREATE TABLE IF NOT EXISTS communities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        creator_id UUID NOT NULL REFERENCES auth.users(id),
        image_url TEXT,
        is_private BOOLEAN DEFAULT FALSE,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        member_count INTEGER DEFAULT 1
      );

      -- Check if community_members table exists, if not create it
      CREATE TABLE IF NOT EXISTS community_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id),
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(community_id, user_id)
      );
    `

    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error creating tables:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Communities tables created successfully" })
  } catch (error: any) {
    console.error("Error in setup route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
