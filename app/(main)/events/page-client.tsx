"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Header } from "@/components/header"
import { EventFilters } from "./event-filters"
import { FilteredEvents } from "./filtered-events"

interface EventsClientPageProps {
  events: any[]
  userId: string
  categories: string[]
}

export function EventsClientPage({ events, userId, categories }: EventsClientPageProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    date: undefined as Date | undefined,
    tags: [] as string[],
  })

  // Memoize the filter change handler to prevent it from changing on every render
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <Header title="Events" showNotifications={false} />
          <Button size="icon" asChild>
            <Link href="/events/create">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <EventFilters onFilterChange={handleFilterChange} categories={categories} />
      <FilteredEvents initialEvents={events} userId={userId} categories={categories} filters={filters} />
    </div>
  )
}
