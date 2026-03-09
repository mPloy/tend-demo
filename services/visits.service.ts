// Tend — Visit notes & photos service
import { supabase } from '../lib/supabase';
import type { VisitMood, ServiceType } from '../types';

export async function getVisitNotesForElder(elderId: string) {
  return supabase
    .from('visit_notes')
    .select(`
      *,
      helper:profiles!visit_notes_helper_id_fkey(first_name, last_name, avatar_url),
      visit_note_tasks(*),
      visit_photos(*)
    `)
    .eq('elder_id', elderId)
    .order('date', { ascending: false });
}

export async function getVisitNotesForHelper(helperId: string) {
  return supabase
    .from('visit_notes')
    .select(`
      *,
      elder:profiles!visit_notes_elder_id_fkey(first_name, last_name),
      visit_note_tasks(*),
      visit_photos(*)
    `)
    .eq('helper_id', helperId)
    .order('date', { ascending: false });
}

export async function createVisitNote(note: {
  booking_id?: string;
  helper_id: string;
  elder_id: string;
  date: string;
  service: ServiceType;
  summary: string;
  mood: VisitMood;
  duration: number;
}) {
  return supabase.from('visit_notes').insert(note).select().single();
}

export async function addVisitNoteTasks(
  visitNoteId: string,
  tasks: { label: string; completed: boolean }[]
) {
  const rows = tasks.map((task, idx) => ({
    visit_note_id: visitNoteId,
    label: task.label,
    completed: task.completed,
    sort_order: idx,
  }));
  return supabase.from('visit_note_tasks').insert(rows);
}

export async function uploadVisitPhoto(
  visitNoteId: string,
  filePath: string,
  caption?: string,
  consentGiven: boolean = false
) {
  return supabase.from('visit_photos').insert({
    visit_note_id: visitNoteId,
    storage_path: filePath,
    caption,
    consent_given: consentGiven,
  });
}
