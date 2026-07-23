import { TRIP_DATE_PENDING, TRIP_LOCKED_DATES } from './CreateTripParts';
import { TRIP_COUNTS_DATE_FIXED, TRIP_COUNTS_DATE_PENDING } from './TripDetailParts';
import {
  LOMBOK_ITINERARY_DAY_1,
  LOMBOK_ITINERARY_DAY_2,
  LOMBOK_ITINERARY_PENDING_DAY,
} from './ItineraryParts';

/** Backdrop sheet aktivitas — konteks tanggal masih divoting */
export const ACTIVITY_BACKDROP_PENDING = {
  subtitle: TRIP_DATE_PENDING,
  days: [LOMBOK_ITINERARY_PENDING_DAY],
  activeDayId: 1,
  datePending: true,
  counts: TRIP_COUNTS_DATE_PENDING,
} as const;

/** Backdrop sheet aktivitas — konteks tanggal sudah pasti */
export const ACTIVITY_BACKDROP_FIXED = {
  subtitle: TRIP_LOCKED_DATES.subtitle,
  days: [LOMBOK_ITINERARY_DAY_1, LOMBOK_ITINERARY_DAY_2],
  activeDayId: 1,
  datePending: false,
  counts: TRIP_COUNTS_DATE_FIXED,
} as const;
