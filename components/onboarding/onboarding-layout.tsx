"use client"

import type { ReactNode } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface OnboardingLayoutProps {
  children: ReactNode
  totalSteps: number
  currentStep: number
  onNext: () => void
  onBack?: () => void
  nextDisabled?: boolean
  nextLabel?: string
  showSkip?: boolean
  onSkip?: () => void
}

export function OnboardingLayout({
  children,
  totalSteps,
  currentStep,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = "Next",
  showSkip = false,
  onSkip,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col leaf-pattern-bg">
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          {onBack && (
            <button onClick={onBack} className="text-white flex items-center" disabled={nextDisabled}>
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="mb-6">
            <Logo size="lg" color="white" />
          </div>

          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            {children}

            <div className="mt-8 flex flex-col space-y-4">
              <Button onClick={onNext} disabled={nextDisabled} className="w-full">
                {nextDisabled ? "Processing..." : nextLabel}
              </Button>

              {showSkip && onSkip && (
                <Button variant="ghost" onClick={onSkip} className="w-full" disabled={nextDisabled}>
                  Skip
                </Button>
              )}
            </div>
          </div>

          {totalSteps > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === currentStep - 1 ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
