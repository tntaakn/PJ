import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { AuthProvider } from "@/lib/auth-context"
import { HeaderContent } from "@/components/header-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Serenity Hotel",
  description: "Experience luxury and comfort at our premier hotel destination.",
    generator: 'a.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="bg-white border-b">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-24">
              <Link href="/" className="flex items-center">
              {/* Logo */}
                <div className="relative w-20 h-20 mr-2">
                  <div className="absolute inset-0 bg-[#14274a] rounded-br-3xl rounded-tl-3xl"></div>
                  <div className="absolute inset-[3px] bg-white rounded-br-3xl rounded-tl-3xl flex items-center justify-center">
                    <div className="text-[#14274a] font-serif text-xs leading-tight text-center font-semibold" >
                      <div>SERENITY</div>
                      <div>HOTEL</div>
                    </div>
                  </div>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/rooms">Rooms</NavLink>
                <NavLink href="/contact-us">Contact-us</NavLink>
              </nav>

              <HeaderContent />
            </div>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-700 hover:text-[#0e6ba8] transition-colors">
      {children}
    </Link>
  )
}
