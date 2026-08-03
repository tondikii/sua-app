import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { CalendarAuthUrlResponse, CalendarEventResponse } from '@atur-perjalanan/shared-types';

/**
 * Google Calendar integration (M16) — creates an event in the user's OWN
 * calendar. When the user has already connected their calendar, the event is
 * created directly (no Google page). Otherwise the OAuth consent flow opens
 * once, and after the callback the event is created automatically.
 */
export function useGetCalendarAuthUrl() {
  return useMutation<CalendarAuthUrlResponse, Error, { redirect?: string }>({
    mutationFn: ({ redirect }) =>
      apiClient.get<CalendarAuthUrlResponse>(
        `/integrations/google-calendar/auth-url${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
      ),
  });
}

export function useCalendarStatus() {
  return useMutation<{ connected: boolean }, Error, void>({
    mutationFn: () => apiClient.get<{ connected: boolean }>('/integrations/google-calendar/status'),
  });
}

export function useCreateCalendarEvent(tripId: string) {
  const qc = useQueryClient();
  return useMutation<CalendarEventResponse, Error, { trip_id: string }>({
    mutationFn: (payload) =>
      apiClient.post<CalendarEventResponse>('/integrations/google-calendar/events', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}
