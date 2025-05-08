import { Suspense } from "react"
import PostCard from "@/components/post-card"
import CommunityList from "@/components/community-list"
import { FeaturedEvents } from "@/components/home/featured-events"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Filter } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url), communities(*), post_comments(count)")
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch events for FeaturedEvents component
  const { data: events } = await supabase.from("events").select("*").order("start_time", { ascending: true }).limit(5)

  // Fetch communities for CommunityList component
  const { data: communities } = await supabase.from("communities").select("*").limit(5)

  return (
    <div className="container max-w-5xl px-4 py-4 sm:py-8">
      {/* Mobile-optimized header with action buttons */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Home Feed</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="sm:hidden">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" asChild>
            <Link href="/community/create">
              <PlusCircle className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Featured Events - only visible on mobile as horizontal scroll */}
      <div className="mb-6 sm:hidden">
        <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
          <FeaturedEvents events={events || []} compact={true} />
        </Suspense>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3">
        {/* Posts column - takes full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2 space-y-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="w-full h-40 animate-pulse bg-gray-100"></Card>
                ))}
              </div>
            }
          >
            {posts?.length ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No posts yet</p>
                  <Button asChild>
                    <Link href="/community/create">Create the first post</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </Suspense>
        </div>

        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary/10">
                <h2 className="font-semibold text-primary">Featured Events</h2>
              </div>
              <div className="p-4">
                <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
                  <FeaturedEvents events={events || []} compact={false} />
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary/10">
                <h2 className="font-semibold text-primary">Communities</h2>
              </div>
              <div className="p-4">
                <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
                  <CommunityList communities={communities || []} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile-only bottom section for communities */}
      <div className="mt-6 lg:hidden">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-primary/10 flex justify-between items-center">
              <h2 className="font-semibold text-primary">Communities</h2>
              <Link href="/community" className="text-sm text-primary">
                View all
              </Link>
            </div>
            <div className="p-4">
              <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <CommunityList communities={communities || []} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
