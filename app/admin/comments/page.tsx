import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CommentsAdmin() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch comments with related data
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      id, 
      content,
      created_at, 
      upvotes,
      downvotes,
      user_id,
      post_id,
      profiles(username, avatar_url),
      posts(title)
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comments Management</h1>
        <Link href="/admin" className="text-green-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Comment</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Post</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Votes</th>
                </tr>
              </thead>
              <tbody>
                {comments?.map((comment) => (
                  <tr key={comment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 max-w-md">
                      <div className="text-sm">
                        {comment.content?.length > 100 ? `${comment.content.substring(0, 100)}...` : comment.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                          {comment.profiles?.avatar_url ? (
                            <img
                              src={comment.profiles.avatar_url || "/placeholder.svg"}
                              alt={comment.profiles.username || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-green-500 text-sm">👤</span>
                          )}
                        </div>
                        <span>{comment.profiles?.username || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/posts/${comment.post_id}`} className="text-green-600 hover:underline text-sm">
                        {comment.posts?.title || "Unknown Post"}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{new Date(comment.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-green-600">↑ {comment.upvotes || 0}</span>
                        <span className="text-red-600">↓ {comment.downvotes || 0}</span>
                      </div>
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
