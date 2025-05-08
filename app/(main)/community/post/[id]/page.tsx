import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react"
import { notFound } from "next/navigation"
import { CommentForm } from "./comment-form"

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch post details
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(id, username, avatar_url),
      communities(id, name)
    `)
    .eq("id", params.id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch comments for this post
  const { data: comments } = await supabase
    .from("post_comments")
    .select(`
      *,
      profiles(id, username, avatar_url)
    `)
    .eq("post_id", params.id)
    .order("created_at", { ascending: true })

  // Format date
  const postDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/community" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Post</h1>
      </div>

      {/* Post Content */}
      <Card className="mb-6 rounded-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {post.profiles?.avatar_url ? (
                <img
                  src={post.profiles.avatar_url || "/placeholder.svg"}
                  alt={post.profiles.username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-900 text-white">
                  {post.profiles?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <span>@{post.profiles?.username || "anonymous"}</span>
                <span className="mx-2">•</span>
                <span>{postDate}</span>
                {post.communities && (
                  <>
                    <span className="mx-2">•</span>
                    <Link href={`/community/${post.communities.id}`} className="text-primary-900 hover:underline">
                      {post.communities.name}
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-4 text-gray-700 whitespace-pre-line">{post.content}</div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-primary-900/10 text-primary-900 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {post.upvotes || 0}
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {comments?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Comments ({comments?.length || 0})
        </h2>

        {/* Comment Form */}
        <CommentForm postId={params.id} userId={session.user.id} />

        {/* Comments List */}
        <div className="space-y-4 mt-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id} className="rounded-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      {comment.profiles?.avatar_url ? (
                        <img
                          src={comment.profiles.avatar_url || "/placeholder.svg"}
                          alt={comment.profiles.username || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-900 text-white text-xs">
                          {comment.profiles?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">{comment.profiles?.username || "Anonymous"}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(comment.created_at).toLocaleDateString()} at{" "}
                          {new Date(comment.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No comments yet</h3>
              <p className="text-gray-500 mt-1">Be the first to share your thoughts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
