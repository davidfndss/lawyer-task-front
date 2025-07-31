"use client"

import { useRouter } from "next/navigation"

interface RedirectButtonProps {
  route?: string
  className?: string
  children?: React.ReactNode
}

export default function RedirectButton({ route, className, children }: RedirectButtonProps): React.JSX.Element {
  const router = useRouter()

  const handleClick = () => {
    if (route) {
      router.push(route)
    } else {
      router.back()
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}
