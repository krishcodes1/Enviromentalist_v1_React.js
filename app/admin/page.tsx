import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch summary data from various tables
  const { data: postsCount } = await supabase.from("posts").select("id", { count: "exact", head: true })

  const { data: commentsCount } = await supabase.from("comments").select("id", { count: "exact", head: true })

  const { data: usersCount } = await supabase.from("profiles").select("id", { count: "exact", head: true })

  const { data: communitiesCount } = await supabase.from("communities").select("id", { count: "exact", head: true })

  const { data: recentPosts } = await supabase
    .from("posts")
    .select("id, title, created_at, user_id, profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentComments } = await supabase
    .from("comments")
    .select("id, content, created_at, user_id, post_id, profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Environmentalist Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Posts" value={postsCount?.count || 0} icon="📝" />
        <StatCard title="Total Comments" value={commentsCount?.count || 0} icon="💬" />
        <StatCard title="Total Users" value={usersCount?.count || 0} icon="👥" />
        <StatCard title="Communities" value={communitiesCount?.count || 0} icon="🌍" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>The latest posts from your community</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentPosts?.map((post) => (
                <li key={post.id} className="border-b pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {post.profiles?.avatar_url ? (
                        <img
                          src={post.profiles.avatar_url || "/placeholder.svg"}
                          alt={post.profiles.username || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-green-500 text-lg">👤</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        By {post.profiles?.username || "Anonymous"} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/admin/posts" className="text-green-600 hover:underline text-sm font-medium">
                View all posts →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
            <CardDescription>The latest engagement from your community</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentComments?.map((comment) => (
                <li key={comment.id} className="border-b pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                      {comment.profiles?.avatar_url ? (
                        <img
                          src={comment.profiles.avatar_url || "/placeholder.svg"}
                          alt={comment.profiles.username || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-green-500 text-lg">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm">
                        {comment.content.length > 100 ? `${comment.content.substring(0, 100)}...` : comment.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        By {comment.profiles?.username || "Anonymous"} •{" "}
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/admin/comments" className="text-green-600 hover:underline text-sm font-medium">
                View all comments →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
