import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  color?: "white" | "green"
  withText?: boolean
  href?: string
}

export function Logo({ size = "md", color = "white", withText = false, href = "/" }: LogoProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const logoSize = sizeMap[size]

  return (
    <Link href={href} className={`flex items-center gap-2 ${color === "white" ? "text-white" : "text-primary-900"}`}>
      <div className="relative">
        <Image
          src="/images/greenery-logo.png"
          alt="Environmentalist Logo"
          width={logoSize}
          height={logoSize}
          className="object-contain"
          priority
        />
      </div>
      {withText && (
        <span className={`font-bold ${size === "lg" ? "text-xl" : size === "md" ? "text-lg" : "text-base"}`}>
          Environmentalist
        </span>
      )}
    </Link>
  )
}
