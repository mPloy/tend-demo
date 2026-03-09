// Tend — Family alerts service
import { supabase } from '../lib/supabase';

export async function getAlertsForFamily(familyId: string) {
  return supabase
    .from('family_alerts')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
}

export async function markAlertRead(alertId: string) {
  return supabase
    .from('family_alerts')
    .update({ read: true })
    .eq('id', alertId);
}

export async function getUnreadAlertCount(familyId: string) {
  const { count, error } = await supabase
    .from('family_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('read', false);
  return { count: count || 0, error };
}
