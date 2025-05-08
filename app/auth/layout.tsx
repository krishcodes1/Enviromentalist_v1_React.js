import type { ReactNode } from "react"
import Image from "next/image"
import AuthLogo from "@/components/ui/auth-logo"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <AuthLogo />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Welcome to Environmentalist</h2>
            <p className="mt-2 text-sm text-white">
              Connect with environmentally conscious individuals and communities
            </p>
          </div>
          {children}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/environmentalist-background.png"
          alt="Environmentalist background"
          fill
          priority
        />
      </div>
    </div>
  )
}
