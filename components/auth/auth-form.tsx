"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"

type AuthMode = "signin" | "signup"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validations, setValidations] = useState({
    username: true,
    email: true,
    password: true,
    passwordStrength: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  })
  const supabase = createClient()
  const router = useRouter()

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
    return usernameRegex.test(username.trim())
  }

  const validatePassword = (password: string): boolean => {
    const hasLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    setValidations((prev) => ({
      ...prev,
      passwordStrength: {
        length: hasLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
        special: hasSpecial,
      },
    }))

    return hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial
  }

  const validateForm = (): boolean => {
    if (mode === "signin") {
      const isEmailValid = validateEmail(email)
      setValidations((prev) => ({ ...prev, email: isEmailValid }))
      return isEmailValid
    } else {
      const isUsernameValid = validateUsername(username)
      const isEmailValid = validateEmail(email)
      const isPasswordValid = validatePassword(password)

      setValidations((prev) => ({
        ...prev,
        username: isUsernameValid,
        email: isEmailValid,
        password: isPasswordValid,
      }))

      return isUsernameValid && isEmailValid && isPasswordValid
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setError("Please correct the validation errors")
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) throw error
        router.push("/home")
        router.refresh()
      } else {
        // Use our custom route handler for signup
        const formData = new FormData()
        formData.append("email", email.trim())
        formData.append("password", password)
        formData.append("username", username.trim())

        const response = await fetch("/auth/trigger", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to sign up")
        }

        router.push("/onboarding")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError(null)
    setValidations({
      username: true,
      email: true,
      password: true,
      passwordStrength: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
    })
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <Logo size="lg" color="green" />
        <h1 className="text-2xl font-bold mt-4 text-primary">
          {mode === "signin" ? "Welcome Back!" : "Join Environmentalist"}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === "signin"
            ? "Sign in to continue your environmental journey"
            : "Create an account to start making a difference"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (!validations.username) {
                  setValidations((prev) => ({ ...prev, username: validateUsername(e.target.value) }))
                }
              }}
              className={!validations.username ? "border-red-500" : ""}
              required
              autoComplete="username"
            />
            {!validations.username && (
              <p className="text-red-500 text-xs mt-1">
                Username must be 3-30 characters and can only contain letters, numbers, underscores, and hyphens
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (!validations.email) {
                setValidations((prev) => ({ ...prev, email: validateEmail(e.target.value) }))
              }
            }}
            className={!validations.email ? "border-red-500" : ""}
            required
            autoComplete={mode === "signin" ? "email" : "new-email"}
          />
          {!validations.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (mode === "signup") {
                validatePassword(e.target.value)
              }
            }}
            className={!validations.password ? "border-red-500" : ""}
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          {mode === "signup" && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium">Password requirements:</p>
              <ul className="text-xs space-y-1">
                <li className={validations.passwordStrength.length ? "text-green-600" : "text-gray-500"}>
                  ✓ At least 8 characters
                </li>
                <li className={validations.passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}>
                  ✓ At least one uppercase letter
                </li>
                <li className={validations.passwordStrength.lowercase ? "text-green-600" : "text-gray-500"}>
                  ✓ At least one lowercase letter
                </li>
                <li className={validations.passwordStrength.number ? "text-green-600" : "text-gray-500"}>
                  ✓ At least one number
                </li>
                <li className={validations.passwordStrength.special ? "text-green-600" : "text-gray-500"}>
                  ✓ At least one special character
                </li>
              </ul>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>

        <div className="text-center mt-4">
          <button type="button" onClick={toggleMode} className="text-primary hover:underline text-sm">
            {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  )
}
