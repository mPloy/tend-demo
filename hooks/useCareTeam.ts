// Tend — Care team hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { careTeamMembers as mockCareTeam, helpers as mockHelpers } from '../constants/MockData';
import { supabase } from '../lib/supabase';
import type { CareTeamMember, Helper } from '../types';

interface UseCareTeamResult {
  members: CareTeamMember[];
  helpers: Helper[]; // Full helper data for team members
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCareTeam(elderId?: string): UseCareTeamResult {
  const { isDemo, profile } = useAuth();
  const [members, setMembers] = useState<CareTeamMember[]>([]);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchCareTeam = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const targetElderId = elderId || profile.id;
      const { data, error: fetchError } = await supabase
        .from('care_team_members')
        .select(`
          *,
          helper:profiles!care_team_members_helper_id_fkey(
            *,
            helper_profiles(*)
          )
        `)
        .eq('elder_id', targetElderId);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMembers(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchCareTeam();
    }
  }, [isDemo, profile?.id, elderId]);

  if (isDemo) {
    return {
      members: mockCareTeam,
      helpers: mockHelpers,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { members, helpers, isLoading, error, refetch: fetchCareTeam };
}
