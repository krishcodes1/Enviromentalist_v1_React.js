import Image from "next/image"
import Link from "next/link"

interface AuthLogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
}

export function AuthLogo({ size = "lg", withText = false }: AuthLogoProps) {
  const sizeMap = {
    sm: 48,
    md: 64,
    lg: 96,
  }

  const logoSize = sizeMap[size]

  return (
    <Link href="/" className="flex flex-col items-center text-white">
      <div className="relative" style={{ width: logoSize, height: logoSize }}>
        <Image
          src="/images/greenery-logo.png"
          alt="Environmentalist Logo"
          width={logoSize}
          height={logoSize}
          priority
          className="drop-shadow-lg"
        />
      </div>
      {withText && <span className="mt-3 text-xl font-bold drop-shadow-md">Environmentalist</span>}
    </Link>
  )
}

export default AuthLogo
