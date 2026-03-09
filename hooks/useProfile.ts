// Tend — Profile hook (current user's profile data)
// Dual-mode: demo returns MockData, live queries Supabase
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { currentElder, currentHelper, currentFamilyMember, helpers } from '../constants/MockData';
import * as profilesService from '../services/profiles.service';
import type { Elder, Helper, FamilyMember } from '../types';

interface UseProfileResult {
  elder: Elder | null;
  helper: Helper | null;
  family: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(): UseProfileResult {
  const { isDemo, role, profile } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      let result;
      if (role === 'elder') {
        result = await profilesService.getElderProfile(profile.id);
      } else if (role === 'helper') {
        result = await profilesService.getHelperProfile(profile.id);
      } else if (role === 'family') {
        result = await profilesService.getFamilyProfile(profile.id);
      }

      if (result?.error) {
        setError(result.error.message);
      } else {
        setData(result?.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchProfile();
    }
  }, [isDemo, profile?.id, role]);

  // Demo mode — return mock data directly
  if (isDemo) {
    return {
      elder: role === 'elder' ? currentElder : null,
      helper: role === 'helper' ? helpers[0] : null, // Sarah Williams (helper-1)
      family: role === 'family' ? currentFamilyMember : null,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  // TODO: Transform Supabase row data to match TypeScript interfaces
  // For now, return the raw data; will be refined in Phase 4
  return {
    elder: role === 'elder' ? data : null,
    helper: role === 'helper' ? data : null,
    family: role === 'family' ? data : null,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
