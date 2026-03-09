// Tend — Helpers listing hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { helpers as mockHelpers } from '../constants/MockData';
import * as helpersService from '../services/helpers.service';
import type { Helper, ServiceType } from '../types';

interface UseHelpersResult {
  helpers: Helper[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHelpers(filters?: {
  service?: ServiceType;
  postalCodePrefix?: string;
  minRating?: number;
}): UseHelpersResult {
  const { isDemo } = useAuth();
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchHelpers = async () => {
    if (isDemo) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await helpersService.searchHelpers(filters);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform Supabase data to match Helper interface
        setHelpers(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchHelpers();
    }
  }, [isDemo, filters?.service, filters?.postalCodePrefix, filters?.minRating]);

  if (isDemo) {
    return {
      helpers: mockHelpers,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { helpers, isLoading, error, refetch: fetchHelpers };
}
