"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { OnboardingContainer } from "@/components/onboarding/onboarding-container"
import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        // Get user's name for personalization if available
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).single()

        if (profile?.full_name) {
          setUserName(profile.full_name)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <OnboardingContainer userName={userName} />
}
