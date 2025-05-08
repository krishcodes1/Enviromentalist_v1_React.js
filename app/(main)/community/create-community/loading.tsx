import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateCommunityLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Link href="/community" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create Community</h1>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Community Details</CardTitle>
          <CardDescription>
            Create a space for people with similar interests to connect and collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>

            <CardFooter className="px-0 pt-4">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
