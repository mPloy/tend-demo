// Tend — Recurring schedules hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recurringSchedules as mockSchedules, regularHelpers as mockRegularHelpers } from '../constants/MockData';
import { supabase } from '../lib/supabase';
import type { RecurringSchedule, RegularHelper } from '../types';

interface UseRecurringSchedulesResult {
  schedules: RecurringSchedule[];
  regularHelpers: RegularHelper[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecurringSchedules(elderId?: string): UseRecurringSchedulesResult {
  const { isDemo, profile } = useAuth();
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [regularHelpers, setRegularHelpers] = useState<RegularHelper[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const targetElderId = elderId || profile.id;

      const { data, error: fetchError } = await supabase
        .from('recurring_schedules')
        .select(`
          *,
          primary_helper:profiles!recurring_schedules_primary_helper_id_fkey(first_name, last_name),
          backup_helper:profiles!recurring_schedules_backup_helper_id_fkey(first_name, last_name)
        `)
        .eq('elder_id', targetElderId)
        .eq('is_active', true);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setSchedules(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchSchedules();
    }
  }, [isDemo, profile?.id, elderId]);

  if (isDemo) {
    return {
      schedules: mockSchedules,
      regularHelpers: mockRegularHelpers,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { schedules, regularHelpers, isLoading, error, refetch: fetchSchedules };
}
