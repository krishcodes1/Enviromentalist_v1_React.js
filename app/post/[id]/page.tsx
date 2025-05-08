import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import PageTransition from "@/components/animations/page-transition"
import { FadeIn, SlideUp, Stagger, StaggerItem } from "@/components/animations/motion-wrapper"

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch post with author information and community details
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url, full_name),
      communities:community_id(id, name, image_url)
    `)
    .eq("id", params.id)
    .single()

  // Fetch comments for this post
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id(id, username, avatar_url, full_name)
    `)
    .eq("post_id", params.id)
    .order("created_at", { ascending: true })

  if (error || !post) {
    notFound()
  }

  const profile = post.profiles || {}
  const community = post.communities || {}

  return (
    <PageTransition>
      <main className="container mx-auto px-4 py-8">
        <FadeIn>
          <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-900 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to feed
          </Link>
        </FadeIn>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
          <div className="p-6">
            {/* Post header */}
            <FadeIn>
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.username} />
                  <AvatarFallback>{profile.username?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Link href={`/profile/${profile.id}`} className="font-medium hover:underline">
                      {profile.full_name || profile.username || "Anonymous"}
                    </Link>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500 text-sm">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>

                    {community?.name && (
                      <>
                        <span className="text-gray-500">•</span>
                        <Link href={`/community/${community.id}`} className="text-green-700 hover:underline text-sm">
                          {community.name}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Post content */}
            <SlideUp delay={0.1}>
              <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            </SlideUp>

            <SlideUp delay={0.2}>
              <div className="prose max-w-none mb-6">
                {post.content.split("\n\n").map((paragraph: string, i: number) => (
                  <p key={i} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </SlideUp>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <FadeIn delay={0.3}>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="bg-green-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Post stats */}
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-b py-3 mb-6">
                <div>{post.upvotes || 0} upvotes</div>
                <div>{post.downvotes || 0} downvotes</div>
                <div>{comments?.length || 0} comments</div>
              </div>
            </FadeIn>

            {/* Comments section */}
            <div>
              <FadeIn delay={0.5}>
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
              </FadeIn>

              {comments && comments.length > 0 ? (
                <Stagger delay={0.6} className="space-y-6">
                  {comments.map((comment) => (
                    <StaggerItem key={comment.id}>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.profiles?.avatar_url || "/placeholder.svg"}
                            alt={comment.profiles?.username}
                          />
                          <AvatarFallback>
                            {comment.profiles?.username?.substring(0, 2).toUpperCase() || "UN"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.profiles?.full_name || comment.profiles?.username || "Anonymous"}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>

                          <div className="flex items-center gap-3 mt-1 ml-1 text-xs text-gray-500">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              Reply
                            </Button>
                            <div>{comment.upvotes || 0} upvotes</div>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <FadeIn delay={0.6}>
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                </FadeIn>
              )}

              {/* Comment form would go here */}
              <FadeIn delay={0.7}>
                <div className="mt-6">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Add a Comment</Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </article>
      </main>
    </PageTransition>
  )
}
