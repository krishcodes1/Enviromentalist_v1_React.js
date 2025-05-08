import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-md mr-2" />
        <Skeleton className="h-8 w-40" />
      </div>

      <Card>
        <CardHeader className="bg-red-50 border-b border-red-100">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}
