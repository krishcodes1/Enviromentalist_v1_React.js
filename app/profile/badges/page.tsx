import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Award } from "lucide-react"

export default async function BadgesPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch all badges
  const { data: allBadges } = await supabase.from("badges").select("*")

  // Fetch user badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", session.user.id)

  // Create a map of earned badges
  const earnedBadgesMap = new Map()
  userBadges?.forEach((userBadge) => {
    earnedBadgesMap.set(userBadge.badge_id, userBadge.earned_at)
  })

  // Group badges by category
  const badgesByCategory: Record<string, any[]> = {}

  allBadges?.forEach((badge) => {
    if (!badgesByCategory[badge.category]) {
      badgesByCategory[badge.category] = []
    }

    badgesByCategory[badge.category].push({
      ...badge,
      earned: earnedBadgesMap.has(badge.id),
      earned_at: earnedBadgesMap.get(badge.id),
    })
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Badges</h1>
      </div>

      {/* Badges by Category */}
      <div className="space-y-6">
        {Object.keys(badgesByCategory).length > 0 ? (
          Object.entries(badgesByCategory).map(([category, badges]) => (
            <section key={category}>
              <h2 className="text-lg font-medium mb-4 capitalize">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id} className={badge.earned ? "border-primary" : "opacity-70"}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 ${
                            badge.earned ? "bg-primary/10" : "bg-gray-100"
                          }`}
                        >
                          {badge.image_url ? (
                            <img src={badge.image_url || "/placeholder.svg"} alt={badge.name} className="h-10 w-10" />
                          ) : (
                            <Award className={`h-8 w-8 ${badge.earned ? "text-primary" : "text-gray-400"}`} />
                          )}
                        </div>
                        <h3 className="font-medium">{badge.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                        {badge.earned ? (
                          <span className="text-xs text-primary mt-2">
                            Earned on {new Date(badge.earned_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 mt-2">{badge.points_required} points required</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No badges available</h3>
            <p className="text-gray-500 mt-1">Check back later for badges to earn</p>
          </div>
        )}
      </div>
    </div>
  )
}
