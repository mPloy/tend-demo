// Tend — Helper search & listing service
import { supabase } from '../lib/supabase';
import type { ServiceType } from '../types';

interface HelperSearchFilters {
  service?: ServiceType;
  postalCodePrefix?: string; // First 3 chars for area matching
  minRating?: number;
  verificationLevel?: 'basic' | 'enhanced' | 'premium';
  hasCar?: boolean;
}

export async function searchHelpers(filters: HelperSearchFilters = {}) {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      helper_profiles!inner(*),
      helper_services(*),
      verification_records(*),
      quality_scores(*),
      transport_safety(*)
    `)
    .eq('role', 'helper');

  if (filters.minRating) {
    query = query.gte('helper_profiles.rating', filters.minRating);
  }

  if (filters.verificationLevel) {
    query = query.eq('helper_profiles.verification_level', filters.verificationLevel);
  }

  if (filters.hasCar !== undefined) {
    query = query.eq('helper_profiles.has_car', filters.hasCar);
  }

  if (filters.postalCodePrefix) {
    query = query.ilike('postal_code', `${filters.postalCodePrefix}%`);
  }

  return query.order('helper_profiles(rating)', { ascending: false });
}

export async function getHelperById(helperId: string) {
  return supabase
    .from('profiles')
    .select(`
      *,
      helper_profiles(*),
      helper_services(*),
      verification_records(*),
      quality_scores(*),
      transport_safety(*)
    `)
    .eq('id', helperId)
    .single();
}

export async function getHelperReviews(helperId: string) {
  return supabase
    .from('reviews')
    .select('*, from_profile:profiles!reviews_from_user_id_fkey(first_name, last_name, role)')
    .eq('to_user_id', helperId)
    .order('created_at', { ascending: false });
}
