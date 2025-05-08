"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthLogo } from "@/components/ui/auth-logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import DOMPurify from "dompurify"

// Define validation schema using Zod
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false,
  })
  const [csrfToken, setCsrfToken] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/auth/csrf", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error)
      }
    }

    fetchCsrfToken()
  }, [])

  // Validate password in real-time
  useEffect(() => {
    const password = formData.password || ""
    const confirmPassword = formData.confirmPassword || ""

    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      match: password === confirmPassword && password !== "",
    })
  }, [formData.password, formData.confirmPassword])

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = (): boolean => {
    try {
      // Sanitize inputs before validation
      const sanitizedData = {
        username: sanitizeInput(formData.username || ""),
        email: sanitizeInput(formData.email || ""),
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
      }

      registerSchema.parse(sanitizedData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password
    const password = formData.password || ""
    const confirmPassword = formData.confirmPassword || ""
    const username = formData.username || ""
    const email = formData.email || ""

    // Custom password validation
    const validatePassword = (password: string, confirmPassword: string): string | null => {
      if (password !== confirmPassword) {
        return "Passwords do not match"
      }
      return null
    }

    const passwordError = validatePassword(password, confirmPassword)
    if (passwordError) {
      setErrors((prev) => ({ ...prev, form: passwordError }))
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Create a FormData object for the request
      const formDataObj = new FormData()
      formDataObj.append("username", username)
      formDataObj.append("email", email)
      formDataObj.append("password", password)

      // Use our custom route handler for signup
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formDataObj,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
      }

      router.push("/onboarding")
      router.refresh()
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        form: error.message || "An error occurred during registration",
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container leaf-natural-bg">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center">
          <Link href="/auth/login" className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <AuthLogo size="lg" withText />
        </div>
      </div>

      <div className="auth-form-container">
        <h1 className="text-2xl font-bold text-primary mb-2">Create Account</h1>
        <p className="text-gray-600 mb-8">Join our community of environmentalists</p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                className={`auth-input pl-10 ${errors.username ? "border-red-500" : ""}`}
                required
                aria-describedby="username-error"
                autoComplete="username"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.username && (
              <p id="username-error" className="text-sm text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`auth-input pl-10 ${errors.email ? "border-red-500" : ""}`}
                required
                aria-describedby="email-error"
                autoComplete="email"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"
                    fill="#0B5D1E"
                  />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className={`auth-input pl-10 ${errors.password ? "border-red-500" : ""}`}
                required
                aria-describedby="password-error"
                autoComplete="new-password"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z"
                    fill="#0B5D1E"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
            <div className="text-xs space-y-1 mt-1">
              <div className="flex items-center">
                {validations.length ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.length ? "text-green-500" : "text-gray-500"}>At least 8 characters</span>
              </div>
              <div className="flex items-center">
                {validations.uppercase ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.uppercase ? "text-green-500" : "text-gray-500"}>One uppercase letter</span>
              </div>
              <div className="flex items-center">
                {validations.lowercase ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.lowercase ? "text-green-500" : "text-gray-500"}>One lowercase letter</span>
              </div>
              <div className="flex items-center">
                {validations.number ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.number ? "text-green-500" : "text-gray-500"}>One number</span>
              </div>
              <div className="flex items-center">
                {validations.special ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.special ? "text-green-500" : "text-gray-500"}>One special character</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`auth-input pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                required
                aria-describedby="confirm-password-error"
                autoComplete="new-password"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10Z"
                    stroke="#0B5D1E"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z"
                    fill="#0B5D1E"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
            <div className="text-xs space-y-1 mt-1">
              <div className="flex items-center">
                {validations.match ? (
                  <Check size={14} className="text-green-500 mr-1" />
                ) : (
                  <X size={14} className="text-gray-400 mr-1" />
                )}
                <span className={validations.match ? "text-green-500" : "text-gray-500"}>Passwords match</span>
              </div>
            </div>
          </div>

          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
              <p id="register-error" className="text-sm">
                {errors.form}
              </p>
            </div>
          )}

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="auth-link">
              Login
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
            <button className="auth-social-button" aria-label="Continue with Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.4 19.6 18.64C21.16 16.88 22.04 14.64 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                  fill="#1877F2"
                />
              </svg>
            </button>
            <button className="auth-social-button" aria-label="Continue with Google">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
            <button className="auth-social-button" aria-label="Continue with Apple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
