import { toTime } from '../../common/helpers/date.helpers';

type WishlistLike = {
  id: string;
  userId: string;
  placeName: string;
  startTime: Date | null;
  endTime: Date | null;
  locationLabel: string | null;
  mapsLink: string | null;
  refLinks: unknown;
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
      maps_link: wishlist.mapsLink,
      ref_links: (wishlist.refLinks as { url: string; label?: string }[]) ?? [],
      notes: wishlist.notes,
      tags: (wishlist.tags as string[]) ?? [],
      priority_level: wishlist.priorityLevel,
      thumbnail_url: wishlist.thumbnailUrl,
      created_at: wishlist.createdAt.toISOString(),
      updated_at: wishlist.updatedAt.toISOString(),
    };
  }
}
