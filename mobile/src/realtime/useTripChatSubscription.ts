import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to real-time chat messages for a trip via Supabase Realtime.
 * Per ARCHITECTURE.md §6: INSERT/UPDATE on `trip_messages` table,
 * filtered by `trip_id`.
 *
 * The raw Realtime payload is a Prisma/DB row (sender_id, raw media key),
 * NOT the hydrated API shape — so on every event we invalidate the
 * messages query to refetch via the REST endpoint, which hydrates
 * `sender`, presigns `media_url`, and recomputes `unread_count`.
 *
 * Falls back gracefully if Supabase is not configured (dev without keys).
 */
export function useTripChatSubscription(tripId: string) {
  const qc = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase || !tripId) return;

    const channel = supabase
      .channel(`chat:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trip_messages',
          filter: `trip_id=eq.${tripId}`,
        },
        () => {
          // Refetch via REST to get the hydrated (sender + presigned URL) shape.
          qc.invalidateQueries({ queryKey: ['messages', tripId] });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trip_messages',
          filter: `trip_id=eq.${tripId}`,
        },
        () => {
          // Soft-delete updates the row; refetch to reflect "Pesan dihapus".
          qc.invalidateQueries({ queryKey: ['messages', tripId] });
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
  }, [tripId, qc]);
}
