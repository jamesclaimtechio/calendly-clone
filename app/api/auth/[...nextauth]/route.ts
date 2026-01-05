/**
 * Auth.js API Route Handler
 * 
 * Handles all /api/auth/* routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/providers
 * - /api/auth/callback/*
 * etc.
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
