"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type Community = {
  id: string
  name: string
  image_url?: string
  description?: string
}

type CommunityListProps = {
  communities: Community[]
}

export default function CommunityList({ communities = [] }: CommunityListProps) {
  if (!communities || communities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm mb-3">No communities found</p>
        <Button size="sm" asChild>
          <Link href="/community/create">Create Community</Link>
        </Button>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {communities.map((community) => (
        <motion.li
          key={community.id}
          className="flex items-center gap-3"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={community.image_url || ""} alt={community.name} />
            <AvatarFallback className="bg-green-200 text-green-800">
              {community.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/community/${community.id}`} className="font-medium text-sm hover:text-primary truncate block">
              {community.name}
            </Link>
            {community.description && <p className="text-xs text-gray-500 truncate">{community.description}</p>}
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </motion.li>
      ))}
      <li className="pt-2">
        <Button size="sm" variant="outline" className="w-full text-xs" asChild>
          <Link href="/community">View All Communities</Link>
        </Button>
      </li>
    </ul>
  )
}
