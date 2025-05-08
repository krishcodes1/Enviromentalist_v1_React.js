import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default async function EventConfirmationPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  // Fetch event details
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (error || !event) {
    console.error("Error fetching event:", error)
    redirect("/events")
  }

  // Format date
  const eventDate = new Date(event.start_time)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Format time
  const formattedTime = new Date(event.start_time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with back button and logo */}
      <div className="relative bg-primary leaf-pattern-bg">
        <div className="absolute top-4 left-4 z-10">
          <Link href={`/events/${params.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Logo size="sm" color="white" />
        </div>

        {/* Success message */}
        <div className="pt-20 pb-16 px-6 text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Yay! +10 points</h1>
        </div>
      </div>

      {/* Success icon and message */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white border-4 border-primary -mt-16 flex items-center justify-center mb-4">
          <CheckCircle className="h-14 w-14 text-primary" />
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">Successful!</h2>

        <div className="text-center mb-8">
          <p className="mb-2">Thank you for signing up to</p>
          <p className="font-bold text-lg text-primary mb-2">{event.title}</p>
          <p className="text-sm text-gray-600 mb-4">You will receive the details on the event's in your email!</p>

          {/* Event details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-xs mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Time:</span>
              <span className="text-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm">{event.location || "Virtual Event"}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-center mb-8">Together, We Create Change—Thank You!</p>

        <div className="w-full max-w-xs">
          <Link href="/events">
            <Button className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-xl">
              Continue Helping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
