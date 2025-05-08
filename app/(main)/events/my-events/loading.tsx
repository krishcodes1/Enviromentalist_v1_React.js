import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <Header title="My Events" />
        <div className="mt-4">
          <Button disabled className="w-full">
            Create New Event
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <Skeleton className="h-16 w-16 rounded-md mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
