// Tend — Care bundles service
import { supabase } from '../lib/supabase';

export async function getActiveBundles() {
  return supabase
    .from('care_bundles')
    .select(`
      *,
      care_bundle_services(*)
    `)
    .eq('is_active', true)
    .order('popular', { ascending: false });
}

export async function getBundleById(bundleId: string) {
  return supabase
    .from('care_bundles')
    .select(`
      *,
      care_bundle_services(*)
    `)
    .eq('id', bundleId)
    .single();
}
