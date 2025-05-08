"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function GreenStep() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-center mb-6">
        <Image
          src="/environmental-achievement.png"
          alt="Help us become green"
          width={144}
          height={144}
          className="h-36 w-36 object-contain"
        />
      </div>
      <h2 className="text-xl font-bold mb-2 text-emerald-800">HELP US BECOME GREEN</h2>
      <p className="text-gray-600 mb-8">
        Reduce the trash pile on the city's streets & parks. Participate in clean-up events and recycling drives.
      </p>
    </motion.div>
  )
}
