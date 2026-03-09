// Tend — Messaging service with Supabase Realtime
import { supabase } from '../lib/supabase';

export async function getThreadsForUser(userId: string) {
  // Get all threads where the user is a participant
  const { data: participations, error: pError } = await supabase
    .from('thread_participants')
    .select('thread_id, unread_count')
    .eq('user_id', userId);

  if (pError || !participations?.length) {
    return { data: [], error: pError };
  }

  const threadIds = participations.map((p) => p.thread_id);

  // Get thread details with all participants
  const { data: threads, error: tError } = await supabase
    .from('message_threads')
    .select(`
      *,
      thread_participants(
        user_id,
        unread_count,
        profiles:profiles(first_name, last_name, avatar_url)
      )
    `)
    .in('id', threadIds)
    .order('last_message_at', { ascending: false });

  return { data: threads || [], error: tError };
}

export async function getMessages(threadId: string) {
  return supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
}

export async function sendMessage(threadId: string, senderId: string, text: string) {
  // Insert message
  const { data: message, error: mError } = await supabase
    .from('messages')
    .insert({ thread_id: threadId, sender_id: senderId, text })
    .select()
    .single();

  if (mError) return { data: null, error: mError };

  // Update thread's last message
  await supabase.from('message_threads').update({
    last_message: text,
    last_message_at: new Date().toISOString(),
  }).eq('id', threadId);

  // Increment unread count for other participants
  // (This is done server-side; for MVP, we handle it client-side)

  return { data: message, error: null };
}

export async function markThreadRead(threadId: string, userId: string) {
  return supabase
    .from('thread_participants')
    .update({ unread_count: 0 })
    .eq('thread_id', threadId)
    .eq('user_id', userId);
}

export function subscribeToMessages(
  threadId: string,
  callback: (message: any) => void
) {
  return supabase
    .channel(`messages:${threadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

export function subscribeToThreadUpdates(
  userId: string,
  callback: (update: any) => void
) {
  return supabase
    .channel(`thread_updates:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'thread_participants',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();
}
