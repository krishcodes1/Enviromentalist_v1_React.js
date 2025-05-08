"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ChatInterfaceProps {
  chat: any
  participants: any[]
  initialMessages: any[]
  currentUserId: string
}

export function ChatInterface({ chat, participants, initialMessages, currentUserId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Get other participants (for direct messages)
  const otherParticipants = participants.filter((p) => p.user_id !== currentUserId)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        (payload) => {
          // Fetch the user info for the new message
          const fetchUserInfo = async () => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id, username, avatar_url")
              .eq("id", payload.new.user_id)
              .single()

            setMessages((current) => [
              ...current,
              {
                ...payload.new,
                profiles: profile,
              },
            ])
          }

          fetchUserInfo()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, chat.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase.from("messages").insert({
        chat_id: chat.id,
        user_id: currentUserId,
        content: newMessage.trim(),
      })

      if (error) throw error
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center">
        <Link href="/chats" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-bold">
            {chat.is_group
              ? chat.name
              : otherParticipants.length > 0
                ? otherParticipants[0].profiles?.username || "User"
                : "Chat"}
          </h1>
          <p className="text-xs text-gray-500">
            {chat.is_group ? `${participants.length} participants` : "Direct Message"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.user_id === currentUserId
          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {!isCurrentUser && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {message.profiles?.avatar_url ? (
                      <img
                        src={message.profiles.avatar_url || "/placeholder.svg"}
                        alt={message.profiles.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary text-white">
                        {message.profiles?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                )}
                <div className={`p-3 rounded-lg ${isCurrentUser ? "bg-primary text-white" : "bg-gray-100"}`}>
                  {!isCurrentUser && (
                    <p className="text-xs text-gray-500 mb-1">{message.profiles?.username || "User"}</p>
                  )}
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
