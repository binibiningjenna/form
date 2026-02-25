/**
 * Supabase Client Configuration
 * ─────────────────────────────
 * This file creates and exports a single Supabase client instance
 * that can be imported anywhere in the app.
 *
 * It uses the PUBLIC anon key (safe to expose in the browser).
 * Row Level Security (RLS) on your Supabase tables controls
 * what data this key can access.
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data, error } = await supabase.from("contacts").select("*");
 */

import { createClient } from "@supabase/supabase-js";

// Read credentials from environment variables (.env.local)
// These are prefixed with NEXT_PUBLIC_ so Next.js exposes them to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safety check — catch missing env vars early in development
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "are set in your .env.local file."
    );
}

// Create and export the Supabase client
// This client uses the public anon key (NOT the service_role key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
