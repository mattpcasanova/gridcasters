import { useEffect, useCallback } from 'react';
import { useSupabase } from './use-supabase';
import { showBadgeEarnedToast } from '@/lib/utils/badge-earning';

export const useBadgeChecking = () => {
  const supabase = useSupabase();

  const checkBadges = useCallback(async () => {
    try {
      const response = await fetch('/api/badges/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show toasts for newly earned badges
        if (data.newlyEarned && data.newlyEarned.length > 0) {
          data.newlyEarned.forEach((badge: any) => {
            showBadgeEarnedToast(badge);
          });
        }

        return data;
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }, []);

  // Check badges on mount
  useEffect(() => {
    checkBadges();
  }, [checkBadges]);

  return { checkBadges };
}; 