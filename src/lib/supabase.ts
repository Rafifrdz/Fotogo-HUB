import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing env variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Database Table Types (matching Supabase schema) ────────────────────────

export interface DBBooth {
  id: string;
  name: string;
  address: string;
  rating: number;
  price: string;
  image_url: string;
  promo?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface DBMemory {
  id: string;
  user_id: string;
  booth_id: string;
  booth_name: string;
  location: string;
  image_url: string;
  points_earned: number;
  tags: string[];
  created_at: string;
}

export interface DBBooking {
  id: string;
  user_id: string;
  booth_id: string;
  package_name: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface DBPackage {
  id: string;
  booth_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
}

export interface DBUserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  photo_url?: string;
  points: number;
  referral_code: string;
  total_memories: number;
  booths_visited: number;
  badges: string[];
  created_at: string;
}
