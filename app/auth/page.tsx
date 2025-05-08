import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-gray-500 dark:text-gray-400">Choose an option to continue</p>
      </div>

      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/auth/login">Sign In</Link>
        </Button>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/register">Create Account</Link>
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
