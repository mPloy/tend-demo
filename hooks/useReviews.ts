// Tend — Reviews hook
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviews as mockReviews } from '../constants/MockData';
import * as helpersService from '../services/helpers.service';
import type { Review } from '../types';

interface UseReviewsResult {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReviews(userId?: string): UseReviewsResult {
  const { isDemo, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || profile?.id;

  const fetchReviews = async () => {
    if (isDemo || !targetUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await helpersService.getHelperReviews(targetUserId);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        // TODO: Transform to match Review interface
        setReviews(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      fetchReviews();
    }
  }, [isDemo, targetUserId]);

  if (isDemo) {
    // Filter mock reviews for the target user
    const filtered = targetUserId
      ? mockReviews.filter((r) => r.toUserId === targetUserId)
      : mockReviews;

    return {
      reviews: filtered,
      isLoading: false,
      error: null,
      refetch: () => {},
    };
  }

  return { reviews, isLoading, error, refetch: fetchReviews };
}
