// Tend — Family alerts hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { familyAlerts as mockAlerts } from '../constants/MockData';
import * as alertsService from '../services/alerts.service';
import type { FamilyAlert } from '../types';

interface UseFamilyAlertsResult {
  alerts: FamilyAlert[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  markRead: (alertId: string) => Promise<void>;
  refetch: () => void;
}

export function useFamilyAlerts(): UseFamilyAlertsResult {
  const { isDemo, profile } = useAuth();
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    if (isDemo || !profile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await alertsService.getAlertsForFamily(profile.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setAlerts(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchAlerts();
    }
  }, [isDemo, profile?.id]);

  const markRead = async (alertId: string) => {
    if (isDemo) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
      );
      return;
    }
    await alertsService.markAlertRead(alertId);
    fetchAlerts();
  };

  const currentAlerts = isDemo ? mockAlerts : alerts;
  const unreadCount = currentAlerts.filter((a) => !a.read).length;

  if (isDemo) {
    return {
      alerts: mockAlerts,
      isLoading: false,
      error: null,
      unreadCount,
      markRead,
      refetch: () => {},
    };
  }

  return { alerts, isLoading, error, unreadCount, markRead, refetch: fetchAlerts };
}
