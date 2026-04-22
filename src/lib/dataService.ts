/**
 * FotoGo Data Service
 * All Supabase queries are centralized here.
 * Falls back to mock data if Supabase is unavailable (env not set, etc.)
 */

import { supabase, DBBooth, DBMemory, DBBooking, DBPackage, DBUserProfile } from './supabase';
import { Booth, PhotoSession, Reward } from '../types';
import { MOCK_BOOTHS, MOCK_SESSIONS, MOCK_USER, MOCK_REWARDS } from '../mockData';

// ─── Booths ──────────────────────────────────────────────────────────────────

export async function getBooths(): Promise<Booth[]> {
  try {
    const { data, error } = await supabase
      .from('booths')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return MOCK_BOOTHS;

    return (data as DBBooth[]).map((b) => ({
      id: b.id,
      name: b.name,
      rating: b.rating,
      price: b.price,
      imageUrl: b.image_url,
      address: b.address,
      promo: b.promo,
      distance: b.distance,
      latitude: b.latitude,
      longitude: b.longitude,
    }));
  } catch (e) {
    console.warn('[FotoGo] getBooths() fell back to mock data:', e);
    return MOCK_BOOTHS;
  }
}

export async function getBoothById(id: string): Promise<Booth | null> {
  try {
    const { data, error } = await supabase
      .from('booths')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const b = data as DBBooth;
    return {
      id: b.id,
      name: b.name,
      rating: b.rating,
      price: b.price,
      imageUrl: b.image_url,
      address: b.address,
      promo: b.promo,
      distance: b.distance,
      latitude: b.latitude,
      longitude: b.longitude,
    };
  } catch (e) {
    console.warn('[FotoGo] getBoothById() fell back to mock data:', e);
    return MOCK_BOOTHS.find((b) => b.id === id) ?? null;
  }
}

// ─── Packages ────────────────────────────────────────────────────────────────

export async function getPackagesByBooth(boothId: string): Promise<DBPackage[]> {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('booth_id', boothId)
      .order('price', { ascending: true });

    if (error) throw error;
    return (data as DBPackage[]) ?? [];
  } catch (e) {
    console.warn('[FotoGo] getPackagesByBooth() failed:', e);
    return [];
  }
}

// ─── Memories ────────────────────────────────────────────────────────────────

export async function getMemoriesByUser(userId: string): Promise<PhotoSession[]> {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return MOCK_SESSIONS;

    return (data as DBMemory[]).map((m) => ({
      id: m.id,
      boothName: m.booth_name,
      location: m.location,
      date: m.created_at,
      imageUrl: m.image_url,
      pointsEarned: m.points_earned,
      tags: m.tags ?? [],
    }));
  } catch (e) {
    console.warn('[FotoGo] getMemoriesByUser() fell back to mock data:', e);
    return MOCK_SESSIONS;
  }
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function createBooking(booking: Omit<DBBooking, 'id' | 'created_at'>): Promise<DBBooking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data as DBBooking;
  } catch (e) {
    console.error('[FotoGo] createBooking() failed:', e);
    return null;
  }
}

export async function getBookingsByUser(userId: string): Promise<DBBooking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DBBooking[]) ?? [];
  } catch (e) {
    console.warn('[FotoGo] getBookingsByUser() failed:', e);
    return [];
  }
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<DBUserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as DBUserProfile;
  } catch (e) {
    // Return mock-shaped profile on fallback
    console.warn('[FotoGo] getUserProfile() fell back to mock data:', e);
    return {
      id: userId,
      user_id: userId,
      display_name: MOCK_USER.name,
      email: MOCK_USER.email,
      photo_url: MOCK_USER.photoUrl,
      points: MOCK_USER.points,
      referral_code: MOCK_USER.referralCode,
      total_memories: MOCK_USER.totalMemories,
      booths_visited: MOCK_USER.boothsVisited,
      badges: MOCK_USER.badges,
      created_at: new Date().toISOString(),
    };
  }
}

export async function upsertUserProfile(profile: Partial<DBUserProfile> & { user_id: string }): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'user_id' });

    if (error) throw error;
  } catch (e) {
    console.error('[FotoGo] upsertUserProfile() failed:', e);
  }
}

// ─── Rewards (static for now, can be moved to Supabase later) ───────────────

export function getRewards(): Reward[] {
  return MOCK_REWARDS;
}
