"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Calendar, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, signOut } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="rounded-full border-[#1e2a4a] text-[#1e2a4a]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <span className="h-6 w-6 rounded-full bg-[#e57373] text-white flex items-center justify-center text-xs mr-2">
            {user.full_name?.charAt(0)}
          </span>
          {user.full_name}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border">
          <div className="p-2 border-b">
            <div className="font-medium">{user.full_name}</div>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-2 text-gray-500" />
              Profile
            </Link>
            <Link
              href="/my-booking"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              My Booking
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-500" />
              Log-out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
