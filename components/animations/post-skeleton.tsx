"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function PostSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Pulse className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <Pulse className="h-4 w-32 bg-gray-200 rounded" />
            <Pulse className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-3">
        <Pulse className="h-6 w-3/4 bg-gray-200 rounded" />
        <Pulse className="h-4 w-full bg-gray-200 rounded" />
        <Pulse className="h-4 w-full bg-gray-200 rounded" />
        <Pulse className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="flex gap-1 pt-1">
          <Pulse className="h-5 w-16 bg-gray-200 rounded-full" />
          <Pulse className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between w-full">
          <div className="flex gap-3">
            <Pulse className="h-8 w-16 bg-gray-200 rounded" />
            <Pulse className="h-8 w-16 bg-gray-200 rounded" />
            <Pulse className="h-8 w-16 bg-gray-200 rounded" />
          </div>
          <Pulse className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}

function Pulse({ className }: { className: string }) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}
