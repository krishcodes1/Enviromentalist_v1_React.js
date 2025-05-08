import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Award, Calendar } from "lucide-react"

export default function ImpactHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Impact History</h1>
      </div>

      {/* Total Impact */}
      <Card className="mb-6 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Total Impact</h2>
              <p className="text-gray-500">Your environmental contribution</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary-900">450</span>
              <p className="text-gray-500">Impact Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact History by Month */}
      <div className="space-y-6">
        {["May 2023", "April 2023"].map((month) => (
          <section key={month}>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {month}
            </h2>
            <Card className="rounded-xl">
              <CardContent className="p-0">
                <ul className="divide-y">
                  {[
                    {
                      activity: "Beach Cleanup",
                      date: "May 15, 2023",
                      points: 30,
                      description: "Cleaned up 5kg of trash from the beach",
                    },
                    {
                      activity: "Tree Planting",
                      date: "May 10, 2023",
                      points: 50,
                      description: "Planted 3 trees in the community garden",
                    },
                    {
                      activity: "Recycling Drive",
                      date: "May 5, 2023",
                      points: 25,
                      description: "Collected and sorted recyclables",
                    },
                  ].map((impact, index) => (
                    <li key={index} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{impact.activity}</h3>
                          <p className="text-sm text-gray-500">{impact.date}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-primary-900 mr-2">+{impact.points}</span>
                          <Award className="h-5 w-5 text-primary-900" />
                        </div>
                      </div>
                      {impact.description && <p className="text-sm text-gray-600 mt-2">{impact.description}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  )
}
