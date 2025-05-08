"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

type OnboardingContextType = {
  showOnboarding: boolean
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  completeOnboarding: () => Promise<void>
  skipOnboarding: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(3)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .single()

          setShowOnboarding(!profile?.onboarding_completed)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error checking onboarding status:", error)
        setIsLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", session.user.id)

        setShowOnboarding(false)
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  const skipOnboarding = async () => {
    await completeOnboarding()
  }

  if (isLoading) {
    return <>{children}</>
  }

  if (!showOnboarding) {
    return <>{children}</>
  }

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
