import type { ReactNode } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { CreatePostFAB } from "@/components/post/create-post-fab"
import { AnimatedContainer } from "@/components/ui/animated-container"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AnimatedContainer animation="fadeIn" className="flex-1 pb-16 md:pb-0 max-w-7xl mx-auto w-full px-4">
        {children}
      </AnimatedContainer>
      <CreatePostFAB />
      <MobileNav />
    </div>
  )
}
