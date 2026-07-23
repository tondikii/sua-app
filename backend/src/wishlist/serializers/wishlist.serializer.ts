import { toTime } from '../../common/helpers/date.helpers';
import type { WishlistItem } from '@atur-perjalanan/shared-types';

type WishlistLike = {
  id: string;
  userId: string;
  placeName: string;
  startTime: Date | null;
  endTime: Date | null;
  locationLabel: string | null;
  link: string | null;
  notes: string | null;
  tags: unknown;
  priorityLevel: string;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class WishlistSerializer {
  static toItem(wishlist: WishlistLike) {
    return {
      id: wishlist.id,
      place_name: wishlist.placeName,
      start_time: toTime(wishlist.startTime),
      end_time: toTime(wishlist.endTime),
      location_label: wishlist.locationLabel,
      link: wishlist.link,
      notes: wishlist.notes,
      tags: (wishlist.tags as string[]) ?? [],
      priority_level: wishlist.priorityLevel,
      thumbnail_url: wishlist.thumbnailUrl,
      created_at: wishlist.createdAt.toISOString(),
      updated_at: wishlist.updatedAt.toISOString(),
    };
  }
}
