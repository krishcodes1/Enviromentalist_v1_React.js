import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { Suspense } from "react"
import CommunityList from "@/components/community/community-list"
import CommunityFilters from "@/components/community/community-filters"
import CommunitySearch from "@/components/community/community-search"
import CommunityPagination from "@/components/community/community-pagination"

export const dynamic = "force-dynamic"

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Get pagination parameters
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const pageSize = 9
  const offset = (page - 1) * pageSize

  // Get search and filter parameters
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : "member_count"
  const sortOrder = typeof searchParams.sortOrder === "string" ? searchParams.sortOrder : "desc"

  // Fetch user's joined communities
  const { data: userCommunities } = await supabase
    .from("community_members")
    .select(`
      community_id,
      communities(*)
    `)
    .eq("user_id", session.user.id)

  const joinedCommunityIds = new Set(userCommunities?.map((uc) => uc.community_id) || [])

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>
        <Button asChild>
          <Link href="/community/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </div>

      {/* User's Communities */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Your Communities
        </h2>
        <Suspense fallback={<div className="text-center py-8">Loading your communities...</div>}>
          <CommunityList userId={session.user.id} type="joined" limit={3} showViewAll={true} />
        </Suspense>
      </section>

      {/* Search and Filters */}
      <div className="mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <CommunitySearch initialSearch={search} />
          </div>
          <div className="flex gap-2">
            <CommunityFilters initialCategory={category} initialSortBy={sortBy} initialSortOrder={sortOrder} />
          </div>
        </div>
      </div>

      {/* All Communities */}
      <section>
        <h2 className="text-lg font-medium mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Discover Communities
        </h2>
        <Suspense fallback={<div className="text-center py-8">Loading communities...</div>}>
          <CommunityList
            userId={session.user.id}
            type="discover"
            search={search}
            category={category}
            sortBy={sortBy}
            sortOrder={sortOrder}
            page={page}
            pageSize={pageSize}
            joinedCommunityIds={Array.from(joinedCommunityIds)}
          />
        </Suspense>

        <div className="mt-6">
          <CommunityPagination />
        </div>
      </section>
    </div>
  )
}
