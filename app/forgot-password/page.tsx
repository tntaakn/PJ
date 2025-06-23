"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:4000/api/bookingweb/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to send OTP")

      setStep("otp")
    } catch (err: any) {
      alert(err.message || "Unexpected error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:4000/api/bookingweb/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Invalid OTP")

      alert("Password reset successful! Redirecting to sign in...")
      router.push("/sign-in")
    } catch (err: any) {
      alert(err.message || "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex relative">
      <div className="flex-1 relative">
        <Image
          src="/view.jpeg?height=800&width=1200"
          alt="Luxury hotel resort with pools and palm trees"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-500/20" />

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

            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-6">
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
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center">
                  <div className="text-green-600 text-lg font-medium">✓ OTP Sent Successfully!</div>
                  <p className="text-gray-600">
                    Enter the OTP sent to <strong>{email}</strong>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">OTP Code</label>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full h-12 bg-gray-50 border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-12 bg-gray-50 border-gray-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] rounded-full py-3 h-12 text-white font-medium"
                >
                  {isLoading ? "Verifying..." : "Verify and Reset Password"}
                </Button>
              </form>
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
