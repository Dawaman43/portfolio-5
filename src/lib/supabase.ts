import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_* so the client can run in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local for full functionality."
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export default supabase;
