"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CommentFormProps {
  postId: string
  userId: string
}

export function CommentForm({ postId, userId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        user_id: userId,
        content: content.trim(),
      })

      if (error) throw error

      // Clear the form and refresh the page
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("Failed to submit comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none mb-3"
            rows={3}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !content.trim()} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
