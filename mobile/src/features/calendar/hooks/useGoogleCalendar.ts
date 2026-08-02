import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { CalendarAuthUrlResponse, CalendarEventResponse } from '@atur-perjalanan/shared-types';

/**
 * Google Calendar integration (M16) — creates an event in the user's OWN
 * calendar. If the user hasn't connected yet, the flow first opens the OAuth
 * consent URL; after the callback returns the user taps again to create.
 */
export function useGetCalendarAuthUrl() {
  return useMutation<CalendarAuthUrlResponse, Error, { redirect?: string }>({
    mutationFn: ({ redirect }) =>
      apiClient.get<CalendarAuthUrlResponse>(
        `/integrations/google-calendar/auth-url${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
      ),
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
