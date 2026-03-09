// Tend — Profile service (CRUD for profiles + role-specific tables)
import { supabase } from '../lib/supabase';

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  return supabase.from('profiles').update(updates).eq('id', userId);
}

export async function getElderProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('*, elder_profiles(*)')
    .eq('id', userId)
    .single();
}

export async function getHelperProfile(userId: string) {
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
    .eq('id', userId)
    .single();
}

export async function getFamilyProfile(userId: string) {
  return supabase
    .from('profiles')
    .select('*, family_profiles(*)')
    .eq('id', userId)
    .single();
}

export async function updateElderProfile(userId: string, updates: Record<string, any>) {
  return supabase.from('elder_profiles').update(updates).eq('id', userId);
}

export async function updateHelperProfile(userId: string, updates: Record<string, any>) {
  return supabase.from('helper_profiles').update(updates).eq('id', userId);
}

export async function updateFamilyProfile(userId: string, updates: Record<string, any>) {
  return supabase.from('family_profiles').update(updates).eq('id', userId);
}
