import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl">
        <Logo size="lg" color="white" />

        <div className="my-12">
          <h1 className="text-3xl font-bold mb-4">
            Hi!
            <br />
            Welcome back Dr.Krish
          </h1>

          <p className="text-lg">
            Thanks for joining us!
            <br />
            Environmentalist
          </p>
        </div>

        <Link href="/home" className="w-full max-w-xs">
          <Button className="w-full bg-white text-primary-900 hover:bg-gray-100 py-3 rounded-xl">Continue</Button>
        </Link>
      </div>
    </div>
  )
}
