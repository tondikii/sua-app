import { timeToHHMM, dateToISO } from '../../common/helpers/date.helpers';
import type { TripActivity } from '@atur-perjalanan/shared-types';

type ActivityLike = {
  id: string;
  tripId: string;
  placeName: string;
  activityDate: Date | null;
  startTime: Date;
  endTime: Date;
  kind: string;
  description: string | null;
  locationLabel: string | null;
  mapsLink: string | null;
  refLinks: any;
  coverSource: string;
  coverIcon: string | null;
  coverDocumentId: string | null;
  thumbnailUrl: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type DocumentLike = {
  id: string;
  storageUrl: string;
};

export class ActivitySerializer {
  static toList(
    activity: ActivityLike,
    coverDocument?: DocumentLike | null,
    coverThumbnailUrl?: string | null,
  ) {
    return {
      id: activity.id,
      place_name: activity.placeName,
      activity_date: dateToISO(activity.activityDate),
      start_time: timeToHHMM(activity.startTime),
      end_time: timeToHHMM(activity.endTime),
      kind: activity.kind,
      description: activity.description,
      location_label: activity.locationLabel,
      maps_link: activity.mapsLink,
      ref_links: activity.refLinks || [],
      cover_source: activity.coverSource,
      cover_icon: activity.coverIcon,
      cover_document_id: activity.coverDocumentId,
      thumbnail_url:
        activity.thumbnailUrl || coverThumbnailUrl || coverDocument?.storageUrl || null,
      sort_order: activity.sortOrder,
      created_at: activity.createdAt.toISOString(),
      updated_at: activity.updatedAt.toISOString(),
    };
  }

  static toDetail(
    activity: ActivityLike,
    coverDocument?: DocumentLike | null,
    coverThumbnailUrl?: string | null,
  ) {
    return {
      id: activity.id,
      place_name: activity.placeName,
      activity_date: dateToISO(activity.activityDate),
      start_time: timeToHHMM(activity.startTime),
      end_time: timeToHHMM(activity.endTime),
      kind: activity.kind,
      description: activity.description,
      location_label: activity.locationLabel,
      maps_link: activity.mapsLink,
      ref_links: activity.refLinks || [],
      cover_source: activity.coverSource,
      cover_icon: activity.coverIcon,
      cover_document_id: activity.coverDocumentId,
      thumbnail_url:
        activity.thumbnailUrl || coverThumbnailUrl || coverDocument?.storageUrl || null,
      sort_order: activity.sortOrder,
      created_at: activity.createdAt.toISOString(),
      updated_at: activity.updatedAt.toISOString(),
    };
  }
}
