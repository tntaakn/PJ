import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1e2a4a] text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact-us</h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">WE ARE HERE FOR YOU</h2>
          <p className="text-gray-700 mb-12 max-w-2xl">
            At Serenity Hotel, we take our customers seriously. Do you have any enquiries, complaints or requests,
            please forward it to our support desk and we will get back to you as soon as possible.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h3 className="font-bold mb-2">123 Hotel Street, City Name, Country</h3>
                <Link href="#" className="flex items-center text-[#0e6ba8] font-medium">
                  View map <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>Phone: +1 (123) 456-7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>Email: info@serenityhotel.com</span>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <Input id="name" placeholder="Name" className="w-full" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="Email Address" className="w-full" />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone
                  </label>
                  <Input id="phone" placeholder="Phone" className="w-full" />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Message" className="w-full min-h-[150px]" />
                </div>
                <Button className="bg-[#0e6ba8] hover:bg-[#0a5a8e] px-8">Submit</Button>
              </form>
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
