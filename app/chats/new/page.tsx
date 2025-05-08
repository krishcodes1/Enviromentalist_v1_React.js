import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewChatForm } from "./new-chat-form"

export default async function NewChatPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get all users except current user
  const { data: users } = await supabase.from("profiles").select("id, username, avatar_url").neq("id", session.user.id)

  return <NewChatForm users={users || []} currentUserId={session.user.id} />
}
