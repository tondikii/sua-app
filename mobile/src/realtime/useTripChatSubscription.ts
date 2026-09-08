import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { TripMessage } from '@atur-perjalanan/shared-types';

type MessagesInfinite = {
  pages: { data: TripMessage[]; next_cursor: string | null; unread_count: number }[];
  pageParams: unknown[];
};

function durationToSeconds(v: unknown): number | null {
  if (!v || typeof v !== 'string') return null;
  const parts = v.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

function toTripMessageFromRow(row: any, qc: ReturnType<typeof useQueryClient>): TripMessage {
  // Try to resolve sender from cached trip/members to avoid blank avatar.
  const tripDetail = qc.getQueryData(['trip', row.trip_id ?? row.tripId]) as any;
  const membersData = qc.getQueryData(['members', row.trip_id ?? row.tripId]) as any;
  let sender: TripMessage['sender'] = null;

  const senderId = row.sender_id ?? row.senderId;
  if (tripDetail?.creator?.id === senderId) {
    sender = tripDetail.creator;
  } else if (tripDetail?.participants_preview) {
    sender = tripDetail.participants_preview.find((p: any) => p.id === senderId) ?? null;
  }
  if (!sender && membersData?.members) {
    const m = membersData.members.find((x: any) => x.id === senderId);
    if (m) sender = { id: m.id, name: m.name, username: m.username, avatar_url: m.avatar_url ?? null };
  }
  // Fallback minimal sender so bubble still renders immediately.
  if (!sender) {
    sender = { id: senderId, name: 'Teman', username: 'teman', avatar_url: null };
  }

  return {
    id: row.id,
    trip_id: row.trip_id ?? row.tripId,
    sender,
    message_kind: row.message_kind ?? row.messageKind ?? 'text',
    message_text: row.message_text ?? row.messageText ?? null,
    media_url: row.media_url ?? row.mediaUrl ?? null,
    media_duration_seconds: durationToSeconds(row.media_duration ?? row.mediaDuration),
    reply_to: null, // hydrated on next refetch if needed
    is_deleted: !!row.deleted_at ?? !!row.deletedAt,
    created_at: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  };
}

/**
 * Subscribe to real-time chat messages for a trip via Supabase Realtime.
 * Instant path: INSERT/UPDATE are merged directly into the infinite-query
 * cache via `setQueryData` so the peer sees the bubble in ~50-150ms
 * without waiting for a REST refetch. Text messages are fully optimistic;
 * media messages still get a background refetch to presign the R2 URL.
 */
export function useTripChatSubscription(tripId: string) {
  const qc = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase || !tripId) return;

    const upsertMessage = (row: any) => {
      const incoming = toTripMessageFromRow(row, qc);
      const isMedia = incoming.message_kind !== 'text' && !!incoming.media_url;

      qc.setQueryData<MessagesInfinite>(['messages', tripId], (old) => {
        if (!old) {
          return {
            pages: [{ data: [incoming], next_cursor: null, unread_count: 0 }],
            pageParams: [null],
          };
        }
        // Dedupe: if id already exists (optimistic or prior realtime), skip.
        const exists = old.pages.some((p) => p.data.some((m) => m.id === incoming.id));
        if (exists) {
          // For UPDATE (soft-delete), merge is_deleted flag.
          if (incoming.is_deleted) {
            return {
              ...old,
              pages: old.pages.map((p) => ({
                ...p,
                data: p.data.map((m) =>
                  m.id === incoming.id ? { ...m, is_deleted: true, message_text: null, media_url: null } : m,
                ),
              })),
            };
          }
          return old;
        }
        const pages = [...old.pages];
        // Remove any optimistic temp that matches text+sender+~time (fallback dedupe for own message).
        const optimisticIdx = pages[0].data.findIndex(
          (m) =>
            m.id.startsWith('optimistic-') &&
            m.message_text === incoming.message_text &&
            m.sender?.id === incoming.sender?.id,
        );
        if (optimisticIdx !== -1) {
          pages[0] = {
            ...pages[0],
            data: pages[0].data.map((m, i) => (i === optimisticIdx ? incoming : m)),
          };
          // Also ensure no duplicate real id elsewhere.
          const seen = new Set<string>();
          pages.forEach((p) => {
            p.data = p.data.filter((m) => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            });
          });
          return { ...old, pages };
        }

        pages[0] = { ...pages[0], data: [incoming, ...pages[0].data] };
        return { ...old, pages };
      });

      // Media messages need presigned URL + reply hydration: trigger a
      // debounced background refetch (doesn't block UI).
      if (isMedia || incoming.is_deleted) {
        setTimeout(() => {
          qc.invalidateQueries({ queryKey: ['messages', tripId], refetchType: 'none' });
          // Light fetch next tick to hydrate sender/media_url without flashing.
          qc.refetchQueries({ queryKey: ['messages', tripId] });
        }, 400);
      }
    };

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
        (payload) => upsertMessage((payload as any).new),
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trip_messages',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => upsertMessage((payload as any).new),
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn(`[realtime] chat:${tripId} ${status}`, err);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [tripId, qc]);
}
