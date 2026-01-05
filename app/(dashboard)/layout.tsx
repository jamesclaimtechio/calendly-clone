/**
 * Dashboard Route Group Layout
 * Protected layout for authenticated users
 * Note: Auth check will be added in Module 2
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)]">
      {/* Sidebar and navigation will be added later */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
