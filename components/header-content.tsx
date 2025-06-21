"use client"

import { useAuth } from "@/lib/auth-context"
import { UserDropdown } from "./user-dropdown"
import { AuthButtons } from "./auth-buttons"

export function HeaderContent() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <UserDropdown /> : <AuthButtons />
}
