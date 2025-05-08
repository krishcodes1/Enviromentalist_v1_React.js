"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { CommunityStep } from "./community-step"
import { GreenStep } from "./green-step"
import { BadgeStep } from "./badge-step"

interface OnboardingContainerProps {
  userName?: string
}

export function OnboardingContainer({ userName = "" }: OnboardingContainerProps) {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const totalSteps = 3

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Mark onboarding as completed
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", session.user.id)
        }
      } catch (error) {
        console.error("Error updating onboarding status:", error)
      }

      // Redirect to home
      router.push("/home")
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkip = async () => {
    // Mark onboarding as completed
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", session.user.id)
      }
    } catch (error) {
      console.error("Error updating onboarding status:", error)
    }

    // Redirect to home
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-900 to-emerald-800 bg-pattern-leaves">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-8">
          <Logo size="lg" color="white" />
        </div>

        <motion.div
          className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            {userName && (
              <motion.h2
                className="text-xl font-bold text-center text-emerald-800 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome{userName ? `, ${userName}` : ""}!
              </motion.h2>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && <CommunityStep key="community" />}
              {step === 2 && <GreenStep key="green" />}
              {step === 3 && <BadgeStep key="badge" />}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  className="px-6 py-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                >
                  Back
                </Button>
              ) : (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="px-6 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  Skip
                </Button>
              )}

              <Button onClick={handleNext} className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700">
                {step === totalSteps ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 w-2 rounded-full ${i === step - 1 ? "bg-white" : "bg-white/30"}`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: i === step - 1 ? 1.2 : 1,
                opacity: i === step - 1 ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
