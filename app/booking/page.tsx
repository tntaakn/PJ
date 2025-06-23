"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingFormPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomTypeId = searchParams.get("room")

  const [roomTypeName, setRoomTypeName] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [note, setNote] = useState("")
  const [showSelector, setShowSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [guestTypes, setGuestTypes] = useState<{ guest_type_id: number; guest_type_name: string }[]>([])

  const [form, setForm] = useState({
    full_name: "",
    cccd: "",
    guest_type: "",
    phone_number: "",
    email: "",
    address: ""
  })

  useEffect(() => {
    if (!roomTypeId) return
    fetch(`http://localhost:4000/api/prices/roomType`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((r: any) => r.room_type_id === roomTypeId)
        if (found) setRoomTypeName(found.room_type_name)
      })
  }, [roomTypeId])

  useEffect(() => {
    fetch("http://localhost:4000/api/guests/guestType")
      .then((res) => res.json())
      .then((data) => setGuestTypes(data))
      .catch((err) => console.error("Failed to load guest types:", err))
  }, [])

  const handleSubmit = async () => {
    setIsLoading(true)
    const res = await fetch("http://localhost:4000/api/bookingweb/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_fullname: form.full_name,
        guest_phone: form.phone_number,
        guest_email: form.email,
        guest_address: form.address,
        guest_type_id: Number(form.guest_type) || 1,
        check_in: checkIn,
        check_out: checkOut,
        room_type_id: roomTypeId,
        number_of_rooms: rooms,
        adults,
        children,
        reservation_note: note,
      })
    })

    if (res.ok) {
      router.push("/my-booking")
    } else {
      setIsLoading(false)
      const data = await res.json()
      alert("Failed: " + data.error)
    }
  }

  return (
    <div className="bg-[#e9edf1] min-h-screen">
      <div className="bg-[#0e2a47] text-white py-10">
        <h1 className="text-3xl font-bold text-center">Reservation Form</h1>
      </div>

      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded shadow space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">ID</label>
              <input value={form.cccd} onChange={e => setForm({ ...form, cccd: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Guest Type</label>
              <Select value={form.guest_type} onValueChange={(value) => setForm({ ...form, guest_type: value })}>
                <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2">
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
              <label className="block font-medium mb-1">Phone Number</label>
              <input value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-1">Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded shadow space-y-6 mt-8">
          <div>
            <label className="block font-medium mb-1">Type Room</label>
            <input disabled value={roomTypeName} className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Date From</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Date To</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Rooms & Guests</label>
            <div
              className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer mb-2 bg-white"
              onClick={() => setShowSelector(!showSelector)}
            >
              {adults} Adult(s), {children} Child, {rooms} Room(s)
            </div>

            {showSelector && (
              <div className="border rounded p-4 grid grid-cols-3 gap-6">
                {[['Adult(s)', adults, setAdults], ['Child', children, setChildren], ['Room(s)', rooms, setRooms]].map(([label, value, set]: any) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="font-medium mb-1">{label}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => set(Math.max((value as number) - 1, 0))} className="text-white bg-blue-700 w-6 h-6 rounded-full">-</button>
                      <span className="w-6 text-center">{value}</span>
                      <button onClick={() => set((value as number) + 1)} className="text-white bg-blue-700 w-6 h-6 rounded-full">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" rows={4} placeholder="...." />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800"
          >
            {isLoading ? "Submitting..." : "Submit Reservation"}
          </Button>
        </div>
      </div>
    </div>
  )
}
