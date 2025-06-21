"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MapPin, Phone, Mail, Wifi, Car, Utensils, Dumbbell, GlassWater, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState, useCallback } from "react"
import { GuestSelector } from "@/components/guest-selector"
import { ProtectedAction } from "@/components/protected-action"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guestData, setGuestData] = useState({ adults: 1, children: 0, rooms: 1 })
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleCheckAvailability = useCallback(() => {
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

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[500px] w-full">
          <Image
            src="/placeholder.svg?height=500&width=1200"
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
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-md shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <BookingDatePicker label="Check-in" value={checkInDate} onChange={setCheckInDate} />
              <BookingDatePicker label="Check-out" value={checkOutDate} onChange={setCheckOutDate} />
              <div>
                <p className="text-xs mb-1">Guests & Rooms</p>
                <GuestSelector onChange={setGuestData} />
              </div>
              <Button onClick={handleCheckAvailability} className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-10">
                Check Availability
              </Button>
            </div>
          </div>
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
                src="/placeholder.svg?height=320&width=480"
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
              title="Deluxe Room"
              price={399}
              image="/placeholder.svg?height=200&width=300"
              beds="1 Queen Bed"
              size="32 m²"
              guests="Up to 2 guests"
              amenities="Balcony"
              remainingRooms={3}
            />
            <RoomCard
              title="Executive Suite"
              price={599}
              image="/placeholder.svg?height=200&width=300"
              beds="1 King Bed"
              size="45 m²"
              guests="Up to 2 guests"
              amenities="Kitchenette, Balcony"
              remainingRooms={1}
            />
            <RoomCard
              title="Presidential Suite"
              price={899}
              image="/placeholder.svg?height=200&width=300"
              beds="1 King Bed"
              size="65 m²"
              guests="Up to 4 guests"
              amenities="Kitchenette, Balcony"
              remainingRooms={2}
            />
          </div>

          <div className="text-center mt-8">
            <Link href="/rooms">
              <Button variant="outline" className="border-[#0e6ba8] text-[#0e6ba8] hover:bg-[#0e6ba8] hover:text-white">
                View All Rooms
              </Button>
            </Link>
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
            <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e]">BOOK NOW</Button>
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
        <Image src="/placeholder.svg?height=200&width=300" alt={title} fill className="object-cover" />
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
        <Link href={`/rooms/${title.toLowerCase().replace(/\s+/g, "-")}`}>
          <Button className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e] text-xs h-8">View Detail</Button>
        </Link>
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
