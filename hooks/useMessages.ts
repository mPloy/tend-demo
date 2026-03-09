// Tend — Messages hook with realtime subscriptions
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messageThreads as mockThreads } from '../constants/MockData';
import * as messagesService from '../services/messages.service';
import type { MessageThread } from '../types';

interface UseMessagesResult {
  threads: MessageThread[];
  isLoading: boolean;
  error: string | null;
  totalUnread: number;
  refetch: () => void;
}

export function useMessages(): UseMessagesResult {
  const { isDemo, profile } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await messagesService.getThreadsForUser(profile.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform Supabase data to match MessageThread interface
        setThreads(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchThreads();
    }
  }, [isDemo, profile?.id]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (isDemo || !profile?.id) return;

    const subscription = messagesService.subscribeToThreadUpdates(
      profile.id,
      () => fetchThreads() // Refetch on any change
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isDemo, profile?.id]);

  if (isDemo) {
    const totalUnread = mockThreads.reduce((sum, t) => sum + t.unreadCount, 0);
    return {
      threads: mockThreads,
      isLoading: false,
      error: null,
      totalUnread,
      refetch: () => {},
    };
  }

  const totalUnread = threads.reduce((sum: number, t: any) => {
    const myParticipation = t.thread_participants?.find(
      (p: any) => p.user_id === profile?.id
    );
    return sum + (myParticipation?.unread_count || 0);
  }, 0);

  return { threads, isLoading, error, totalUnread, refetch: fetchThreads };
}
