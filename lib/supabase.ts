import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://uqgclgiqjbklrfxeuvnm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZ2NsZ2lxamJrbHJmeGV1dm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzE4MjcsImV4cCI6MjA5OTk0NzgyN30.vCtk-DQoqmeJZVP3h-CmyYLv5u5AQnrhJG4HSuEEbxM';

export const supabaseUrl = 
  (process.env.NEXT_PUBLIC_SUPABASE_URL && 
   !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project') && 
   !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project'))
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : DEFAULT_SUPABASE_URL;

export const supabaseAnonKey = 
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
   !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder-anon-key') && 
   !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase-anon-key'))
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder-project')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

