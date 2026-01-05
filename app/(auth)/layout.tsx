/**
 * Auth Route Group Layout
 * Minimal layout for login/signup pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-tertiary)]">
      {children}
    </div>
  )
}
