// Tend — Bookings hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookings as mockBookings } from '../constants/MockData';
import * as bookingsService from '../services/bookings.service';
import type { Booking } from '../types';

interface UseBookingsResult {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBookings(): UseBookingsResult {
  const { isDemo, role, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (isDemo || !profile?.id || !role) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await bookingsService.getBookingsForUser(
        profile.id,
        role as 'elder' | 'helper'
      );
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform Supabase data to match Booking interface
        setBookings(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchBookings();
    }
  }, [isDemo, profile?.id, role]);

  if (isDemo) {
    // Filter mock bookings based on current user role
    const filteredBookings = role === 'elder'
      ? mockBookings.filter((b) => b.elderId === 'elder-1')
      : role === 'helper'
      ? mockBookings.filter((b) => b.helperId === 'helper-1')
      : mockBookings.filter((b) => b.elderId === 'elder-1'); // family sees elder's bookings

    return {
      bookings: filteredBookings,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { bookings, isLoading, error, refetch: fetchBookings };
}
