"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // For demo purposes, we'll use email instead of mobile for sign in
    const success = await signIn(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("Invalid email or password")
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex relative">
      {/* Background Image */}
      <div className="flex-1 relative">
        <Image
          src="/view.jpeg?height=800&width=1200"
          alt="Luxury hotel resort with pools and palm trees"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-500/20" />

        {/* Sign In Form */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium">
                  Welcome to <span className="text-[#0e6ba8] font-bold">SERENITY</span>
                </h1>
                <Link href="/sign-up" className="text-sm text-[#0e6ba8] hover:underline">
                  Don't have an Account?
                  <br />
                  Sign up
                </Link>
              </div>
              <h2 className="text-3xl font-bold text-left">Sign in</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enter your Email</label>
                <Input
                  type="email"
                  placeholder="abcdefgh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Enter your Password</label>
                <Input
                  type="password"
                  placeholder="123456789"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 bg-gray-50 border-gray-200"
                />
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-[#0e6ba8] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] rounded-full py-3 h-12 text-white font-medium"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
