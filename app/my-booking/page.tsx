"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Reservation {
  reservation_id: number;
  guest_fullname: string;
  guest_phone: string;
  guest_email: string;
  guest_address: string | null;
  guest_type_id: number | null;
  check_in: string;
  check_out: string;
  room_type_id: number;
  number_of_rooms: number;
  adults: number;
  children: number;
  reservation_note: string | null;
  recommended_rooms: string | null;
  status: string;
  guest_id_card?: string | null;
}

interface BookingCardProps {
  id: number | string;
  roomType: string;
  roomImage: string;
  name: string;
  mobile: string;
  checkIn: string;
  checkOut: string;
  price: string;
  status: string;
  confirmationNumber: number | string;
}

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<BookingCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Reservation[]>(
          "http://localhost:4000/api/bookingweb/mybookings",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formattedBookings: BookingCardProps[] = response.data.map((reservation) => ({
          id: reservation.reservation_id,
          roomType: `Room Type ${reservation.room_type_id}`,
          roomImage: "/placeholder.svg?height=100&width=150",
          name: reservation.guest_fullname,
          mobile: reservation.guest_phone,
          checkIn: new Date(reservation.check_in).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          checkOut: new Date(reservation.check_out).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          price: "$0 USD",
          status: reservation.status || "Unknown",
          confirmationNumber: reservation.reservation_id,
        }));

        setBookings(formattedBookings);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading bookings...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <section className="bg-[#1e2a4a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">My Booking</h1>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <p className="text-center text-gray-600">No bookings found.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function BookingCard({ booking }: { booking: BookingCardProps }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "Declined":
      case "Canceled":
        return "text-red-600";
      case "Confirmed":
      case "Pending":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <div className="relative h-32 md:h-full">
            <Image
              src={booking.roomImage || "/placeholder.svg"}
              alt={booking.roomType}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-2 bg-gray-100 text-center">
            <Link
              href={`/rooms/${booking.roomType.toLowerCase().replace(/\s+/g, "-")}`}
            >
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
              <div className={`font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Confirmation Number</div>
              <div>{booking.confirmationNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">Serenity Hotel</h3>
          <p className="text-sm text-gray-600">
            Experience luxury and comfort at our premier hotel destination.
          </p>
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
          <p className="text-sm text-gray-600 mb-2">
            Subscribe to our newsletter for special deals and updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your e-mail"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] h-9">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
