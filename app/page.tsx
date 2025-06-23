"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MapPin, Phone, Mail, Wifi, Car, Utensils, Dumbbell, GlassWater, AlertCircle, User } from "lucide-react" // Import User icon
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState, useCallback } from "react"
import { GuestSelector } from "@/components/guest-selector"
import { ProtectedAction } from "@/components/protected-action"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

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

export default function Home() {
  // Đã sửa lỗi: checkin và checkout nên là kiểu Date hoặc undefined
  const [checkin, setCheckin] = useState<Date | undefined>(undefined)
  const [checkout, setCheckout] = useState<Date | undefined>(undefined)
  const [guestData, setGuestData] = useState({ adults: 1, children: 0, rooms: 1 })
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleCheckAvailability = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    const params = new URLSearchParams()

    if (checkin) {
      params.set("checkIn", format(checkin, "yyyy-MM-dd"))
    }
    if (checkout) {
      params.set("checkOut", format(checkout, "yyyy-MM-dd"))
    }

    params.set("adults", guestData.adults.toString())
    params.set("children", guestData.children.toString())
    params.set("rooms", guestData.rooms.toString())

    router.push(`/rooms?${params.toString()}`)
  }, [checkin, checkout, guestData, router, isAuthenticated])

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[500px] w-full">
          <Image
            src="/hero-hotel.png?height=500&width=1200"
            alt="Luxury hotel room"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-light mb-2">WELCOME TO</h1>
            <h2 className="text-5xl md:text-6xl font-serif mb-4">SERENITY</h2>
            <h3 className="text-3xl md:text-4xl font-serif mb-8">HOTEL</h3>
            <p className="max-w-md text-sm md:text-base">
              Experience the most stylish and comfortable stay with breathtaking views and world-class amenities.
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white -mt-20 z-10 relative rounded-lg shadow-lg max-w-5xl mx-auto p-6 flex flex-wrap justify-between items-end gap-4">
          {/* Sử dụng BookingDatePicker cho Check-in */}
          <BookingDatePicker label="Check-in" value={checkin} onChange={setCheckin} />
          {/* Sử dụng BookingDatePicker cho Check-out */}
          <BookingDatePicker label="Check-out" value={checkout} onChange={setCheckout} />
          {/* Tích hợp GuestSelector */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Guests & Rooms</label>
            <GuestSelector onChange={setGuestData} defaultValues={guestData} />
          </div>
          <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-10" onClick={handleCheckAvailability}>
            Check Availability
          </Button>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">WELCOME TO SERENITY HOTEL</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 mb-4">
                Experience luxury and comfort in the heart of destination. Nestled in a breathtaking location, Serenity
                Hotel offers the perfect blend of elegance, comfort, and exceptional service.
              </p>
              <p className="text-gray-700 mb-4">
                Our dedicated staff is committed to making your stay nothing short of extraordinary. From our elegantly
                appointed rooms and world-class amenities, to our fine dining and spa services.
              </p>
            </div>
            <div className="relative h-64 md:h-80">
              <Image
                src="/acommodate.jpg?height=320&width=480"
                alt="Hotel interior"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">OUR ACCOMMODATIONS</h2>
          <p className="text-center text-gray-600 mb-8">
            Choose from our selection of rooms and suites, each designed with a perfect blend of comfort and stunning
            views.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <RoomCard
              room_type_id = "RT01"
              title="Deluxe Room"
              price={120.00}
              image="/deluxe1.jpg?height=200&width=300"
              beds="2 Queen Bed"
              size="32 m²"
              guests="3 guests"
              amenities="Balcony"
              remainingRooms={3}
            />
            <RoomCard
              room_type_id = "RT03"
              title="Suite"
              price={200.00}
              image="/deluxe.jpg?height=200&width=300"
              beds="1 King bed, 1 Sofa bed"
              size="80 m²"
              guests=" 4 guests"
              amenities="Balcony with sea view"
              remainingRooms={1}
            />
            <RoomCard
              room_type_id = "RT06"
              title="Executive Room"
              price={180.00}
              image="/ctiyview.jpg?height=200&width=300"
              beds="1 King Bed"
              size="60 m²"
              guests="2 guests"
              amenities="Balcony with city view"
              remainingRooms={2}
            />
          </div>

          <div className="text-center mt-8">
            <ProtectedAction>
              <Link href="/rooms">
                <Button variant="outline" className="border-[#0e6ba8] text-[#0e6ba8] hover:bg-[#0e6ba8] hover:text-white">
                  View All Rooms
                </Button>
              </Link>
            </ProtectedAction>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">HOTEL AMENITIES</h2>
          <p className="text-center text-gray-600 mb-12">
            Discover our range of services and facilities designed to make your stay comfortable and enjoyable.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <AmenityCard
              icon={<GlassWater className="h-8 w-8 text-[#0e6ba8]" />}
              title="Swimming Pool"
              description="Open daily from 7am to 10pm"
            />
            <AmenityCard
              icon={<Dumbbell className="h-8 w-8 text-[#0e6ba8]" />}
              title="Fitness Center"
              description="24/7 access with room key"
            />
            <AmenityCard
              icon={<Utensils className="h-8 w-8 text-[#0e6ba8]" />}
              title="Restaurant"
              description="Serving breakfast, lunch and dinner"
            />
            <AmenityCard
              icon={<Wifi className="h-8 w-8 text-[#0e6ba8]" />}
              title="Free Wi-Fi"
              description="High-speed internet throughout"
            />
            <AmenityCard
              icon={<Car className="h-8 w-8 text-[#0e6ba8]" />}
              title="Valet Parking"
              description="Available 24/7 for all guests"
            />
            <AmenityCard
              icon={<GlassWater className="h-8 w-8 text-[#0e6ba8]" />}
              title="Cocktail Bar"
              description="Elegant venue with signature drinks"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">WHAT OUR GUESTS SAY</h2>
          <p className="text-center text-gray-600 mb-12">
            Discover what our guests have experienced at Serenity Hotel.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              rating={5}
              text="The rooms were immaculate and the staff went above and beyond to make our stay memorable. Will definitely return!"
              author="Raymond"
              location="New York"
            />
            <TestimonialCard
              rating={5}
              text="Absolutely stunning views from our suite. The amenities were top-notch and the restaurant served delicious food."
              author="Maria"
              location="London"
            />
            <TestimonialCard
              rating={5}
              text="Perfect location for both business and leisure. The conference facilities were excellent and the spa was just what I needed."
              author="Sarah Johnson"
              location="Toronto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">READY TO EXPERIENCE LUXURY</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your stay directly on our website today where you receive direct-to-hotel benefits.
          </p>
          <ProtectedAction>
            <Link href={`/booking?room=${"RT01"}`} className="inline-block">
              <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e]">BOOK NOW</Button>
            </Link>
          </ProtectedAction>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
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
  room_type_id: number | string
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
        {remainingRooms !== undefined && remainingRooms <= 3 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-medium m-2 rounded-md flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {remainingRooms === 1 ? "Last room!" : `${remainingRooms} rooms left`}
          </div>
        )}
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
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">{beds}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span>{guests}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{size}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span>{amenities}</span>
          </div>
        </div>
        <ProtectedAction>
          <Link href={`/booking?room=${room_type_id}`}>
              <Button className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] text-xs h-8 mt-2" disabled={remainingRooms === 0}>
                {remainingRooms === 0 ? "Not Available" : "Book Now"}
              </Button>
          </Link>
        </ProtectedAction>
      </CardContent>
    </Card>
  )
}

function AmenityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-blue-50 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

function TestimonialCard({
  rating,
  text,
  author,
  location,
}: { rating: number; text: string; author: string; location: string }) {
  return (
    <Card className="p-6">
      <div className="flex mb-2">
        {[...Array(rating)].map((_, i) => (
          <div key={i} className="text-blue-500 text-lg">
            ★
          </div>
        ))}
      </div>
      <p className="text-sm mb-4">{text}</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">{author.charAt(0)}</div>
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>
    </Card>
  )
}

function Footer() {
  return (
    <footer className="border-t py-8 px-4">
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
            <ProtectedAction>
              <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-9">Subscribe</Button>
            </ProtectedAction>
          </div>
        </div>
      </div>
    </footer>
  )
}