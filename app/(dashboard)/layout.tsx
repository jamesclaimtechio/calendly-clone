/**
 * Dashboard Route Group Layout
 * 
 * Protected layout for authenticated users.
 * Middleware ensures only authenticated users reach this layout.
 * 
 * Features:
 * - Header with navigation, user info, and logout button
 * - Consistent background color
 */

import { auth } from "@/lib/auth"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, CalendarDays, CalendarCheck, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-primary)] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand + Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex-shrink-0">
                <Image
                  src="/calendly-logo.png"
                  alt="Calendly"
                  width={120}
                  height={32}
                  className="h-7 w-auto"
                  priority
                />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/dashboard/events"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <CalendarDays className="h-4 w-4" />
                  Event Types
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Bookings
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>

            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)] hidden sm:block">
                {session?.user?.email}
              </span>
              
              <form action={logout}>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
