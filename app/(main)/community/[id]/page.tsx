import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, MessageSquare, Users, Settings, Plus } from "lucide-react"

export default async function CommunityDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/auth")
  }

  // Fetch the community
  const { data: community, error } = await supabase.from("communities").select("*").eq("id", params.id).single()

  if (!community || error) {
    return notFound()
  }

  // Check if the user is a member of this community
  const { data: membership } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", params.id)
    .eq("user_id", session.user.id)
    .single()

  const isAdmin = membership?.role === "admin"
  const isMember = !!membership

  // Fetch community posts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(username, avatar_url)
    `)
    .eq("community_id", params.id)
    .order("created_at", { ascending: false })

  // Fetch all comments for these posts
  const postIds = posts?.map((post) => post.id) || []
  const { data: comments } = await supabase
    .from("post_comments")
    .select("post_id")
    .in("post_id", postIds.length > 0 ? postIds : ["no-posts"])

  // Count comments per post
  const commentCountMap = new Map()
  if (comments) {
    comments.forEach((comment) => {
      const count = commentCountMap.get(comment.post_id) || 0
      commentCountMap.set(comment.post_id, count + 1)
    })
  }

  // Fetch community members
  const { data: members } = await supabase
    .from("community_members")
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .eq("community_id", params.id)
    .order("joined_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/community" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-md bg-primary-900/10 flex-shrink-0 overflow-hidden">
            {community.image_url ? (
              <img
                src={community.image_url || "/placeholder.svg"}
                alt={community.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary-900 text-white text-2xl font-bold">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/community/${params.id}/edit`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex items-center mt-1 gap-2">
              <span className="text-sm px-2 py-1 bg-primary-900/10 text-primary-900 rounded-full">
                {community.category}
              </span>
              <span className="text-sm text-gray-500">
                {community.member_count} {community.member_count === 1 ? "member" : "members"}
              </span>
              {community.is_private && (
                <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Private</span>
              )}
            </div>
            <p className="mt-3 text-gray-700">{community.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Posts</h2>
            {isMember && (
              <Button asChild>
                <Link href={`/post/create?communityId=${params.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            )}
          </div>

          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <Link href={`/community/post/${post.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
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
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-gray-500">
                            @{post.profiles?.username || "anonymous"} • {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="mt-2 text-sm line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
              <p className="text-gray-500 mt-1">Be the first to share something with the community</p>
              {isMember ? (
                <Button className="mt-4" asChild>
                  <Link href={`/post/create?communityId=${params.id}`}>Create Post</Link>
                </Button>
              ) : (
                <Button className="mt-4">Join Community</Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Members ({members?.length || 0})
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {members && members.length > 0 ? (
                members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      {member.profiles?.avatar_url ? (
                        <img
                          src={member.profiles.avatar_url || "/placeholder.svg"}
                          alt={member.profiles.username || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-900 text-white text-xs">
                          {member.profiles?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">@{member.profiles?.username || "anonymous"}</p>
                      <p className="text-xs text-gray-500">
                        {member.role === "admin" ? "Admin" : "Member"} •{" "}
                        {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No members found</p>
              )}
            </div>
            {!isMember && <Button className="w-full mt-4">Join Community</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
