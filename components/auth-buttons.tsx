"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  return (
    <div className="flex gap-2">
      <Link href="/sign-in">
        <Button
          variant="outline"
          className="rounded-full border-[#1e2a4a] text-[#1e2a4a] hover:bg-[#1e2a4a] hover:text-white"
        >
          Sign in
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button className="rounded-full bg-[#1e2a4a] hover:bg-[#0e6ba8] text-white">Sign up</Button>
      </Link>
    </div>
  )
}
