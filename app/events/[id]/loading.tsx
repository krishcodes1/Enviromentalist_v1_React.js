import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Image Skeleton */}
      <div className="relative h-80 bg-primary/30 animate-pulse">
        <div className="absolute top-4 left-4 z-10">
          <div className="h-12 w-12 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>

        <div className="flex gap-2 mb-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="flex items-center mb-6">
          <Skeleton className="h-6 w-6 rounded-full mr-2" />
          <Skeleton className="h-6 w-16" />
        </div>

        <Skeleton className="h-24 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-6" />

        <div className="grid grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-16 w-16 rounded-full mr-4" />
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-14 flex-1 mx-4" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}
