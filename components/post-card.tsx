"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type PostCardProps = {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)
  const [downvotes, setDownvotes] = useState(post.downvotes || 0)
  const [voted, setVoted] = useState<"up" | "down" | null>(null)

  const profile = post.profiles || {}
  const community = post.communities || {}
  const commentCount = post.post_comments?.[0]?.count || 0

  const handleUpvote = () => {
    if (voted === "up") {
      setUpvotes(upvotes - 1)
      setVoted(null)
    } else {
      setUpvotes(upvotes + 1)
      if (voted === "down") {
        setDownvotes(downvotes - 1)
      }
      setVoted("up")
    }
  }

  const handleDownvote = () => {
    if (voted === "down") {
      setDownvotes(downvotes - 1)
      setVoted(null)
    } else {
      setDownvotes(downvotes + 1)
      if (voted === "up") {
        setUpvotes(upvotes - 1)
      }
      setVoted("down")
    }
  }

  // Truncate content for preview
  const truncatedContent = post.content?.length > 150 ? post.content.substring(0, 150) + "..." : post.content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="hover-lift"
    >
      <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 mb-2">
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-white/50">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.username} />
              <AvatarFallback className="bg-primary/10 text-primary-900">
                {profile.username?.substring(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <Link href={`/profile/${profile.id}`} className="text-sm font-medium hover:underline truncate">
                  {profile.full_name || profile.username || "Anonymous"}
                </Link>
                {community?.name && (
                  <>
                    <span className="text-gray-500 text-xs">in</span>
                    <Link href={`/community/${community.id}`} className="text-xs text-primary hover:underline truncate">
                      {community.name}
                    </Link>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>

          <Link href={`/post/${post.id}`}>
            <motion.h3
              className="text-base sm:text-lg font-semibold mb-1 hover:text-primary"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              {post.title}
            </motion.h3>
          </Link>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{truncatedContent}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs bg-green-50 px-2 py-0 h-5">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-green-50 px-2 py-0 h-5">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 h-8 px-2 rounded-full ${voted === "up" ? "text-green-600 bg-green-50" : ""}`}
                  onClick={handleUpvote}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs">{upvotes}</span>
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 h-8 px-2 rounded-full ${voted === "down" ? "text-red-600 bg-red-50" : ""}`}
                  onClick={handleDownvote}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="text-xs">{downvotes}</span>
                </Button>
              </motion.div>

              <Link href={`/post/${post.id}`}>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{commentCount}</span>
                  </Button>
                </motion.div>
              </Link>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2 rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="text-xs sr-only sm:not-sr-only">Share</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
