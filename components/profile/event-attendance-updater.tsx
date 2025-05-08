"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function EventAttendanceUpdater() {
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  useEffect(() => {
    // Function to check if we need to refresh the page
    const checkForUpdates = () => {
      const storedLastUpdate = localStorage.getItem("eventAttendanceLastUpdate")

      if (storedLastUpdate) {
        const timestamp = Number.parseInt(storedLastUpdate, 10)

        // If the stored timestamp is newer than our last known update
        if (timestamp > lastUpdate) {
          setLastUpdate(timestamp)
          router.refresh() // Refresh the page to show updated events
        }
      }
    }

    // Check for updates when the component mounts
    checkForUpdates()

    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "eventAttendanceLastUpdate" || e.key === "joinedEvents") {
        checkForUpdates()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically (every 30 seconds)
    const interval = setInterval(checkForUpdates, 30000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [lastUpdate, router])

  // This component doesn't render anything visible
  return null
}
