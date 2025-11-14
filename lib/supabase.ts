"use client";

import { createClient } from "@supabase/supabase-js";

// Simple, direct Supabase client using provided public URL and anon key
export const supabase = createClient(
  "https://mgjwlfyxfxmfappwputi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nandsZnl4ZnhtZmFwcHdwdXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzY0ODcsImV4cCI6MjA3Nzc1MjQ4N30.O_EjyJkqpy85ibFIpB1PuEYYUpXpSCtcAAusbeTchGM",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
