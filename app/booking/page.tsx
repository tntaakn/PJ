"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import React from "react"
import { useAuth } from "@/lib/auth-context"

// Room pricing data - should match the room data from other pages
const roomPricing = {
  "deluxe-room": { name: "Deluxe Room", price: 399 },
  "executive-suite": { name: "Executive Suite", price: 599 },
  "presidential-suite": { name: "Presidential Suite", price: 899 },
  "superior-room": { name: "Superior Room", price: 299 },
  "family-suite": { name: "Family Suite", price: 549 },
  "standard-double-room": { name: "Standard Double Room", price: 349 },
}

interface CompanionData {
  fullName: string
  id: string
  address: string
  type: "National" | "International"
}

function BookingContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const roomSlug = searchParams.get("room") || "presidential-suite"

  // Get room information
  const roomInfo = roomPricing[roomSlug as keyof typeof roomPricing] || roomPricing["presidential-suite"]

  // State for dates - get from URL params or use defaults
  const [checkInDate, setCheckInDate] = useState(searchParams.get("checkIn") || "2025-05-30")
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get("checkOut") || "2025-06-01")

  // State for guest selection - get from URL params or use defaults
  const [adults, setAdults] = useState(Number.parseInt(searchParams.get("adults") || "1"))
  const [children, setChildren] = useState(Number.parseInt(searchParams.get("children") || "1"))
  const [rooms, setRooms] = useState(Number.parseInt(searchParams.get("rooms") || "1"))

  const totalGuests = adults + children

  // Calculate number of days and total price
  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkOut <= checkIn) return 0

    const timeDiff = checkOut.getTime() - checkIn.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return roomInfo.price * daysDiff * rooms
  }

  const numberOfDays = () => {
    if (!checkInDate || !checkOutDate) return 0

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    if (checkOut <= checkIn) return 0

    const timeDiff = checkOut.getTime() - checkIn.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const totalPrice = calculateTotal()
  const days = numberOfDays()

  // State for companions - update when guest count changes
  const [activeCompanionTab, setActiveCompanionTab] = useState(1)
  const [companions, setCompanions] = useState<CompanionData[]>(() =>
    Array.from({ length: Math.max(0, totalGuests - 1) }, () => ({
      fullName: user ? `${user.firstName} ${user.lastName}` : "",
      id: user?.idNumber || "",
      address: user?.address || "",
      type: user?.idType || "National",
    })),
  )

  // Update companions when guest count changes
  React.useEffect(() => {
    const newCompanionCount = Math.max(0, totalGuests - 1)
    if (newCompanionCount !== companions.length) {
      const newCompanions = Array.from(
        { length: newCompanionCount },
        (_, index) =>
          companions[index] || {
            fullName: user ? `${user.firstName} ${user.lastName}` : "",
            id: user?.idNumber || "",
            address: user?.address || "",
            type: user?.idType || "National",
          },
      )
      setCompanions(newCompanions)
      if (activeCompanionTab > newCompanionCount) {
        setActiveCompanionTab(Math.max(1, newCompanionCount))
      }
    }
  }, [totalGuests, user])

  const updateCompanion = (index: number, field: keyof CompanionData, value: string) => {
    const updatedCompanions = [...companions]
    updatedCompanions[index] = { ...updatedCompanions[index], [field]: value }
    setCompanions(updatedCompanions)
  }

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1e2a4a] text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Reservation Form</h1>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <form className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    defaultValue={user ? `${user.firstName} ${user.lastName}` : ""}
                    placeholder="Nguyen Brakemull"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select defaultValue={user?.idType || "National"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National">National</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ID</label>
                  <Input defaultValue={user?.idNumber || ""} placeholder="123456" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input defaultValue={user?.mobile || ""} placeholder="#123456789" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input defaultValue={user?.address || ""} placeholder="123 street, ward, city" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input defaultValue={user?.email || ""} placeholder="abcdefgh@gmail.com" />
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Type Room</label>
                  <Input defaultValue={roomInfo.name} className="bg-gray-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date to</label>
                  <Input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date From</label>
                  <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rooms & Guests</label>
                  <Input
                    value={`${adults} Adult${adults !== 1 ? "s" : ""}, ${children} Child${
                      children !== 1 ? "ren" : ""
                    }, ${rooms} Room${rooms !== 1 ? "s" : ""}`}
                    className="bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Note</label>
                <Textarea placeholder="Add any special requests or notes here..." className="min-h-[120px]" />
              </div>
            </div>

            {/* Companions Section */}
            {companions.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Companions</h3>

                {/* Companion Tabs */}
                <div className="flex gap-2 mb-6">
                  {companions.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveCompanionTab(index + 1)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        activeCompanionTab === index + 1
                          ? "bg-[#0e6ba8] text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Active Companion Form */}
                {companions.map((companion, index) => (
                  <div key={index} className={activeCompanionTab === index + 1 ? "block" : "hidden"}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          placeholder="Nguyen Brakemull"
                          value={companion.fullName}
                          onChange={(e) => updateCompanion(index, "fullName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <Select
                          value={companion.type}
                          onValueChange={(value: "National" | "International") => updateCompanion(index, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="National">National</SelectItem>
                            <SelectItem value="International">International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">ID</label>
                        <Input
                          placeholder="123456"
                          value={companion.id}
                          onChange={(e) => updateCompanion(index, "id", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Input
                          placeholder="123 street, ward, city"
                          value={companion.address}
                          onChange={(e) => updateCompanion(index, "address", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#0e6ba8]">$ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] px-12 py-3 text-lg" disabled={totalPrice === 0}>
                SUBMIT
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
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
