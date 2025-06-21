"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface ProtectedActionProps {
  children: ReactNode
  fallbackAction?: () => void
}

export function ProtectedAction({ children, fallbackAction }: ProtectedActionProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      e.stopPropagation()
      if (fallbackAction) {
        fallbackAction()
      } else {
        router.push("/sign-in")
      }
    }
  }

  return <div onClick={handleClick}>{children}</div>
}
