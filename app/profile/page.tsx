"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Profile {
  full_name: string
  gender: "Male" | "Female" | null
  birthday: string | null
  cccd: string
  guest_type_id: number
  email: string
  phone_number: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [guestTypes, setGuestTypes] = useState<{ guest_type_id: number; guest_type_name: string }[]>([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const router = useRouter()

useEffect(() => {
  const token = localStorage.getItem("token")
  if (!token) {
    router.push("/sign-in")
    return
  }

  // gọi API nếu có token
  fetch("http://localhost:4000/api/bookingweb/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then(setProfile)
    .catch(() => setError("Failed to load profile"))

  fetch("http://localhost:4000/api/guests/guestType")
    .then((res) => res.json())
    .then(setGuestTypes)
}, [router])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleGenderChange = (val: string) => setProfile((p) => p && { ...p, gender: val as "Male" | "Female" })
  const handleGuestTypeChange = (val: string) => setProfile((p) => p && { ...p, guest_type_id: parseInt(val) })

  const updatePersonal = () => {
    fetch("http://localhost:4000/api/bookingweb/profile/personal", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: profile?.full_name,
        gender: profile?.gender,
        birthday: profile?.birthday,
        cccd: profile?.cccd,
        guest_type_id: profile?.guest_type_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setError("Update failed"))
  }

  const updateContact = () => {
    fetch("http://localhost:4000/api/bookingweb/profile/contact", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: profile?.email,
        phone_number: profile?.phone_number,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setError("Update failed"))
  }

  const deleteAccount = () => {
    if (!confirm("Are you sure you want to delete your account?")) return
    fetch("http://localhost:4000/api/bookingweb/profile", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        localStorage.clear()
        window.location.href = "/sign-up"
      })
      .catch(() => alert("Failed to delete"))
  }

  if (!profile) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-6 md:p-12 text-[#1F2A44] font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Personal Data */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input name="full_name" value={profile.full_name} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input name="cccd" value={profile.cccd} onChange={handleChange} />
            </div>
                <div>
              <label className="block text-sm font-medium mb-1">Guest Type</label>
              <Select
                value={profile.guest_type_id?.toString() ?? ""} // Sử dụng optional chaining và nullish coalescing
                onValueChange={handleGuestTypeChange}
              >
                <SelectTrigger className="h-10 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select guest type" />
                </SelectTrigger>
                <SelectContent>
                  {guestTypes.map((type) => (
                    <SelectItem key={type.guest_type_id} value={type.guest_type_id.toString()}>
                      {type.guest_type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <Select value={profile.gender || ""} onValueChange={handleGenderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Birthdate</label>
              <Input type="date" name="birthday" value={profile.birthday || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-[#0e6ba8] hover:bg-[#095c90]" onClick={updatePersonal}>
              Update
            </Button>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone_number" value={profile.phone_number} onChange={handleChange} />
            </div>
          </div>
          <Button className="bg-[#0e6ba8] hover:bg-[#095c90]" onClick={updateContact}>
            Update
          </Button>
        </div>

        {/* Delete */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
          <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
          <p className="text-sm text-gray-500">
            Once your account is deleted, you will not be able to restore your account or data.
          </p>
          <Button variant="destructive" className="mt-3" onClick={deleteAccount}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
