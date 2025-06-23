// page.tsx
"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertCircle, User } from "lucide-react"
import Link from "next/link"
import { ProtectedAction } from "@/components/protected-action"

interface RoomType {
  room_type_id: number
  room_type_name: string
  room_size: string
  bed: string
  note: string
  max_guests: number
  price_room: number
}

interface Room {
  room_id: number
  room_type_id: number
  room_floor: number
  is_booked_today: number // 0 hoặc 1
}

export default function AvailableRoomsPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [roomCount, setRoomCount] = useState(1)
  const [showGuestSelector, setShowGuestSelector] = useState(false)
  const [showFiltered, setShowFiltered] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/api/prices/roomType").then((res) => res.json()),
      fetch("http://localhost:4000/api/room").then((res) => res.json()),
    ]).then(([roomTypeData, roomData]) => {
      setRoomTypes(roomTypeData)
      setRooms(roomData)
    })
  }, [])

  const guestValue = adults + children * 0.5

  const roomTypeWithAvailability = useMemo(() => {
    const filtered = roomTypes.map((type) => {
      const remainingRooms = rooms.filter(
        (room) => room.room_type_id === type.room_type_id && room.is_booked_today === 0
      ).length
      const fitsGuests = guestValue <= type.max_guests
      return {
        ...type,
        remainingRooms,
        fitsGuests,
      }
    })
    return showFiltered
      ? filtered.filter((t) => t.remainingRooms >= roomCount && t.fitsGuests)
      : filtered
  }, [roomTypes, rooms, guestValue, roomCount, showFiltered])

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-[400px] bg-cover bg-center text-white flex items-center justify-center" style={{ backgroundImage: "url('/hero-hotel.png')" }}>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-wide">Our Rooms & Suites</h1>
          <p className="text-sm">Discover our selection of comfortable and luxurious accommodations designed for your perfect stay</p>
        </div>
      </div>

      <div className="bg-white -mt-20 z-10 relative rounded-lg shadow-lg max-w-5xl mx-auto p-6 flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Check-in</label>
          <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Check-out</label>
          <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div className="relative flex flex-col">
          <label className="text-sm font-semibold">Guests & Rooms</label>
          <div onClick={() => setShowGuestSelector(!showGuestSelector)} className="flex items-center border rounded px-2 py-1 cursor-pointer">
            <User className="h-4 w-4 mr-1" />
            <span>{adults} Adult(s), {children} Child, {roomCount} Room(s)</span>
          </div>
          {showGuestSelector && (
            <div className="absolute top-16 bg-white border rounded shadow-md p-4 z-20 w-64">
              {[['Adult(s)', adults, setAdults], ['Child', children, setChildren], ['Room(s)', roomCount, setRoomCount]].map(([label, value, set]: any) => (
                <div key={label} className="flex justify-between items-center mb-2">
                  <span>{label}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => set(Math.max((value as number) - 1, 0))}>-</Button>
                    <span className="w-6 text-center">{value}</span>
                    <Button variant="outline" size="icon" onClick={() => set((value as number) + 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 w-full md:w-auto" onClick={() => setShowFiltered(true)}>Check Availability</Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {roomTypeWithAvailability.map((room) => (
            <RoomCard
              key={room.room_type_id}
              room_type_id={room.room_type_id} // thêm dòng này
              title={room.room_type_name}
              price={room.price_room}
              image="/placeholder.svg?height=200&width=300"
              beds={room.bed}
              size={room.room_size}
              guests={`Up to ${room.max_guests} guests`}
              amenities={room.note}
              remainingRooms={room.remainingRooms}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

function RoomCard({
  room_type_id,
  title,
  price,
  image,
  beds,
  size,
  guests,
  amenities,
  remainingRooms,
}: {
  room_type_id: number
  title: string
  price: number
  image: string
  beds: string
  size: string
  guests: string
  amenities: string
  remainingRooms?: number
}) {

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        {remainingRooms !== undefined && remainingRooms === 0 && (
          <div className="absolute top-0 right-0 bg-gray-700 text-white px-2 py-1 text-xs font-medium m-2 rounded-md flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> Sold out
          </div>
        )}
        {remainingRooms !== undefined && remainingRooms > 0 && remainingRooms <= 3 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-medium m-2 rounded-md flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {remainingRooms} rooms left
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="text-right">
            <span className="font-bold text-lg">${price}</span>
            <span className="text-xs text-gray-500"> / night</span>
          </div>
        </div>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>{size} m²</li>
            <li>{beds}</li>
            <li>{guests}</li>
          </ul>

        {amenities && <p className="text-xs text-gray-500 italic">{amenities}</p>}

          <ProtectedAction>
            <Link href={`/booking?room=${room_type_id}`}>
            <Button className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] text-xs h-8 mt-2" disabled={remainingRooms === 0}>
              {remainingRooms === 0 ? "Not Available" : "Book Now"}
            </Button>
          </Link>
        </ProtectedAction>
      </div>
    </div>
  )
}
