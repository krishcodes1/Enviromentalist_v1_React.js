"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface EventFiltersProps {
  onFilterChange: (filters: {
    search: string
    category: string
    date: Date | undefined
    tags: string[]
  }) => void
  categories: string[]
}

export function EventFilters({ onFilterChange, categories }: EventFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  const [filtersChanged, setFiltersChanged] = useState(false)

  // Apply filters when they change
  useEffect(() => {
    if (filtersChanged) {
      onFilterChange({
        search,
        category,
        date,
        tags,
      })
      setFiltersChanged(false)
    }
  }, [search, category, date, tags, filtersChanged, onFilterChange])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setFiltersChanged(true)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setFiltersChanged(true)
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    setFiltersChanged(true)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setDate(undefined)
    setTags([])
    setFiltersChanged(true)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search events..." className="pl-8" value={search} onChange={handleSearchChange} />
          </div>

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat || "_none"}>
                  {cat || "Uncategorized"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full md:w-[180px] justify-start text-left font-normal ${
                  !date && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" className="w-full md:w-auto" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
