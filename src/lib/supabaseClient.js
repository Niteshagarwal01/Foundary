import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! The backend features will not work until you provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
