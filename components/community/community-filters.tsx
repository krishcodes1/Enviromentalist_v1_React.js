"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, ArrowUpDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommunityFiltersProps {
  initialCategory?: string
  initialSortBy?: string
  initialSortOrder?: string
}

export default function CommunityFilters({
  initialCategory = "",
  initialSortBy = "member_count",
  initialSortOrder = "desc",
}: CommunityFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const categories = [
    "All Categories",
    "Environment",
    "Climate Action",
    "Sustainability",
    "Conservation",
    "Renewable Energy",
    "Zero Waste",
    "Eco-Friendly Living",
    "Wildlife Protection",
    "Ocean Conservation",
    "Urban Gardening",
  ]

  const sortOptions = [
    { label: "Most Members", value: "member_count", order: "desc" },
    { label: "Newest", value: "created_at", order: "desc" },
    { label: "Oldest", value: "created_at", order: "asc" },
    { label: "Alphabetical (A-Z)", value: "name", order: "asc" },
    { label: "Alphabetical (Z-A)", value: "name", order: "desc" },
  ]

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "All Categories") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to page 1 when filtering
    params.set("page", "1")

    startTransition(() => {
      router.push(`/community?${params.toString()}`)
    })
  }

  const updateSort = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("sortBy", sortBy)
    params.set("sortOrder", sortOrder)

    // Reset to page 1 when sorting
    params.set("page", "1")

    startTransition(() => {
      router.push(`/community?${params.toString()}`)
    })
  }

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === initialSortBy && opt.order === initialSortOrder)
    return option ? option.label : "Sort By"
  }

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            {initialCategory || "All Categories"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => updateFilters("category", category === "All Categories" ? "" : category)}
                className="flex items-center justify-between"
              >
                {category}
                {(category === "All Categories" && !initialCategory) || category === initialCategory ? (
                  <Check className="h-4 w-4" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowUpDown className="h-4 w-4" />
            {getCurrentSortLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort Communities</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={`${option.value}-${option.order}`}
                onClick={() => updateSort(option.value, option.order)}
                className="flex items-center justify-between"
              >
                {option.label}
                {option.value === initialSortBy && option.order === initialSortOrder ? (
                  <Check className="h-4 w-4" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
