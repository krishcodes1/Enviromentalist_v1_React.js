import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="leaf-pattern-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
        <Logo size="md" color="white" />

        <h1 className="text-2xl font-bold mt-8 mb-2">Yay! +30 points</h1>

        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center my-8">
          <CheckCircle className="h-16 w-16 text-primary-900" />
        </div>

        <h2 className="text-xl font-bold mb-2">Successful!</h2>

        <p className="mb-8">
          Thank you for your donation!
          <br />
          You've made a difference in someone's life today.
        </p>

        <p className="text-sm mb-8">Together, We Create Change - Thank You!</p>

        <div className="w-full max-w-xs">
          <Link href="/home">
            <Button className="w-full bg-white text-primary-900 hover:bg-gray-100 py-3 rounded-xl">
              Continue Helping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
