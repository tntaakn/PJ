import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Calendar } from "lucide-react"

// Mock booking data - in a real app, this would come from a database
const bookings = [
  {
    id: "12345678",
    roomType: "Deluxe Room",
    roomImage: "/placeholder.svg?height=100&width=150",
    name: "Brakemull",
    mobile: "972345789",
    checkIn: "Friday, June 14, 2025",
    checkOut: "Sunday, June 15, 2025",
    price: "$399 USD",
    status: "ACTIVE",
    confirmationNumber: "12345678",
  },
  {
    id: "23456789",
    roomType: "Deluxe Room",
    roomImage: "/placeholder.svg?height=100&width=150",
    name: "Brakemull",
    mobile: "972345789",
    checkIn: "Friday, June 21, 2025",
    checkOut: "Sunday, June 23, 2025",
    price: "$399 USD",
    status: "COMPLETED",
    confirmationNumber: "23456789",
  },
  {
    id: "34567890",
    roomType: "Deluxe Room",
    roomImage: "/placeholder.svg?height=100&width=150",
    name: "Brakemull",
    mobile: "972345789",
    checkIn: "Friday, July 12, 2025",
    checkOut: "Sunday, July 14, 2025",
    price: "$399 USD",
    status: "CANCELED",
    confirmationNumber: "34567890",
  },
  {
    id: "45678901",
    roomType: "Deluxe Room",
    roomImage: "/placeholder.svg?height=100&width=150",
    name: "Brakemull",
    mobile: "972345789",
    checkIn: "Friday, July 19, 2025",
    checkOut: "Sunday, July 21, 2025",
    price: "$399 USD",
    status: "COMPLETED",
    confirmationNumber: "45678901",
  },
]

export default function MyBookingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1e2a4a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">My Booking</h1>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600"
      case "CANCELED":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="relative h-32 md:h-full">
            <Image src={booking.roomImage || "/placeholder.svg"} alt={booking.roomType} fill className="object-cover" />
          </div>
          <div className="p-2 bg-gray-100 text-center">
            <Link href={`/rooms/${booking.roomType.toLowerCase().replace(/\s+/g, "-")}`}>
              <Button variant="outline" size="sm" className="text-[#0e6ba8] text-xs">
                View
              </Button>
            </Link>
          </div>
          <div className="p-2 text-center text-sm font-medium">{booking.roomType}</div>
        </div>

        <div className="md:col-span-3 p-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div>{booking.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Mobile Number</div>
              <div>{booking.mobile}</div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#0e6ba8]" />
              <span>
                {booking.checkIn} - {booking.checkOut}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div>{booking.price}</div>
              </div>
              <div className={`font-medium ${getStatusColor(booking.status)}`}>{booking.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Confirmation Number</div>
              <div>{booking.confirmationNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
            <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-9">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
