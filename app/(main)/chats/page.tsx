import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function ChatsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch user's chats
  const { data: chatParticipants } = await supabase
    .from("chat_participants")
    .select("*, chats(*)")
    .eq("user_id", session.user.id)

  // Get the last message for each chat
  const chatsWithLastMessage = await Promise.all(
    (chatParticipants || []).map(async (participant) => {
      const { data: messages } = await supabase
        .from("messages")
        .select("*, profiles(username, avatar_url)")
        .eq("chat_id", participant.chat_id)
        .order("created_at", { ascending: false })
        .limit(1)

      return {
        ...participant.chats,
        lastMessage: messages && messages.length > 0 ? messages[0] : null,
      }
    }),
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chats</h1>
        <Button size="icon" asChild>
          <Link href="/chats/new">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search chats..." className="pl-10" />
        </div>
      </div>

      {/* Chats List */}
      <div className="space-y-4">
        {chatsWithLastMessage && chatsWithLastMessage.length > 0 ? (
          chatsWithLastMessage.map((chat) => (
            <Link key={chat.id} href={`/chats/${chat.id}`}>
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.name || "Direct Message"}</h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(chat.lastMessage.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage
                          ? `${chat.lastMessage.profiles?.username || "User"}: ${chat.lastMessage.content}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No chats yet</h3>
            <p className="text-gray-500 mt-1">Start a conversation with someone</p>
            <Button className="mt-6" asChild>
              <Link href="/chats/new">Start Chat</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
