/**
 * Settings Landing Page
 * 
 * Redirects to availability settings by default.
 */

import { redirect } from "next/navigation"

export default function SettingsPage() {
  redirect("/dashboard/settings/availability")
}
