"use client"

import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  showNotifications?: boolean
  showBackButton?: boolean
  title?: string
  color?: "white" | "green"
}

export function Header({ showNotifications = true, showBackButton = false, title, color = "green" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Determine if we're on a dark background page
  const isDarkBg =
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/onboarding" ||
    pathname === "/welcome" ||
    pathname === "/success"

  // Use white logo on dark backgrounds, green on light
  const logoColor = isDarkBg ? "white" : "green"

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center">
        {showBackButton ? (
          <Button variant="ghost" size="icon" className="mr-2">
            <Link href="/home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
          </Button>
        ) : (
          <Logo size="md" color={logoColor} withText />
        )}
        {title && <h1 className="text-xl font-bold ml-2">{title}</h1>}
      </div>

      <div className="flex items-center">
        {showNotifications && (
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
        )}
      </div>
    </header>
  )
}
