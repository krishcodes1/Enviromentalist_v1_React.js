"use client"

import { useState, useEffect } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function toast({ title, description, variant = "default", duration = 3000 }: ToastProps) {
  // Create a custom event
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      variant,
      id: Math.random().toString(36).substring(2, 9),
      duration,
    },
  })

  // Dispatch the event
  document.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string
      title?: string
      description?: string
      variant?: "default" | "destructive"
      duration: number
    }>
  >([])

  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setToasts((prev) => [...prev, detail])

      // Remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== detail.id))
      }, detail.duration)
    }

    document.addEventListener("toast", handleToast)

    return () => {
      document.removeEventListener("toast", handleToast)
    }
  }, [])

  return { toasts }
}
