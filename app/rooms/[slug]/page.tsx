"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, CalendarIcon, MapPin, Phone, Mail, Bed, Users, Maximize, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"
import { GuestSelector } from "@/components/guest-selector"
import { ProtectedAction } from "@/components/protected-action"

// Room data - in a real app, this would come from a database
const roomsData = {
  "deluxe-room": {
    title: "Deluxe Room",
    price: 349,
    images: [
      "/deluxe.jpg?height=400&width=600",
      "/deluxe2.jpg?height=200&width=300",
      "/deluxe3.jpg?height=200&width=300",
    ],
    beds: "1 Queen Bed",
    size: "32 m²",
    guests: "Up to 2 guests",
    amenities: "Balcony",
    description:
      "Spacious room with ocean views, king-size bed and modern amenities. Experience the perfect blend of comfort and luxury in our Deluxe Room. This spacious accommodation offers all the comfort you need for a relaxing stay, including premium bedding, a modern bathroom, and stunning views.",
  },
  "executive-suite": {
    title: "Executive Suite",
    price: 599,
    images: [
      "/executive.jpg?height=400&width=600",
      "/executive2.jpg?height=200&width=300",
      "/executive3.jpg?height=200&width=300",
    ],
    beds: "1 King Bed",
    size: "45 m²",
    guests: "Up to 2 guests",
    amenities: "Balcony, Living Area",
    description:
      "Luxurious suite with separate living area, king-size bed and premium amenities. Perfect for business travelers and those seeking extra space and comfort during their stay.",
  },
  "presidential-suite": {
    title: "Presidential Suite",
    price: 899,
    images: [
      "/President-Suite.jpg?height=400&width=600",
      "/President-Suite2.jpg?height=200&width=300",
      "/President-Suite3.jpg?height=200&width=300",
    ],
    beds: "1 King Bed",
    size: "65 m²",
    guests: "Up to 4 guests",
    amenities: "Balcony, Jacuzzi, Living Area",
    description:
      "Our most luxurious accommodation featuring a spacious living area, premium amenities, and breathtaking views. The ultimate in comfort and elegance.",
  },
  "superior-room": {
    title: "Superior Room",
    price: 299,
    images: [
      "/superior.jpg?height=400&width=600",
      "/superior.jpg?height=200&width=300",
      "/superior.jpg?height=200&width=300",
    ],
    beds: "1 Queen Bed",
    size: "28 m²",
    guests: "Up to 2 guests",
    amenities: "City View",
    description:
      "Comfortable and well-appointed room with modern amenities and city views. Perfect for travelers seeking quality accommodation at great value.",
  },
  "family-suite": {
    title: "Family Suite",
    price: 549,
    images: [
      "/family.jpg?height=400&width=600",
      "/family.jpg?height=200&width=300",
      "/family.jpg?height=200&width=300",
    ],
    beds: "2 Queen Beds",
    size: "55 m²",
    guests: "Up to 4 guests",
    amenities: "Kitchenette, Living Area",
    description:
      "Spacious family accommodation with separate sleeping areas, kitchenette, and living space. Ideal for families traveling with children.",
  },
  "standard-double-room": {
    title: "Standard Double Room",
    price: 349,
    images: [
      "/standarddouble.jpeg?height=400&width=600",
      "/standarddouble2.jpeg?height=200&width=300",
      "/standarddouble3.jpeg?height=200&width=300",
    ],
    beds: "2 Double Beds",
    size: "35 m²",
    guests: "Up to 4 guests",
    amenities: "Garden View",
    description:
      "Comfortable room with two double beds, perfect for friends or family members traveling together. Features modern amenities and garden views.",
  },
}

export default function RoomDetailPage({ params }: { params: { slug: string } }) {
  const room = roomsData[params.slug as keyof typeof roomsData]
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  if (!room) {
    return <div>Room not found</div>
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1e2a4a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Rooms</h1>
        </div>
      </section>

      {/* Room Content */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <Link href="/rooms" className="flex items-center text-[#0e6ba8] mb-6 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all rooms
          </Link>

          {/* Room Title */}
          <h1 className="text-3xl font-bold mb-8">{room.title}</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Images Section */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Main Image */}
                <div className="col-span-2 relative h-80">
                  <Image
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
                {/* Smaller Images */}
                <div className="relative h-40">
                  <Image
                    src={room.images[1] || "/placeholder.svg"}
                    alt={`${room.title} view 2`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="relative h-40">
                  <Image
                    src={room.images[2] || "/placeholder.svg"}
                    alt={`${room.title} view 3`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Room Specs */}
              <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{room.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{room.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{room.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{room.amenities}</span>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 sticky top-4">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">${room.price}</span>
                  <span className="text-gray-500">/night</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkIn && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkOut && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Guests & Rooms</label>
                    <GuestSelector />
                  </div>

                  <ProtectedAction>
                    <Link href={`/booking?room=${params.slug}`}>
                      <Button className="w-full bg-[#0e6ba8] hover:bg-[#0a5a8e]">Book now</Button>
                    </Link>
                  </ProtectedAction>
                </div>
              </div>
            </div>
          </div>

          {/* Room Description */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">ROOMS DESCRIPTION</h2>
            <p className="text-gray-700 leading-relaxed">{room.description}</p>
          </div>

          {/* Room Policy and Amenities */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="font-bold mb-4">Room Policy</h3>
              <ul className="space-y-2 text-sm">
                <li>• Check-in: 2:00 PM</li>
                <li>• Check-out: 12:00 PM</li>
                <li>• No smoking</li>
                <li>• Pets not allowed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Amenities</h3>
              <ul className="space-y-2 text-sm">
                <li>• Air conditioning</li>
                <li>• Free Wi-Fi</li>
                <li>• Soundproofed rooms</li>
                <li>• Room service</li>
              </ul>
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
