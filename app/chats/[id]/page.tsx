import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatInterface } from "./chat-interface"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Check if user is a participant in this chat
  const { data: participant } = await supabase
    .from("chat_participants")
    .select("*")
    .eq("chat_id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!participant) {
    redirect("/chats")
  }

  // Get chat details
  const { data: chat } = await supabase.from("chats").select("*").eq("id", params.id).single()

  // Get chat participants
  const { data: participants } = await supabase
    .from("chat_participants")
    .select("*, profiles(id, username, avatar_url)")
    .eq("chat_id", params.id)

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*, profiles(id, username, avatar_url)")
    .eq("chat_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <ChatInterface
      chat={chat}
      participants={participants || []}
      initialMessages={messages || []}
      currentUserId={session.user.id}
    />
  )
}
