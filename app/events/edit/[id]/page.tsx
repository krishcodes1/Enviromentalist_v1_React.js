"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, MapPin, Upload, X, ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { updateEvent } from "@/app/actions/event-actions"
import { LoadingSpinner } from "@/components/animations/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [category, setCategory] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [originalEvent, setOriginalEvent] = useState<any>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        setError(null)

        const { data: session } = await supabase.auth.getSession()
        if (!session.session) {
          router.push("/auth/login")
          return
        }

        const { data: event, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", params.id)
          .single()

        if (eventError) {
          throw eventError
        }

        if (!event) {
          throw new Error("Event not found")
        }

        // Check if the user is the creator of the event
        if (event.creator_id !== session.session.user.id) {
          setUnauthorized(true)
          return
        }

        // Store original event for comparison
        setOriginalEvent(event)

        // Set form values
        setTitle(event.title || "")
        setDescription(event.description || "")
        setLocation(event.location || "")
        setIsVirtual(event.is_virtual || false)
        setCategory(event.category || "")

        if (event.start_time) {
          const startDate = new Date(event.start_time)
          setDate(startDate)
          setStartTime(
            `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`,
          )
        }

        if (event.end_time) {
          const endDate = new Date(event.end_time)
          setEndTime(
            `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`,
          )
        }

        setMaxAttendees(event.max_attendees ? event.max_attendees.toString() : "")
        setTags(event.tags || [])
        setImageUrl(event.image_url || "")
      } catch (err: any) {
        console.error("Error fetching event:", err)
        setError(err.message || "Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router, supabase])

  // Check for changes
  useEffect(() => {
    if (!originalEvent) return

    const startDateTime = date ? new Date(date) : new Date()
    if (startTime) {
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      startDateTime.setHours(startHours, startMinutes)
    }

    const endDateTime = date ? new Date(date) : new Date()
    if (endTime) {
      const [endHours, endMinutes] = endTime.split(":").map(Number)
      endDateTime.setHours(endHours, endMinutes)
    }

    const hasChanged =
      title !== originalEvent.title ||
      description !== originalEvent.description ||
      location !== (originalEvent.location || "") ||
      isVirtual !== originalEvent.is_virtual ||
      category !== originalEvent.category ||
      (date &&
        startTime &&
        format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss") !==
          format(new Date(originalEvent.start_time), "yyyy-MM-dd'T'HH:mm:ss")) ||
      (date &&
        endTime &&
        format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss") !==
          format(new Date(originalEvent.end_time), "yyyy-MM-dd'T'HH:mm:ss")) ||
      (maxAttendees ? Number.parseInt(maxAttendees) : null) !== originalEvent.max_attendees ||
      JSON.stringify(tags) !== JSON.stringify(originalEvent.tags || []) ||
      imageUrl !== (originalEvent.image_url || "")

    setHasChanges(hasChanged)
  }, [
    originalEvent,
    title,
    description,
    location,
    isVirtual,
    category,
    date,
    startTime,
    endTime,
    maxAttendees,
    tags,
    imageUrl,
  ])

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    try {
      setUploading(true)
      setUploadError(null)
      const file = e.target.files[0]

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file")
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      // Create a FormData object to send the file to our server-side API
      const formData = new FormData()
      formData.append("file", file)

      // Use our server-side API route to handle the upload
      const response = await fetch("/api/events/upload-image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image")
      }

      // Update the image URL with the one returned from the server
      setImageUrl(result.url)
      toast({
        title: "Image uploaded",
        description: "Your event image has been uploaded successfully.",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      setUploadError(error.message || "Error uploading image")
      toast({
        title: "Upload failed",
        description: error.message || "Error uploading image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/events/my-events")
      }
    } else {
      router.push("/events/my-events")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!date) throw new Error("Date is required")
      if (!startTime) throw new Error("Start time is required")
      if (!endTime) throw new Error("End time is required")

      // Format date and times
      const startDateTime = new Date(date)
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      startDateTime.setHours(startHours, startMinutes)

      const endDateTime = new Date(date)
      const [endHours, endMinutes] = endTime.split(":").map(Number)
      endDateTime.setHours(endHours, endMinutes)

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time")
      }

      const eventData = {
        id: params.id,
        title,
        description,
        location: isVirtual ? null : location,
        is_virtual: isVirtual,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_attendees: maxAttendees ? Number.parseInt(maxAttendees) : null,
        category,
        tags,
        image_url: imageUrl || null,
      }

      const result = await updateEvent(eventData)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      })

      // Set original event to updated values to reset hasChanges
      setOriginalEvent(eventData)
      setHasChanges(false)

      // Navigate back to my events page after a short delay
      setTimeout(() => {
        router.push("/events/my-events")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating event:", error)
      setError(error.message || "Failed to update event. Please try again.")
      toast({
        title: "Update failed",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (unauthorized) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>You do not have permission to edit this event.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/events/my-events">Back to My Events</Link>
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/events/my-events">Back to My Events</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="mr-2" asChild>
            <Link href="/events/my-events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Event</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges}
            className={cn(!hasChanges && "opacity-50 cursor-not-allowed")}
          >
            {submitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Basic Details</TabsTrigger>
              <TabsTrigger value="datetime">Date & Time</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="virtual" checked={isVirtual} onCheckedChange={setIsVirtual} />
                    <Label htmlFor="virtual">Virtual Event</Label>
                  </div>
                </div>
                {!isVirtual && (
                  <div className="flex items-center border rounded-md pl-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location"
                      className="border-0 focus-visible:ring-0"
                      required={!isVirtual}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cleanup">Cleanup</SelectItem>
                    <SelectItem value="Planting">Planting</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Fundraiser">Fundraiser</SelectItem>
                    <SelectItem value="Protest">Protest</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="datetime" className="space-y-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="flex items-center border rounded-md pl-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex items-center border rounded-md pl-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximum Attendees (Optional)</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  min="1"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  placeholder="Leave blank for unlimited"
                />
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" className="ml-2" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                      <img src={imageUrl || "/placeholder.svg"} alt="Event" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                      <Upload className="h-6 w-6 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                {uploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges}
            className={cn(!hasChanges && "opacity-50 cursor-not-allowed")}
          >
            {submitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Preview section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Event Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-lg overflow-hidden shadow">
            {imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{title || "Event Title"}</h2>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                {date && (
                  <span className="flex items-center mr-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </span>
                )}
                {startTime && endTime && (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {startTime} - {endTime}
                  </span>
                )}
              </div>

              {category && (
                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold">
                    {category}
                  </span>
                </div>
              )}

              <p className="text-gray-700 mb-4">{description || "Event description will appear here."}</p>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">Location:</h3>
                <p className="text-gray-700">
                  {isVirtual ? "Virtual Event" : location || "Location will appear here."}
                </p>
              </div>

              {tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Tags:</h3>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
