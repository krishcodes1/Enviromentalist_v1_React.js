"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, MessageSquare, User } from "lucide-react"
import { motion } from "framer-motion"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/community", icon: Users, label: "Community" },
    { href: "/events", icon: Calendar, label: "Events" },
    { href: "/chats", icon: MessageSquare, label: "Chats" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center p-2 relative">
              <motion.div whileTap={{ scale: 0.9 }} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -inset-1 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={24} className={isActive ? "text-primary-900" : "text-gray-500"} />
              </motion.div>
              <span className={`text-xs mt-1 ${isActive ? "text-primary-900 font-medium" : "text-gray-500"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
