"use client"

import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Bell, ChevronLeft, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  showNotifications?: boolean
  showBackButton?: boolean
  title?: string
  color?: "white" | "green"
}

export function Header({ showNotifications = true, showBackButton = false, title, color = "green" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const pathname = usePathname()

  // Handle scroll events to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      // Determine if we're scrolling up or down
      const isScrollingDown = prevScrollPos < currentScrollPos
      const isScrollingUp = prevScrollPos > currentScrollPos

      // Only hide header when scrolling down past a threshold (50px)
      // and show it immediately when scrolling up
      if (isScrollingDown && visible && currentScrollPos > 50) {
        setVisible(false)
      } else if (isScrollingUp && !visible) {
        setVisible(true)
      }

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos, visible])

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
    <header
      className={`sticky top-0 z-40 bg-transparent transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <motion.div
        className="flex items-center justify-between px-8 py-3 sm:py-4 mx-auto my-3 max-w-6xl relative bg-gradient-to-r from-emerald-800 to-teal-900 rounded-full shadow-lg"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center">
          {showBackButton ? (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="mr-2 rounded-full" asChild>
                <Link href="/home">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Logo size="md" color={logoColor} withText />
            </motion.div>
          )}
          {title && (
            <motion.h1
              className="text-xl font-bold ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {title}
            </motion.h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative border-emerald-600 hover:bg-emerald-700 bg-white"
            >
              <Bell className="h-5 w-5 text-black" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full md:hidden border-emerald-600 hover:bg-emerald-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-4 py-2 bg-white/90 backdrop-blur-md border-t border-gray-100 mobile-nav">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/home"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        header * {
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
        }
        header button {
          color: white;
        }
        header .mobile-nav * {
          color: #1f2937; /* text-gray-800 equivalent */
        }
      `}</style>
    </header>
  )
}
