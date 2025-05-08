import type React from "react"
import ProfileClientWrapper from "./client-wrapper"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProfileClientWrapper>{children}</ProfileClientWrapper>
}
