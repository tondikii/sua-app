import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to real-time notifications for the current user via Supabase Realtime.
 * Per ARCHITECTURE.md §6: INSERT on `notifications` table,
 * filtered by `user_id`, triggers query invalidation.
 *
 * Falls back gracefully if Supabase is not configured (dev without keys).
 */
export function useNotificationsSubscription(userId: string | undefined) {
  const qc = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase || !userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ['notifications'] });
          qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, qc]);
}
