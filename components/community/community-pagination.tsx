"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTransition } from "react"

export default function CommunityPagination() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentPage = Number(searchParams.get("page") || "1")

  // This would ideally come from the server, but for simplicity we'll use a fixed value
  // In a real app, you'd pass the total count from the server
  const totalPages = 10

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `/community?${params.toString()}`
  }

  const goToPage = (page: number) => {
    startTransition(() => {
      router.push(createPageURL(page))
    })
  }

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1 || isPending}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        // Show pages around the current page
        let pageNumber: number

        if (totalPages <= 5) {
          // If we have 5 or fewer pages, show all
          pageNumber = i + 1
        } else if (currentPage <= 3) {
          // If we're near the start, show first 5 pages
          pageNumber = i + 1
        } else if (currentPage >= totalPages - 2) {
          // If we're near the end, show last 5 pages
          pageNumber = totalPages - 4 + i
        } else {
          // Otherwise, show 2 pages before and after current page
          pageNumber = currentPage - 2 + i
        }

        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(pageNumber)}
            disabled={isPending}
          >
            {pageNumber}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages || isPending}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
