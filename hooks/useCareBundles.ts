// Tend — Care bundles hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { careBundles as mockBundles } from '../constants/MockData';
import * as bundlesService from '../services/bundles.service';
import type { CareBundle } from '../types';

interface UseCareBundlesResult {
  bundles: CareBundle[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCareBundles(): UseCareBundlesResult {
  const { isDemo } = useAuth();
  const [bundles, setBundles] = useState<CareBundle[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = async () => {
    if (isDemo) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await bundlesService.getActiveBundles();
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform to match CareBundle interface
        setBundles(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchBundles();
    }
  }, [isDemo]);

  if (isDemo) {
    return {
      bundles: mockBundles,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { bundles, isLoading, error, refetch: fetchBundles };
}
