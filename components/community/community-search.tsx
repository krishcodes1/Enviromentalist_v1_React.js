"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface CommunitySearchProps {
  initialSearch?: string
}

export default function CommunitySearch({ initialSearch = "" }: CommunitySearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    // Reset to page 1 when searching
    params.set("page", "1")

    startTransition(() => {
      router.push(`/community?${params.toString()}`)
    })
  }

  const clearSearch = () => {
    setSearch("")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.set("page", "1")

    startTransition(() => {
      router.push(`/community?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search communities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pr-16"
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-8 top-0 h-full"
          onClick={clearSearch}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" disabled={isPending}>
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
