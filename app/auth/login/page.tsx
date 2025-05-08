"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create the Supabase client inside the handler to ensure it's fresh
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Check if we have a valid session
      if (!data.session) {
        throw new Error("Failed to create session")
      }

      // Always redirect to onboarding after login
      router.push("/onboarding")
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl mb-8">
          <Logo size="lg" color="white" />
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 mb-6">Sign in to continue your environmental journey</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-gray-200 py-3 px-4 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-gray-200 py-3 px-4 rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember-me" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-primary-900 font-medium">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary-900 text-white py-3 rounded-xl" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary-900 font-medium">
              Register
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                  fill="#1877F2"
                />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#4285F4"
                />
                <path
                  d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                  fill="#EA4335"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5717 17.5742 13.3037 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                  fill="#34A853"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#FBBC05"
                />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.05 20.28C16.07 21.23 15.01 21 13.9 21C12.75 21 12.31 20.25 10.96 20.25C9.58 20.25 9.02 21 7.95 21C6.85 21 5.74 20.18 4.75 19.18C3.14 17.47 1.97 14.49 1.97 11.68C1.97 7.59 4.95 5.5 7.88 5.5C9.15 5.5 10.22 6.3 11.05 6.3C11.85 6.3 13.05 5.44 14.5 5.44C15.34 5.44 17.37 5.56 18.81 7.53C18.76 7.56 16.33 9.04 16.33 11.94C16.33 15.28 19.28 16.6 19.33 16.61C19.33 16.63 18.97 17.9 18.01 19.17C17.67 19.73 17.38 20.28 17.05 20.28ZM13.34 5.17C12.94 3.82 13.67 2.5 14.35 1.69C15.22 0.71 16.59 0.03 17.73 0C17.85 1.5 17.31 2.97 16.47 3.97C15.68 5.01 14.38 5.75 13.34 5.17Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
