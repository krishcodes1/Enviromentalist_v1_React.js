"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { AuthLogo } from "@/components/ui/auth-logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "An error occurred while sending the reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container leaf-pattern-bg">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center">
          <Link href="/auth/login" className="text-white p-2 rounded-full">
            <ArrowLeft size={24} />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <AuthLogo size="lg" />
        </div>
      </div>

      <div className="auth-form-container">
        <h1 className="text-2xl font-bold text-primary mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            <p>Password reset link has been sent to your email. Please check your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input pl-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="#0B5D1E"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                      stroke="#0B5D1E"
                      strokeWidth="1.5"
                    />
                    <path d="M2 12H8" stroke="#0B5D1E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 12H22" stroke="#0B5D1E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 2V8" stroke="#0B5D1E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 16V22" stroke="#0B5D1E" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/auth/login" className="auth-link">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
