import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single instance of the admin client
let adminClient: ReturnType<typeof createClient<Database>> | null = null

export function getAdminSupabaseClient() {
  if (!adminClient) {
    adminClient = createClient<Database>(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "", {
      auth: {
        persistSession: false,
      },
    })
  }

  return adminClient
}
