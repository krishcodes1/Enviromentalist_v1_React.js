import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-md mr-2" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
