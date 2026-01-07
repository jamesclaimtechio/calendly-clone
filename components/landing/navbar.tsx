"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Individuals", href: "#" },
  { label: "Teams", href: "#" },
  { label: "Enterprise", href: "#" },
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/calendly-logo.png"
            alt="Calendly"
            width={140}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#476482] transition-colors hover:text-[#03233F]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-[#03233F] hover:text-primary sm:block"
          >
            Log In
          </Link>
          <Button asChild size="lg">
            <Link href="/signup">Get started</Link>
          </Button>

          {/* Mobile Menu Icon */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#476482] hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </header>
  )
}
