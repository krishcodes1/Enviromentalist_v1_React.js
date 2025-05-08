"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteEvent } from "@/app/actions/event-actions"
import { LoadingSpinner } from "@/components/animations/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function DeleteEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [unauthorized, setUnauthorized] = useState(false)

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

        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(`
            *,
            participants:event_participants(count)
          `)
          .eq("id", params.id)
          .single()

        if (eventError) {
          throw eventError
        }

        if (!eventData) {
          throw new Error("Event not found")
        }

        // Check if the user is the creator of the event
        if (eventData.creator_id !== session.session.user.id) {
          setUnauthorized(true)
          return
        }

        setEvent(eventData)
      } catch (err: any) {
        console.error("Error fetching event:", err)
        setError(err.message || "Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router, supabase])

  const handleDelete = async () => {
    try {
      setSubmitting(true)
      setError(null)

      const result = await deleteEvent(params.id)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Event deleted",
        description: result.message || "Your event has been deleted successfully.",
      })

      // Navigate back to my events page after a short delay
      setTimeout(() => {
        router.push("/events/my-events")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Error deleting event:", error)
      setError(error.message || "Failed to delete event. Please try again.")
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete event. Please try again.",
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
          <AlertDescription>You do not have permission to delete this event.</AlertDescription>
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

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Event not found</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/events/my-events">Back to My Events</Link>
        </Button>
      </div>
    )
  }

  const startDate = new Date(event.start_time)
  const participantCount = event.participants?.[0]?.count || 0

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-2" asChild>
          <Link href="/events/my-events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Delete Event</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Confirm Deletion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action cannot be undone. This will permanently delete the event and remove all participants.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-gray-500">{format(startDate, "EEEE, MMMM d, yyyy • h:mm a")}</p>
            </div>

            <div>
              <p className="font-medium">Event Details:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                <li>Location: {event.is_virtual ? "Virtual Event" : event.location || "No location specified"}</li>
                <li>Category: {event.category}</li>
                <li>
                  Participants: {participantCount} {participantCount === 1 ? "person" : "people"}
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <p className="text-amber-800">
                Are you sure you want to delete this event? All participants will be notified and the event will be
                permanently removed.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" asChild>
            <Link href="/events/my-events">Cancel</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            {submitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
