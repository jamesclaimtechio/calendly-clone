/**
 * Auth Helper Exports
 * 
 * Re-exports auth functions for convenient imports throughout the app.
 * 
 * Usage:
 * import { auth, signIn, signOut } from "@/lib/auth-helpers"
 * 
 * - auth() - Get current session (use in Server Components/Actions)
 * - signIn() - Sign in user (use in Server Actions)
 * - signOut() - Sign out user (use in Server Actions)
 */

export { auth, signIn, signOut } from "@/lib/auth"
