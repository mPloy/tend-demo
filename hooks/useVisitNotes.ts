// Tend — Visit notes hook (family/helper views)
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { visitNotes as mockVisitNotes } from '../constants/MockData';
import * as visitsService from '../services/visits.service';
import type { VisitNote } from '../types';

interface UseVisitNotesResult {
  visitNotes: VisitNote[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVisitNotes(elderId?: string): UseVisitNotesResult {
  const { isDemo, role, profile } = useAuth();
  const [visitNotes, setVisitNotes] = useState<VisitNote[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitNotes = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const targetElderId = elderId || profile.id;
      const { data, error: fetchError } = await visitsService.getVisitNotesForElder(targetElderId);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform to match VisitNote interface
        setVisitNotes(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchVisitNotes();
    }
  }, [isDemo, profile?.id, elderId]);

  if (isDemo) {
    return {
      visitNotes: mockVisitNotes,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { visitNotes, isLoading, error, refetch: fetchVisitNotes };
}
