import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function PostsAdmin() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch posts with comment counts
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, 
      title, 
      content,
      created_at, 
      user_id,
      profiles(username, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get comment counts for each post
  const postIds = posts?.map((post) => post.id) || []
  const { data: commentCounts } = await supabase
    .from("comments")
    .select("post_id, count")
    .in("post_id", postIds)
    .group("post_id")

  // Create a map of post_id to comment count
  const commentCountMap = new Map()
  commentCounts?.forEach((item) => {
    commentCountMap.set(item.post_id, item.count)
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts Management</h1>
        <Link href="/admin" className="text-green-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Comments</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.content?.substring(0, 60)}...</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                          {post.profiles?.avatar_url ? (
                            <img
                              src={post.profiles.avatar_url || "/placeholder.svg"}
                              alt={post.profiles.username || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-green-500 text-sm">👤</span>
                          )}
                        </div>
                        <span>{post.profiles?.username || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{commentCountMap.get(post.id) || 0}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/posts/${post.id}`} className="text-green-600 hover:underline text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
