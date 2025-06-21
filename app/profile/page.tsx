"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false)
  const [isUpdatingContact, setIsUpdatingContact] = useState(false)

  const [personalData, setPersonalData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    id: user?.idNumber || "",
    nationality: "Vietnamese",
    gender: "Male",
    birthdate: "2005-02-05",
  })

  const [contactData, setContactData] = useState({
    address: user?.address || "",
    email: user?.email || "",
    phoneNumber: user?.mobile || "",
  })

  const handlePersonalUpdate = async () => {
    setIsUpdatingPersonal(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nameParts = personalData.fullName.split(" ")
    updateProfile({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      idNumber: personalData.id,
    })

    setIsUpdatingPersonal(false)
  }

  const handleContactUpdate = async () => {
    setIsUpdatingContact(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateProfile({
      address: contactData.address,
      email: contactData.email,
      mobile: contactData.phoneNumber,
    })

    setIsUpdatingContact(false)
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1e2a4a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Profile</h1>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Data Section */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Personal Data</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {/* Avatar Section */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-pink-300 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-purple-300 flex items-center justify-center">
                    <span className="text-2xl">👩‍💼</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-3 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={personalData.fullName}
                      onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                      placeholder="Nguyen Brakemull"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nationality</label>
                    <Select
                      value={personalData.nationality}
                      onValueChange={(value) => setPersonalData({ ...personalData, nationality: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                        <SelectItem value="American">American</SelectItem>
                        <SelectItem value="British">British</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Korean">Korean</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <Input
                      value={personalData.id}
                      onChange={(e) => setPersonalData({ ...personalData, id: e.target.value })}
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Birthdate</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={personalData.birthdate}
                        onChange={(e) => setPersonalData({ ...personalData, birthdate: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <Select
                      value={personalData.gender}
                      onValueChange={(value) => setPersonalData({ ...personalData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handlePersonalUpdate}
                      disabled={isUpdatingPersonal}
                      className="bg-[#0e6ba8] hover:bg-[#0a5a8e] text-white"
                    >
                      {isUpdatingPersonal ? "Updating..." : "Up date"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  placeholder="123 street, ward, city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="abcdefgh@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  value={contactData.phoneNumber}
                  onChange={(e) => setContactData({ ...contactData, phoneNumber: e.target.value })}
                  placeholder="#123456789"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleContactUpdate}
                  disabled={isUpdatingContact}
                  className="bg-[#0e6ba8] hover:bg-[#0a5a8e] text-white"
                >
                  {isUpdatingContact ? "Updating..." : "Up date"}
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Account</h2>
                <p className="text-sm text-gray-600">
                  Once your account is deleted, you will not be able to restore your account or data.
                </p>
              </div>
              <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] text-white">Delete</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

function Footer() {
  return (
    <footer className="border-t py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">Serenity Hotel</h3>
          <p className="text-sm text-gray-600">Experience luxury and comfort at our premier hotel destination.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>123 Hotel Street, City Name, Country</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>info@serenityhotel.com</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Newsletter</h3>
          <p className="text-sm text-gray-600 mb-2">Subscribe to our newsletter for special deals and updates.</p>
          <div className="flex gap-2">
            <Input placeholder="Your e-mail" className="h-9" />
            <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-9">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
