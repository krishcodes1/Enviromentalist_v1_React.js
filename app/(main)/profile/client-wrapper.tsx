"use client"

import type React from "react"

import { EventAttendanceUpdater } from "@/components/profile/event-attendance-updater"

export default function ProfileClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EventAttendanceUpdater />
      {children}
    </>
  )
}
