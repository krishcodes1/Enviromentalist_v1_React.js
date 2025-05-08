import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CommunityListProps {
  userId: string
  type: "joined" | "discover"
  search?: string
  category?: string
  sortBy?: string
  sortOrder?: string
  page?: number
  pageSize?: number
  limit?: number
  showViewAll?: boolean
  joinedCommunityIds?: string[]
}

export default async function CommunityList({
  userId,
  type,
  search = "",
  category = "",
  sortBy = "member_count",
  sortOrder = "desc",
  page = 1,
  pageSize = 9,
  limit,
  showViewAll = false,
  joinedCommunityIds = [],
}: CommunityListProps) {
  const supabase = createClient()

  let query = supabase.from("communities").select("*, posts(count)")

  if (type === "joined") {
    // For joined communities, get communities the user is a member of
    const { data: memberCommunities } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", userId)

    const communityIds = memberCommunities?.map((mc) => mc.community_id) || []

    if (communityIds.length === 0) {
      return (
        <div className="col-span-full text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">You haven't joined any communities yet</h3>
          <p className="text-gray-500 mt-1">Join a community or create your own</p>
          <Button className="mt-4" asChild>
            <Link href="/community/create-community">Create Community</Link>
          </Button>
        </div>
      )
    }

    query = query.in("id", communityIds)
  } else if (type === "discover" && joinedCommunityIds.length > 0) {
    // For discover, exclude communities the user has already joined
    // Use a different approach to filter out joined communities
    if (joinedCommunityIds.length === 1) {
      // If there's only one ID, use neq
      query = query.neq("id", joinedCommunityIds[0])
    } else if (joinedCommunityIds.length > 0) {
      // If there are multiple IDs, use not.eq for each ID with or
      const notInFilter = joinedCommunityIds.map((id) => `id.neq.${id}`).join(",")
      query = query.or(notInFilter)
    }
  }

  // Apply search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply category filter
  if (category) {
    query = query.eq("category", category)
  }

  // Apply sorting
  if (sortBy && sortOrder) {
    query = query.order(sortBy, { ascending: sortOrder === "asc" })
  }

  // Apply pagination or limit
  if (limit) {
    query = query.limit(limit)
  } else {
    const offset = (page - 1) * pageSize
    query = query.range(offset, offset + pageSize - 1)
  }

  const { data: communities, error, count } = await query

  if (error) {
    console.error("Error fetching communities:", error)
    return (
      <div className="text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl">
        <h3 className="text-lg font-medium text-red-700">Error loading communities</h3>
        <p className="text-gray-500 mt-1">{error.message}</p>
      </div>
    )
  }

  if (!communities || communities.length === 0) {
    return (
      <div className="col-span-full text-center py-8 bg-white/90 backdrop-blur-sm rounded-xl">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">No communities found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your filters or create a new community</p>
        <Button className="mt-4" asChild>
          <Link href="/community/create-community">Create Community</Link>
        </Button>
      </div>
    )
  }

  // Get post counts for each community
  const communityIds = communities.map((c) => c.id)

  // Fix: Use individual count queries for each community
  const postCountMap = new Map()

  // Get post counts with separate queries
  await Promise.all(
    communityIds.map(async (communityId) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("community_id", communityId)

      postCountMap.set(communityId, count || 0)
    }),
  )

  // Get latest activity for each community
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("community_id, created_at")
    .in("community_id", communityIds)
    .order("created_at", { ascending: false })
    .limit(communityIds.length)

  const latestActivityMap = new Map()
  latestPosts?.forEach((post) => {
    if (!latestActivityMap.has(post.community_id)) {
      latestActivityMap.set(post.community_id, new Date(post.created_at))
    }
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => {
          const postCount = postCountMap.get(community.id) || 0
          const latestActivity = latestActivityMap.get(community.id)

          return (
            <Link key={community.id} href={`/community/${community.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer bg-white/95 backdrop-blur-sm border-l-4 border-l-primary-600">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-md bg-primary-900/10 flex-shrink-0 overflow-hidden">
                      {community.image_url ? (
                        <img
                          src={community.image_url || "/placeholder.svg"}
                          alt={community.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary-900 text-white text-xl font-bold">
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{community.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{community.description}</p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-primary-50">
                          {community.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {community.member_count} {community.member_count === 1 ? "member" : "members"}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {postCount} {postCount === 1 ? "post" : "posts"}
                        </div>
                        {latestActivity && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(latestActivity).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {showViewAll && type === "joined" && communities.length > 0 && (
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link href="/community?tab=joined">View All Your Communities</Link>
          </Button>
        </div>
      )}
    </>
  )
}
