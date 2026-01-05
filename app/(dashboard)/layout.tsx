/**
 * Dashboard Route Group Layout
 * 
 * Protected layout for authenticated users.
 * Middleware ensures only authenticated users reach this layout.
 * 
 * Features:
 * - Header with user info and logout button
 * - Consistent background color
 */

import { auth } from "@/lib/auth"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar } from "lucide-react"
import Link from "next/link"

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
            {/* Logo/Brand */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[var(--color-primary)]" />
              <span className="font-semibold text-[var(--color-text-primary)]">
                Calendly
              </span>
            </Link>

            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
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
