// Tend — Booking operations service
import { supabase } from '../lib/supabase';
import type { BookingStatus, ServiceType } from '../types';

export async function getBookingsForUser(userId: string, role: 'elder' | 'helper') {
  const column = role === 'elder' ? 'elder_id' : 'helper_id';
  return supabase
    .from('bookings')
    .select(`
      *,
      elder:profiles!bookings_elder_id_fkey(first_name, last_name, avatar_url),
      helper:profiles!bookings_helper_id_fkey(first_name, last_name, avatar_url)
    `)
    .eq(column, userId)
    .order('date', { ascending: true });
}

export async function getBookingsForElder(elderId: string) {
  return supabase
    .from('bookings')
    .select(`
      *,
      helper:profiles!bookings_helper_id_fkey(first_name, last_name, avatar_url)
    `)
    .eq('elder_id', elderId)
    .order('date', { ascending: true });
}

export async function getUpcomingBookings(userId: string, role: 'elder' | 'helper' | 'family', linkedElderId?: string) {
  const today = new Date().toISOString().split('T')[0];
  let query = supabase
    .from('bookings')
    .select(`
      *,
      elder:profiles!bookings_elder_id_fkey(first_name, last_name),
      helper:profiles!bookings_helper_id_fkey(first_name, last_name)
    `)
    .gte('date', today)
    .in('status', ['pending', 'confirmed']);

  if (role === 'elder') {
    query = query.eq('elder_id', userId);
  } else if (role === 'helper') {
    query = query.eq('helper_id', userId);
  } else if (role === 'family' && linkedElderId) {
    query = query.eq('elder_id', linkedElderId);
  }

  return query.order('date', { ascending: true }).limit(10);
}

export async function createBooking(booking: {
  elder_id: string;
  helper_id: string;
  service: ServiceType;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_cost: number;
  notes?: string;
}) {
  return supabase.from('bookings').insert(booking).select().single();
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return supabase.from('bookings').update({ status }).eq('id', bookingId);
}

export async function rateBooking(
  bookingId: string,
  raterRole: 'elder' | 'helper',
  rating: number
) {
  const column = raterRole === 'elder' ? 'elder_rating' : 'helper_rating';
  return supabase.from('bookings').update({ [column]: rating }).eq('id', bookingId);
}
