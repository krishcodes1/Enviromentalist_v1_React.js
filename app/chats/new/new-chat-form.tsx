"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

interface User {
  id: string
  username: string
  avatar_url: string | null
}

interface NewChatFormProps {
  users: User[]
  currentUserId: string
}

export function NewChatForm({ users, currentUserId }: NewChatFormProps) {
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return

    setLoading(true)
    try {
      // Create chat
      const { data: chat, error: chatError } = await supabase
        .from("chats")
        .insert({
          name: isGroupChat ? groupName : null,
          is_group: isGroupChat,
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add current user as participant
      await supabase.from("chat_participants").insert({
        chat_id: chat.id,
        user_id: currentUserId,
      })

      // Add selected users as participants
      const participantPromises = selectedUsers.map((user) =>
        supabase.from("chat_participants").insert({
          chat_id: chat.id,
          user_id: user.id,
        }),
      )

      await Promise.all(participantPromises)

      router.push(`/chats/${chat.id}`)
    } catch (error) {
      console.error("Error creating chat:", error)
      alert("Failed to create chat. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/chats" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">New Chat</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <Label htmlFor="group-chat">Group Chat</Label>
              </div>
              <Switch id="group-chat" checked={isGroupChat} onCheckedChange={setIsGroupChat} />
            </div>

            {isGroupChat && (
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required={isGroupChat}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div>
                <Label className="block mb-2">Selected ({selectedUsers.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
                      <span>{user.username}</span>
                      <button
                        type="button"
                        onClick={() => toggleUserSelection(user)}
                        className="ml-2 text-primary hover:text-primary/80"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                        selectedUsers.some((u) => u.id === user.id) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url || "/placeholder.svg"}
                              alt={user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span>{user.username}</span>
                      </div>
                      {selectedUsers.some((u) => u.id === user.id) && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No users found</div>
                )}
              </div>
            </div>

            <Button
              onClick={handleCreateChat}
              className="w-full"
              disabled={loading || selectedUsers.length === 0 || (isGroupChat && !groupName.trim())}
            >
              {loading ? "Creating..." : "Create Chat"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
