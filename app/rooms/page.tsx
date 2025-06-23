"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPin, Phone, Mail, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState, useEffect, Suspense, useMemo, useCallback } from "react"
import Link from "next/link"
import { GuestSelector } from "@/components/guest-selector"
import { ProtectedAction } from "@/components/protected-action"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

// Room data with guest capacity
const roomsData = [
  {
    title: "Deluxe Room",
    price: 349,
    image: "/deluxe.jpg?height=200&width=300",
    beds: "1 Queen Bed",
    size: "32 m²",
    maxGuests: 2,
    amenities: "Balcony",
    remainingRooms: 3,
  },
  {
    title: "Executive Suite",
    price: 499,
    image: "/executive.jpg?height=200&width=300",
    beds: "1 King Bed",
    size: "45 m²",
    maxGuests: 2,
    amenities: "Kitchenette, Balcony",
    remainingRooms: 1,
  },
  {
    title: "Presidential Suite",
    price: 699,
    image: "/President-Suite.jpg?height=200&width=300",
    beds: "1 King Bed",
    size: "65 m²",
    maxGuests: 4,
    amenities: "Kitchenette, Balcony",
    remainingRooms: 2,
  },
  {
    title: "Superior Room",
    price: 299,
    image: "/superior.jpg?height=200&width=300",
    beds: "1 Queen Bed",
    size: "28 m²",
    maxGuests: 2,
    amenities: "",
    remainingRooms: 5,
  },
  {
    title: "Family Suite",
    price: 549,
    image: "/family.jpg?height=400&width=600",
    beds: "2 Queen Beds",
    size: "55 m²",
    maxGuests: 4,
    amenities: "Kitchenette, Balcony",
    remainingRooms: 2,
  },
  {
    title: "Standard Double Room",
    price: 299,
    image: "/standarddouble.jpeg?height=200&width=300",
    beds: "2 Double Beds",
    size: "35 m²",
    maxGuests: 4,
    amenities: "Balcony",
    remainingRooms: 4,
  },
  {
    title: "Family Suite",
    price: 499,
    image: "/family.jpg?height=200&width=300",
    beds: "2 Queen Beds",
    size: "55 m²",
    maxGuests: 4,
    amenities: "Kitchenette",
    remainingRooms: 1,
  },
  {
    title: "Standard Room",
    price: 149,
    image: "/standard.jpg?height=200&width=300",
    beds: "Double Beds",
    size: "28 m²",
    maxGuests: 2,
    amenities: "",
    remainingRooms: 3,
  },
]

function RoomsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guestData, setGuestData] = useState({ adults: 1, children: 0, rooms: 1 })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load search parameters on mount only - use a flag to prevent re-initialization
  useEffect(() => {
    if (!isInitialized) {
      const checkIn = searchParams.get("checkIn")
      const checkOut = searchParams.get("checkOut")
      const adults = searchParams.get("adults")
      const children = searchParams.get("children")
      const rooms = searchParams.get("rooms")

      if (checkIn) setCheckInDate(new Date(checkIn))
      if (checkOut) setCheckOutDate(new Date(checkOut))

      const newGuestData = {
        adults: adults ? Number.parseInt(adults) : 1,
        children: children ? Number.parseInt(children) : 0,
        rooms: rooms ? Number.parseInt(rooms) : 1,
      }
      setGuestData(newGuestData)
      setIsInitialized(true)
    }
  }, [searchParams, isInitialized])

  // Filter rooms based on guest requirements using useMemo
  const filteredRooms = useMemo(() => {
    const { adults, children } = guestData
    const totalGuests = adults + children

    // Children can't stay alone - must have at least 1 adult
    if (children > 0 && adults === 0) {
      return []
    }

    // Filter rooms that can accommodate the guests
    return roomsData.filter((room) => {
      // Room must be available
      if (room.remainingRooms === 0) return false

      // Check if room can accommodate guests
      // For rooms with maxGuests = 2: can accommodate up to 3 people (2 adults + 1 child)
      // For rooms with maxGuests = 4: can accommodate up to 4 people
      if (room.maxGuests === 2) {
        // Can accommodate: 1-2 adults, or 2 adults + 1 child
        return totalGuests <= 2 || (adults === 2 && children === 1)
      } else if (room.maxGuests === 4) {
        // Can accommodate up to 4 people
        return totalGuests <= 4
      }

      return false
    })
  }, [guestData])

  const handleUpdateSearch = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    const params = new URLSearchParams()

    if (checkInDate) {
      params.set("checkIn", format(checkInDate, "yyyy-MM-dd"))
    }
    if (checkOutDate) {
      params.set("checkOut", format(checkOutDate, "yyyy-MM-dd"))
    }

    params.set("adults", guestData.adults.toString())
    params.set("children", guestData.children.toString())
    params.set("rooms", guestData.rooms.toString())

    router.push(`/rooms?${params.toString()}`)
  }, [checkInDate, checkOutDate, guestData, router, isAuthenticated])

  // Create a stable callback for GuestSelector that doesn't cause re-renders
  const handleGuestChange = useCallback((newGuestData: { adults: number; children: number; rooms: number }) => {
    setGuestData(newGuestData)
  }, [])

  const getGuestCapacityText = (maxGuests: number) => {
    if (maxGuests === 2) {
      return "Up to 2 guests (or 2 adults + 1 child)"
    }
    return `Up to ${maxGuests} guests`
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[400px] w-full">
          <Image
            src="/room.png?height=400&width=1200"
            alt="Hotel rooms"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">OUR ROOMS & SUITES</h1>
            <p className="max-w-md text-sm md:text-base">
              Discover our selection of comfortable and luxurious accommodations designed for your perfect stay.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-md shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <BookingDatePicker label="Check-in" value={checkInDate} onChange={setCheckInDate} />
              <BookingDatePicker label="Check-out" value={checkOutDate} onChange={setCheckOutDate} />
              <div>
                <p className="text-xs mb-1">Guests & Rooms</p>
                <GuestSelector onChange={handleGuestChange} defaultValues={guestData} />
              </div>
              <Button onClick={handleUpdateSearch} className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-10">
                Update Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Info */}
      {(guestData.adults > 1 || guestData.children > 0) && (
        <section className="py-4 px-4 bg-blue-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Showing rooms for{" "}
                <strong>
                  {guestData.adults} adult{guestData.adults !== 1 ? "s" : ""}
                </strong>
                {guestData.children > 0 && (
                  <span>
                    ,{" "}
                    <strong>
                      {guestData.children} child{guestData.children !== 1 ? "ren" : ""}
                    </strong>
                  </span>
                )}
                {guestData.rooms > 1 && (
                  <span>
                    ,{" "}
                    <strong>
                      {guestData.rooms} room{guestData.rooms !== 1 ? "s" : ""}
                    </strong>
                  </span>
                )}
              </p>
              {guestData.children > 0 && guestData.adults === 0 && (
                <p className="text-red-600 text-sm mt-1">
                  ⚠️ Children cannot stay alone. At least one adult is required.
                </p>
              )}
              {filteredRooms.length === 0 && guestData.adults > 0 && (
                <p className="text-orange-600 text-sm mt-1">
                  No rooms available for your group size. Consider booking multiple rooms or selecting rooms with higher
                  capacity.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Rooms Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {filteredRooms.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredRooms.map((room, index) => (
                <RoomCard
                  key={`${room.title}-${index}`}
                  title={room.title}
                  price={room.price}
                  image={room.image}
                  beds={room.beds}
                  size={room.size}
                  guests={getGuestCapacityText(room.maxGuests)}
                  amenities={room.amenities}
                  remainingRooms={room.remainingRooms}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">No Available Rooms</h3>
              <p className="text-gray-600 mb-6">
                No rooms match your current search criteria. Please adjust your guest requirements or dates.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  💡 <strong>Tip:</strong> Rooms with "Up to 2 guests" can accommodate 2 adults + 1 child
                </p>
                <p>
                  💡 <strong>Tip:</strong> For larger groups, consider booking multiple rooms
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomsContent />
    </Suspense>
  )
}

function BookingDatePicker({
  label,
  value,
  onChange,
}: { label: string; value?: Date; onChange: (date: Date | undefined) => void }) {
  return (
    <div>
      <p className="text-xs mb-1">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border border-gray-300",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : `Select ${label.toLowerCase()} date`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function RoomCard({
  title,
  price,
  image,
  beds,
  size,
  guests,
  amenities,
  remainingRooms,
}: {
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
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        {remainingRooms !== undefined &&
          (remainingRooms === 0 ? (
            <div className="absolute top-0 right-0 bg-gray-700 text-white px-2 py-1 text-xs font-medium m-2 rounded-md flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Sold out
            </div>
          ) : remainingRooms <= 2 ? (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-medium m-2 rounded-md flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {remainingRooms === 1 ? "Last room!" : `${remainingRooms} rooms left`}
            </div>
          ) : null)}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold">{title}</h3>
          <div className="text-right">
            <span className="font-bold text-lg">${price}</span>
            <span className="text-xs text-gray-500">/night</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Enjoy a spacious and modern room with all the essential amenities for a comfortable stay.
        </p>
        <div className="grid grid-cols-1 gap-2 text-xs mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{beds}</span>
            <span>{size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-600 font-medium">{guests}</span>
            <span>{amenities}</span>
          </div>
        </div>
        <ProtectedAction>
          <Link href={`/rooms/${title.toLowerCase().replace(/\s+/g, "-")}`}>
            <Button className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] text-xs h-8" disabled={remainingRooms === 0}>
              {remainingRooms === 0 ? "Not Available" : "View Detail"}
            </Button>
          </Link>
        </ProtectedAction>
      </CardContent>
    </Card>
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
            <input
              type="email"
              placeholder="Your e-mail"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <ProtectedAction>
              <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-9">Subscribe</Button>
            </ProtectedAction>
          </div>
        </div>
      </div>
    </footer>
  )
}
