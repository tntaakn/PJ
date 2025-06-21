"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsOtpSent(true)
    setIsLoading(false)

    // After 3 seconds, redirect to sign in
    setTimeout(() => {
      router.push("/sign-in")
    }, 3000)
  }

  return (
    <main className="min-h-screen flex relative">
      {/* Background Image */}
      <div className="flex-1 relative">
        <Image
          src="/placeholder.svg?height=800&width=1200"
          alt="Luxury hotel resort with pools and palm trees"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-500/20" />

        {/* Forgot Password Form */}
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
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] rounded-full py-3 h-12 text-white font-medium"
                >
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-lg font-medium">✓ OTP Sent Successfully!</div>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/sign-in" className="text-sm text-[#0e6ba8] hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
