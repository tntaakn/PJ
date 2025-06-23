// ✅ File hoàn chỉnh: SignUpPage (page.tsx) dùng guest_type_name dynamic và có kiểm tra hợp lệ

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    id: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [guestTypes, setGuestTypes] = useState<{ guest_type_name: string }[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:4000/api/guests/guestType")
      .then((res) => res.json())
      .then((data) => {
        setGuestTypes(data)
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, nationality: data[0].guest_type_name }))
        }
      })
      .catch((err) => console.error("Failed to load guest types:", err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNationalityChange = (value: string) => {
    setFormData({
      ...formData,
      nationality: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!formData.nationality) {
      setError("Please select a guest type.")
      setIsLoading(false)
      return
    }

    const registrationDataForBackend = {
      full_name: formData.fullname,
      cccd: formData.id,
      guest_type_name: formData.nationality,
      email: formData.email,
      phone_number: formData.phoneNumber,
      password: formData.password,
    }

    try {
      const success = await signUp(registrationDataForBackend)
      if (success) router.push("/profile")
      else setError("Registration failed. Please try again.")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex relative">
      <div className="flex-1 relative">
        <Image
          src="/placeholder.svg?height=800&width=1200"
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
                <Link href="/sign-in" className="text-sm text-[#0e6ba8] hover:underline">
                  Have an Account?
                  <br />
                  Sign in
                </Link>
              </div>
              <h2 className="text-3xl font-bold text-left">Sign up</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Enter your Fullname</label>
                <Input
                  type="text"
                  name="fullname"
                  placeholder="Nguyen Brakemull"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ID</label>
                  <Input
                    type="text"
                    name="id"
                    placeholder="123456"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    className="h-10 bg-gray-50 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Guest Type</label>
                  <Select value={formData.nationality} onValueChange={handleNationalityChange}>
                    <SelectTrigger className="h-10 bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select guest type" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestTypes.map((type) => (
                        <SelectItem key={type.guest_type_name} value={type.guest_type_name}>
                          {type.guest_type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enter your Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="abcdefgh@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enter your Phone Number</label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="8123456789"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enter your Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="123456789"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="123456789"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-10 bg-gray-50 border-gray-200"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] rounded-full py-3 h-12 text-white font-medium"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
