import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingProvider } from "@/contexts/onboarding-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Environmentalist Community",
  description: "Connect with environmentally conscious individuals and communities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <OnboardingProvider>{children}</OnboardingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
